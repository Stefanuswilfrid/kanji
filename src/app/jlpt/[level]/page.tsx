
import { CHARACTERS_PER_PAGE, JLPT_LEVELS, type JapaneseCharacter, type Level } from "@/data/constants";
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

function splitMeaning(meaning: string) {
  return meaning
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
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

  const levelNum = Number(level);
  const hasPreviousLevel = JLPT_LEVELS.includes((levelNum - 1) as any);
  const hasNextLevel = JLPT_LEVELS.includes((levelNum + 1) as any);

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

  const allCharacters: Array<JapaneseCharacter & { translationsEn: Array<string> }> = charactersId.map(
    (item, idx) => {
      const en = charactersEn[idx];
      return {
        id: `N${level}-${idx + 1}`,
        kanji: item.word,
        reading: item.reading,
        translations: splitMeaning(item.meaning),
        translationsEn: splitMeaning(en?.meaning ?? item.meaning),
      };
    }
  );

  const totalPages = Math.ceil(allCharacters.length / CHARACTERS_PER_PAGE);

  const previousLevelTotalPages = hasPreviousLevel
    ? Math.ceil(
        (JSON.parse(
          await readFile(
            path.join(process.cwd(), "src", "data", "id", `n${levelNum - 1}.json`),
            "utf8"
          )
        ) as Array<unknown>).length / CHARACTERS_PER_PAGE
      )
    : 0;

  return (
    <JlptLevelClient
      level={level}
      allCharacters={allCharacters}
      totalPages={totalPages}
      previousLevelTotalPages={previousLevelTotalPages}
      hasPreviousLevel={hasPreviousLevel}
      hasNextLevel={hasNextLevel}
    />
  );
}