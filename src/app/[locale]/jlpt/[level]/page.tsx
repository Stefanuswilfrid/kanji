import { CHARACTERS_PER_PAGE, JLPT_LEVELS, type Level } from "@/data/constants";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";

type Locale = "en" | "id";

type JlptWord = {
  word: string;
  reading: string;
  meaning: string;
  level: number;
  romaji: string;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const locales: Locale[] = ["en", "id"];
  return locales.flatMap((locale) =>
    JLPT_LEVELS.map((level) => ({ locale, level: String(level) })),
  );
}

function parseLocaleParam(value: string | undefined): Locale | null {
  if (value === "en" || value === "id") return value;
  return null;
}

function parseLevelParam(value: string | undefined): Level | null {
  if (!value) return null;
  const normalized = value.startsWith("n") ? value.slice(1) : value;
  const n = Number.parseInt(normalized, 10);
  if (!Number.isFinite(n)) return null;
  if (!JLPT_LEVELS.includes(n as any)) return null;
  return n as Level;
}

async function getWordsOnLevel(level: Level, locale: Locale): Promise<JlptWord[]> {
  const filePath = path.join(process.cwd(), "src", "data", locale, `n${level}.json`);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as JlptWord[];
}

export default async function JlptLevelPage({
  params,
}: {
  params: Promise<{ locale: string; level: string }>;
}) {
  const { locale: localeParam, level: levelParam } = await params;
  const locale = parseLocaleParam(localeParam);
  const level = parseLevelParam(levelParam);
  if (!locale || !level) notFound();

  const allWords = await getWordsOnLevel(level, locale);
  const totalPages = Math.ceil(allWords.length / CHARACTERS_PER_PAGE);

  return (
    <div className="relative h-dvh pt-12 w-full">
      <div className="w-full h-full overflow-y-auto scrollbar max-sm:pb-12">
        <div className="pt-5 sm:pr-1 pb-4 sm:pb-20 w-full">
          <div className="mb-4">
            <p className="text-sm text-secondary">Locale: {locale.toUpperCase()}</p>
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

