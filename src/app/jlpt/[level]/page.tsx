
import { CHARACTERS_PER_PAGE, JLPT_LEVELS, type JapaneseCharacter, type Level } from "@/data/constants";
import { KanjiModal } from "@/modules/jlpt/character/kanji-modal";
import { JlptLevelClient } from "@/modules/jlpt/jlpt-level-client";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return JLPT_LEVELS.flatMap((level) => [
    { level: String(level) },
    { level: `n${level}` },
  ]);
}

export default async function JlptLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level: levelParam } = await params;

  const level = (() => {
    const normalized = levelParam.startsWith("n") ? levelParam.slice(1) : levelParam;
    const n = Number.parseInt(normalized, 10);
    if (!Number.isFinite(n)) return null;
    if (!JLPT_LEVELS.includes(n as any)) return null;
    return n as Level;
  })();

  if (!level) notFound();

  const [rawId, rawEn] = await Promise.all([
    readFile(path.join(process.cwd(), "src", "data", "id", `n${level}.json`), "utf8"),
    readFile(path.join(process.cwd(), "src", "data", "en", `n${level}.json`), "utf8"),
  ]);

  const charactersId = JSON.parse(rawId) as Array<{
    word: string;
    reading: string;
    meaning: string;
    level: number;
    romaji: string;
  }>;
  const charactersEn = JSON.parse(rawEn) as Array<{
    word: string;
    reading: string;
    meaning: string;
    level: number;
    romaji: string;
  }>;

  const items: Array<JapaneseCharacter & { translationsEn: Array<string> }> = charactersId
    .slice(0, CHARACTERS_PER_PAGE)
    .map((item, idx) => {
      const en = charactersEn[idx];
      return {
        id: `N${level}-${idx + 1}`,
        kanji: item.word,
        reading: item.reading,
        translations: item.meaning.split(",").map((s) => s.trim()).filter(Boolean),
        translationsEn: (en?.meaning ?? item.meaning).split(",").map((s) => s.trim()).filter(Boolean),
      };
    });

  return  <JlptLevelClient level={level} items={items} />
  
}