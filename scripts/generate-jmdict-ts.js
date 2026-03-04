const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const zlib = require("node:zlib");
const readline = require("node:readline");
const sax = require("sax");

/**
 * Generates CC-CEDICT-ish "ts" text dictionaries for Japanese from JMdict_e.
 *
 * Output line format (similar spirit to CEDICT):
 *   <surface> <reading> [<reading>] /gloss1/gloss2/.../
 *
 * Outputs:
 * - `src/utils/tokenizer/en/jmdict_ts.u8` (English glosses)
 * - `src/utils/tokenizer/id/jmdict_ts.u8` (Indonesian glosses; derived by translating English glosses)
 *
 * NOTE: JMdict_e only contains English glosses. For Indonesian output we translate those gloss strings using
 * Google's public endpoint (same approach as `src/app/api/translate/route.ts`) and cache results so the
 * job can be resumed over multiple runs.
 */

// Prefer GitHub mirror to avoid FTP restrictions.
const JM_DICT_E_GZ = "https://raw.githubusercontent.com/echamudi/jp-resources-mirror/master/JMdict_e.gz";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function downloadToFile(url, outPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outPath);
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close(() => fs.unlinkSync(outPath));
          return resolve(downloadToFile(res.headers.location, outPath));
        }

        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          file.close(() => fs.unlinkSync(outPath));
          return reject(new Error(`Download failed (${res.statusCode ?? "unknown"}): ${url}`));
        }

        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        try {
          file.close(() => fs.unlinkSync(outPath));
        } catch {}
        reject(err);
      });
  });
}

function normalizeGloss(s) {
  return String(s)
    .replace(/\s+/g, " ")
    .trim();
}

function unique(arr) {
  return [...new Set(arr)];
}

function normalizeForm(s) {
  return String(s).trim();
}

function getArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("--")) return fallback;
  return value;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateGoogle({ text, from, to }) {
  const endpoint =
    "https://translate.googleapis.com/translate_a/single" +
    `?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}` +
    "&dt=t" +
    `&q=${encodeURIComponent(text)}`;

  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error(`Translate failed (${res.status})`);

  const data = await res.json();
  const translatedText =
    Array.isArray(data) && Array.isArray(data[0]) ? data[0].map((chunk) => chunk?.[0]).filter(Boolean).join("") : "";
  return translatedText || text;
}

