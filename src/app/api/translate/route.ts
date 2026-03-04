import { NextResponse } from "next/server";
import { segment } from "@/utils/tokenizer";

export const runtime = "nodejs";

export type TranslateApiResponse = {
  result: SegmentedResult[][];
  translated: string;
};

export type SegmentedResult = {
  index: number;
  simplified: string;
  traditional: string;
  entries?: Array<{
    reading: string;
    glosses: string[];
  }>;
  isPunctuation: boolean;
};

const PUNCTUATIONS =
  /([\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}々〆ヵヶー]+|\d+|[a-zA-Z0-9]+|[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}々〆ヵヶー\dA-Za-z0-9]+)/gu;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") ?? "";
  const to = (searchParams.get("to") ?? "en") as "en" | "id";

  if (!text.trim()) {
    return NextResponse.json({ error: "Missing 'text' query param" }, { status: 400 });
  }

  if (to !== "en" && to !== "id") {
    return NextResponse.json({ error: "Invalid 'to' param. Use 'en' or 'id'." }, { status: 400 });
  }

  try {
    const parts = text.match(PUNCTUATIONS) ?? [];

    // Build segments (same structure as your older API: array of arrays).
    let passedIndex = 0;
    const result: SegmentedResult[][] = [];

    for (const part of parts) {
      // If it contains Japanese scripts, dictionary-segment it; otherwise treat as punctuation/other.
      const hasJapanese = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}々〆ヵヶー]/u.test(part);
      if (!hasJapanese) {
        result.push([
          {
            index: passedIndex,
            simplified: part,
            traditional: part,
            isPunctuation: true,
          },
        ]);
        passedIndex += part.length;
        continue;
      }

      const tokens = await segment(part, to);
      const seg = tokens.map((tok) => {
        const currentIndex = passedIndex;
        passedIndex += tok.text.length;

        const entries =
          tok.matches.length > 0
            ? tok.matches.map((m) => ({
                reading: m.reading,
                glosses: m.glosses,
              }))
            : undefined;

        return {
          index: currentIndex,
          simplified: tok.text,
          traditional: tok.text,
          entries,
          isPunctuation: false,
        } satisfies SegmentedResult;
      });

      result.push(seg);
    }

    // Naive “translation”: take first gloss of first entry for each token, keep punctuation.
    const translated = result
      .flat()
      .map((seg) => {
        if (seg.isPunctuation) return seg.simplified;
        const first = seg.entries?.[0]?.glosses?.[0];
        return first ? `${first} ` : `${seg.simplified} `;
      })
      .join("")
      .replace(/\s+([,.;:!?。！？、])/g, "$1")
      .trim();

    const body: TranslateApiResponse = { result, translated };
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

