import { CHARACTERS_PER_PAGE, JLPT_LEVELS, type Level } from "@/data/constants";
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
  const localeDir = "en";

  const level = (() => {
    const normalized = levelParam.startsWith("n") ? levelParam.slice(1) : levelParam;
    const n = Number.parseInt(normalized, 10);
    if (!Number.isFinite(n)) return null;
    if (!JLPT_LEVELS.includes(n as any)) return null;
    return n as Level;
  })();

  if (!level) notFound();

  const filePath = path.join(process.cwd(), "src", "data", localeDir, `n${level}.json`);
  const raw = await readFile(filePath, "utf8");
  const allWords = JSON.parse(raw) as Array<{
    word: string;
    reading: string;
    meaning: string;
    level: number;
    romaji: string;
  }>;

  const totalPages = Math.ceil(allWords.length / CHARACTERS_PER_PAGE);

  return (
    <div className="relative h-dvh pt-12 w-full">
      <div className="w-full h-full overflow-y-auto scrollbar max-sm:pb-12">
        <div className="pt-5 sm:pr-1 pb-4 sm:pb-20 w-full">
          <div className="mb-4">
            <p className="text-sm text-secondary">Locale: {localeDir.toUpperCase()}</p>
            <p className="text-lg font-bold">JLPT N{level}</p>
            <p className="text-sm text-secondary">
              Words: {allWords.length} · Pages: {totalPages}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-1">
            {allWords.slice(0, CHARACTERS_PER_PAGE).map((w) => (
              <div
                key={`${w.word}-${w.reading}`}
                className="rounded-md border border-secondary/10 bg-softblack p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{w.word}</span>
                  <span className="text-xs text-secondary">{w.romaji}</span>
                </div>
                <div className="text-sm text-secondary">{w.reading}</div>
                <div className="mt-2 text-sm">{w.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