async function main() {
  const repoRoot = process.cwd();
  const to = (getArg("--to", "en") || "en").toLowerCase();
  if (to !== "en" && to !== "id") {
    throw new Error(`Invalid --to ${JSON.stringify(to)}. Expected "en" or "id".`);
  }

  const maxNewTranslations = Number.parseInt(getArg("--max-new", "0"), 10) || 0; // 0 = unlimited
  const delayMs = Number.parseInt(getArg("--delay-ms", "60"), 10) || 60;

  const outDir = path.join(repoRoot, "src", "utils", "tokenizer", to);
  const outFile = path.join(outDir, "jmdict_ts.u8");
  const cacheDir = path.join(repoRoot, ".cache", "tokenizer");
  const gzPath = path.join(cacheDir, "JMdict_e.gz");
  const entriesJsonlTmp = path.join(cacheDir, "jmdict.entries.jsonl");
  const entriesLinesTmp = path.join(cacheDir, `jmdict.${to}.lines.tmp`);
  const translateCachePath = path.join(cacheDir, "translate.en-id.json");

  ensureDir(outDir);
  ensureDir(cacheDir);

  if (!fs.existsSync(gzPath)) {
    console.log(`Downloading JMdict_e.gz -> ${path.relative(repoRoot, gzPath)}`);
    await downloadToFile(JM_DICT_E_GZ, gzPath);
  } else {
    console.log(`Using cached JMdict_e.gz at ${path.relative(repoRoot, gzPath)}`);
  }

  console.log("Parsing JMdict and extracting entries...");

  const inStream = fs.createReadStream(gzPath).pipe(zlib.createGunzip());
  // JMdict contains a DOCTYPE with entity refs; non-strict parsing avoids failing on unknown entities.
  const parser = sax.createStream(false, { trim: true, normalize: true, lowercase: true });
  const tmpJsonlOut = fs.createWriteStream(entriesJsonlTmp, { encoding: "utf8" });

  /** @type {{kebs: string[], rebs: string[], glosses: string[]}} */
  let entry = { kebs: [], rebs: [], glosses: [] };
  let tagStack = [];
  /** @type {Set<string>} */
  const glossSet = new Set();

  parser.on("opentag", (node) => {
    tagStack.push({ name: node.name, attrs: node.attributes || {} });
    if (node.name === "entry") {
      entry = { kebs: [], rebs: [], glosses: [] };
    }
  });

  parser.on("text", (text) => {
    if (!text) return;
    const top = tagStack[tagStack.length - 1];
    if (!top) return;

    if (top.name === "keb") {
      entry.kebs.push(text);
      return;
    }

    if (top.name === "reb") {
      entry.rebs.push(text);
      return;
    }

    if (top.name === "gloss") {
      const lang = top.attrs["xml:lang"] ?? top.attrs["lang"];
      if (lang && lang !== "eng") return;
      entry.glosses.push(text);
    }
  });

  parser.on("closetag", (name) => {
    tagStack.pop();

    if (name !== "entry") return;

    const keb = entry.kebs.find(Boolean) ?? "";
    const reb = entry.rebs.find(Boolean) ?? "";
    const reading = reb || keb;
    if (!reading) return;

    const glosses = unique(entry.glosses.map(normalizeGloss).filter(Boolean));
    if (glosses.length === 0) return;

    const surfaces = unique([...entry.kebs, ...entry.rebs].map(normalizeForm).filter(Boolean));
    if (to === "id") {
      for (const g of glosses) glossSet.add(g);
    }

    tmpJsonlOut.write(`${JSON.stringify({ surfaces, reading, glosses })}\n`);
  });

  const parseDone = new Promise((resolve, reject) => {
    parser.on("end", resolve);
    parser.on("error", reject);
  });

  inStream.pipe(parser);
  await parseDone;
  await new Promise((r) => tmpJsonlOut.end(r));

  /** @type {Record<string, string>} */
  let translateCache = {};
  if (to === "id") {
    if (fs.existsSync(translateCachePath)) {
      try {
        translateCache = JSON.parse(fs.readFileSync(translateCachePath, "utf8"));
      } catch {
        translateCache = {};
      }
    }

    const toTranslate = [...glossSet].filter((g) => !translateCache[g]);
    console.log(`Indonesian output: ${toTranslate.length.toLocaleString()} gloss strings need translation.`);

    let translatedNow = 0;
    for (const g of toTranslate) {
      if (maxNewTranslations > 0 && translatedNow >= maxNewTranslations) break;

      try {
        const translated = await translateGoogle({ text: g, from: "en", to: "id" });
        translateCache[g] = normalizeGloss(translated);
        translatedNow += 1;
      } catch (err) {
        // Leave untranslated; the generator can be resumed later.
      }

      if (translatedNow % 100 === 0) {
        fs.writeFileSync(translateCachePath, JSON.stringify(translateCache), "utf8");
        console.log(`Translated ${translatedNow.toLocaleString()} / ${toTranslate.length.toLocaleString()} (this run)`);
      }

      if (delayMs > 0) await sleep(delayMs);
    }

    fs.writeFileSync(translateCachePath, JSON.stringify(translateCache), "utf8");
  }

  console.log("Writing dictionary lines...");
  const linesOut = fs.createWriteStream(entriesLinesTmp, { encoding: "utf8" });
  let entryCount = 0;
  let missingTranslations = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream(entriesJsonlTmp, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    /** @type {{surfaces: string[], reading: string, glosses: string[]}} */
    const obj = JSON.parse(line);
    const mappedGlosses =
      to === "id"
        ? obj.glosses.map((g) => {
            const t = translateCache[g];
            if (!t) missingTranslations += 1;
            return t || g;
          })
        : obj.glosses;

    const glossPart = `/${mappedGlosses.join("/")}/`;
    for (const surface of obj.surfaces) {
      linesOut.write(`${surface} ${obj.reading} [${obj.reading}] ${glossPart}\n`);
      entryCount += 1;
    }
  }

  await new Promise((r) => linesOut.end(r));

  const nowIso = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const nowUnix = Math.floor(Date.now() / 1000);

  console.log(`Finalizing output -> ${path.relative(repoRoot, outFile)}`);
  const header = [
    `# JMdict (JMdict_e) -> ${to}`,
    "# Electronic Dictionary Research and Development Group (EDRDG)",
    "#",
    "# License: Creative Commons Attribution-ShareAlike",
    "# https://www.edrdg.org/edrdg/licence.html",
    "#",
    "# Source:",
    `# ${JM_DICT_E_GZ}`,
    ...(to === "id"
      ? [
          "#",
          "# Translations:",
          "# Indonesian glosses are machine-translated from JMdict_e English glosses.",
          "# Translator: translate.googleapis.com (unofficial; may be rate-limited)",
        ]
      : []),
    "#",
    "#! version=1",
    "#! subversion=0",
    "#! format=ts",
    "#! charset=UTF-8",
    `#! entries=${entryCount}`,
    "#! publisher=EDRDG",
    "#! license=https://www.edrdg.org/edrdg/licence.html",
    `#! date=${nowIso}`,
    `#! time=${nowUnix}`,
    ...(to === "id" ? [`#! translated_missing=${missingTranslations}`] : []),
    "",
  ].join("\n");

  const out = fs.createWriteStream(outFile, { encoding: "utf8" });
  out.write(header);
  fs.createReadStream(entriesLinesTmp, { encoding: "utf8" }).pipe(out);

  await new Promise((resolve, reject) => {
    out.on("finish", resolve);
    out.on("error", reject);
  });

  console.log(`Done. Wrote ${entryCount.toLocaleString()} entries to ${to}.`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

