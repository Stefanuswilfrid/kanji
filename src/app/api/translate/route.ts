import { NextResponse } from "next/server";

type TranslateResponse = {
  text: string;
  translatedText: string;
  from: string;
  to: string;
};

// Lightweight translation endpoint using Google Translate's public web endpoint.
// Note: This is an unofficial API and may be rate-limited/break.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") ?? "";
  const from = searchParams.get("from") ?? "auto";
  const to = searchParams.get("to") ?? "id";

  if (!text.trim()) {
    return NextResponse.json({ error: "Missing 'text' query param" }, { status: 400 });
  }

  const endpoint =
    "https://translate.googleapis.com/translate_a/single" +
    `?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}` +
    "&dt=t" +
    `&q=${encodeURIComponent(text)}`;

  const res = await fetch(endpoint, {
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Translate failed (${res.status})` }, { status: 502 });
  }

  const data = (await res.json()) as unknown;
  // Response shape: [[["translated","original",...], ...], ...]
  const translatedText =
    Array.isArray(data) && Array.isArray((data as any)[0])
      ? (data as any)[0]
          .map((chunk: any) => chunk?.[0])
          .filter(Boolean)
          .join("")
      : "";

  const body: TranslateResponse = {
    text,
    translatedText: translatedText || text,
    from,
    to,
  };

  return NextResponse.json(body);
}

