const fs = require("fs");
const path = require("path");

function splitMeaning(meaning) {
  if (typeof meaning !== "string") return [];
  return meaning
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const EN_DIR = path.join(__dirname, "en");
// Write outputs next to this script (not inside /en).
const OUT_DIR = path.join(__dirname, "_generated");

if (!fs.existsSync(EN_DIR)) {
  throw new Error(`Missing dir: ${EN_DIR}`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs
  .readdirSync(EN_DIR)
  .filter((f) => /^n\d+\.json$/i.test(f))
  .sort((a, b) => {
    const na = Number.parseInt(a.slice(1), 10);
    const nb = Number.parseInt(b.slice(1), 10);
    return na - nb;
  });

/** @type {Record<string, string>} */
const idToKanji = {};
/** @type {Record<string, string[]>} */
const kanjiToIds = {};

for (const file of files) {
  const match = file.match(/^n(\d+)\.json$/i);
  if (!match) continue;
  const level = Number.parseInt(match[1], 10);

  const raw = fs.readFileSync(path.join(EN_DIR, file), "utf8");
  const entries = JSON.parse(raw);
  if (!Array.isArray(entries)) continue;

  const characters = entries.map((e, idx) => {
    const id = `N${level}-${idx + 1}`;
    const kanji = e?.word ?? "";

    idToKanji[id] = kanji;
    if (!kanjiToIds[kanji]) kanjiToIds[kanji] = [];
    kanjiToIds[kanji].push(id);

    return {
      id,
      kanji,
      reading: e?.reading ?? "",
      translations: splitMeaning(e?.meaning),
    };
  });

  const outFile = path.join(OUT_DIR, `n${level}.characters.json`);
  fs.writeFileSync(outFile, JSON.stringify(characters, null, 2));
  console.log(`${file} -> ${path.relative(__dirname, outFile)} (${characters.length})`);
}

fs.writeFileSync(path.join(OUT_DIR, "id-to-kanji.json"), JSON.stringify(idToKanji, null, 2));
fs.writeFileSync(path.join(OUT_DIR, "kanji-to-ids.json"), JSON.stringify(kanjiToIds, null, 2));

// Bidirectional map:
// - "N1-1" -> "現像"
// - "現像" -> "N1-1" (or "N5-714,N5-715" when duplicates exist)
/** @type {Record<string, string>} */
const bidirectional = { ...idToKanji };
for (const [kanji, ids] of Object.entries(kanjiToIds)) {
  bidirectional[kanji] = ids.join(",");
}
fs.writeFileSync(
  path.join(OUT_DIR, "id-kanji-map.bidirectional.json"),
  JSON.stringify(bidirectional, null, 2)
);