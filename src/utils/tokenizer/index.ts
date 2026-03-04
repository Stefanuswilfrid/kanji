import { readFile } from "node:fs/promises";
import path from "node:path";

export type DictEntry = {
  reading: string;
  glosses: string[];
};

export type TokenMatch = {
  reading: string;
  glosses: string[];
};

export type TokenizedResult = {
  text: string;
  position: { offset: number; line: number; column: number };
  matches: TokenMatch[];
};

type LoadedDict = {
  map: Map<string, DictEntry[]>;
  maxKeyLen: number;
};

const DICT_CACHE: Partial<Record<"en" | "id", Promise<LoadedDict>>> = {};

function getDictPath(to: "en" | "id") {
  // Resolve from repo root so it works under Next's compiled output paths.
  return path.join(process.cwd(), "src", "utils", "tokenizer", to, "jmdict_ts.u8");
}

function parseDictLine(line: string): { surface: string; entry: DictEntry } | null {
  if (!line || line.startsWith("#")) return null;

  // Expected: <surface> <reading> [<reading>] /g1/g2/.../
  // Surface/reading contain no spaces.
  const parts = line.trim().split(/[\s\u00A0]+/);
  const surface = parts[0] ?? "";
  const reading = parts[1] ?? "";

  const firstSlash = line.indexOf("/");
  const lastSlash = line.lastIndexOf("/");
  if (firstSlash === -1 || lastSlash <= firstSlash) return null;
  const glossBody = line.slice(firstSlash + 1, lastSlash);
  const glosses = glossBody
    .split("/")
    .map((g) => g.trim())
    .filter(Boolean);

  if (!surface || !reading || glosses.length === 0) return null;

  return { surface, entry: { reading, glosses } };
}

async function loadDict(to: "en" | "id"): Promise<LoadedDict> {
  const filePath = getDictPath(to);
  const content = await readFile(filePath, "utf8");

  const map = new Map<string, DictEntry[]>();
  let maxKeyLen = 0;

  for (const line of content.split("\n")) {
    const parsed = parseDictLine(line);
    if (!parsed) continue;
    const { surface, entry } = parsed;
    const prev = map.get(surface);
    if (prev) prev.push(entry);
    else map.set(surface, [entry]);
    if (surface.length > maxKeyLen) maxKeyLen = surface.length;
  }

  return { map, maxKeyLen: Math.min(maxKeyLen || 0, 40) };
}

async function getDict(to: "en" | "id") {
  DICT_CACHE[to] ??= loadDict(to);
  return DICT_CACHE[to]!;
}

function isJapaneseChar(ch: string) {
  return /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}々〆ヵヶー]/u.test(ch);
}

export async function segment(text: string, to: "en" | "id" = "en"): Promise<TokenizedResult[]> {
  const { map, maxKeyLen } = await getDict(to);

  /** @type {TokenizedResult[]} */
  const results: TokenizedResult[] = [];

  // Simple single-line offsets; line/column for future multi-line support.
  let offset = 0;
  let column = 0;
  let line = 0;

  while (offset < text.length) {
    const ch = text[offset]!;

    // Non-Japanese: pass through as single char token, no matches
    if (!isJapaneseChar(ch)) {
      results.push({
        text: ch,
        position: { offset, line, column },
        matches: [],
      });
      if (ch === "\n") {
        line += 1;
        column = 0;
      } else {
        column += 1;
      }
      offset += 1;
      continue;
    }

    // Longest-match dictionary segmentation
    const remaining = text.length - offset;
    const maxLen = Math.min(maxKeyLen, remaining);
    let matched: string | null = null;
    let matchedEntries: DictEntry[] | undefined;

    for (let len = maxLen; len >= 1; len -= 1) {
      const candidate = text.slice(offset, offset + len);
      const entries = map.get(candidate);
      if (entries) {
        matched = candidate;
        matchedEntries = entries;
        break;
      }
    }

    const tokenText = matched ?? ch;
    const entries = matchedEntries ?? [];

    results.push({
      text: tokenText,
      position: { offset, line, column },
      matches: entries.map((e) => ({ reading: e.reading, glosses: e.glosses })),
    });

    offset += tokenText.length;
    column += tokenText.length;
  }

  return results;
}

