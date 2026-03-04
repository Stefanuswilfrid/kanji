import { Divider } from "@/components/divider";
import { cn } from "@/lib/utils";
import { useLocale } from "@/locales/use-locale";
import { AudioButton } from "@/modules/jlpt/character/audio-button";
import type { TranslateApiResponse } from "../search-command-menu";
import React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function CommandMenuGroupCard({
  active,
  data,
  sentence,
  to,
}: {
  active: number[];
  data: TranslateApiResponse;
  sentence: string;
  to: "en" | "id";
}) {
  const { t } = useLocale();

  const showTranslations = active.includes(0);
  const showDefinitions = active.includes(1);

  const segments = React.useMemo(() => data.result.flat(), [data.result]);

  const selectableCount = React.useMemo(
    () => segments.filter((s) => !s.isPunctuation).length,
    [segments]
  );

  type Selection =
    | { kind: "none" }
    | { kind: "segment"; segIdx: number; text: string }
    | { kind: "char"; segIdx: number; charOffset: number; text: string };

  const [selection, setSelection] = React.useState<Selection>(() => {
    const idx = segments.findIndex((s) => !s.isPunctuation);
    const seg = idx >= 0 ? segments[idx] : null;
    return seg ? { kind: "segment", segIdx: idx, text: seg.simplified } : { kind: "none" };
  });

  React.useEffect(() => {
    const idx = segments.findIndex((s) => !s.isPunctuation);
    const seg = idx >= 0 ? segments[idx] : null;
    setSelection(seg ? { kind: "segment", segIdx: idx, text: seg.simplified } : { kind: "none" });
  }, [data, segments]);

  const selectedText = selection.kind === "none" ? "" : selection.text;
  const selectedSeg = selection.kind === "none" ? null : segments[selection.segIdx] ?? null;
  const isSelectedPunctuation = !!selectedSeg?.isPunctuation;

  const { data: lookupData, isFetching: isLookupLoading } = useQuery({
    queryKey: ["dict-lookup", to, selectedText],
    enabled: !!selectedText && !isSelectedPunctuation,
    placeholderData: keepPreviousData,
    queryFn: async (): Promise<TranslateApiResponse> => {
      const res = await fetch(
        `/api/translate?to=${encodeURIComponent(to)}&text=${encodeURIComponent(selectedText)}`
      );
      if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
      return (await res.json()) as TranslateApiResponse;
    },
  });

  const lookupSeg = lookupData?.result?.flat()?.find((s) => !s.isPunctuation) ?? null;
  const lookupEntries = lookupSeg?.entries ?? [];

  const [selectedEntryIndex, setSelectedEntryIndex] = React.useState(0);
  React.useEffect(() => {
    setSelectedEntryIndex(0);
  }, [selectedText]);

  const safeEntryIndex = Math.min(selectedEntryIndex, Math.max(0, lookupEntries.length - 1));
  const activeEntry = lookupEntries[safeEntryIndex];
  const selectedGloss = activeEntry?.glosses?.[0];
  const hasMultipleWords = selectableCount > 1;

  return (
    <div className="rounded-lg border border-secondary/10 bg-softblack">
      <div className="px-3 sm:px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-secondary/80">Query</p>
            <div className="mt-1 text-2xl md:text-3xl tracking-wide break-words">
              {segments.map((seg, idx) => {
                if (seg.isPunctuation) {
                  return (
                    <span key={`${seg.index}-${idx}`} className="text-secondary/80 whitespace-pre-wrap">
                      {seg.simplified}
                    </span>
                  );
                }

                const text = seg.simplified ?? "";
                const isSegSelected = selection.kind === "segment" && selection.segIdx === idx;
                const isCharSelected = selection.kind === "char" && selection.segIdx === idx;

                // If the token has multiple chars, allow selecting per character.
                if (text.length > 1) {
                  return (
                    <span
                      key={`${seg.index}-${text}-${idx}`}
                      className={cn(
                        "inline-flex items-center rounded-md px-1 py-0.5 -mx-0.5 transition",
                        isSegSelected && "bg-sky-500/15 ring-1 ring-inset ring-sky-500/40"
                      )}
                      onClick={() => {
                        setSelection({ kind: "segment", segIdx: idx, text });
                      }}
                    >
                      {Array.from(text).map((ch, charOffset) => {
                        const isThisChar =
                          isCharSelected && (selection as any).charOffset === charOffset;
                        return (
                          <button
                            key={`${seg.index}-${idx}-${charOffset}`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelection({ kind: "char", segIdx: idx, charOffset, text: ch });
                            }}
                            className={cn(
                              "rounded px-1.5 py-0.5 transition hover:bg-white/5 active:opacity-80",
                              isThisChar && "bg-sky-500/15 ring-1 ring-inset ring-sky-500/40"
                            )}
                          >
                            {ch}
                          </button>
                        );
                      })}
                    </span>
                  );
                }

                const isSelected = isSegSelected || isCharSelected;
                return (
                  <button
                    key={`${seg.index}-${text}-${idx}`}
                    type="button"
                    onClick={() => setSelection({ kind: "segment", segIdx: idx, text })}
                    className={cn(
                      "inline-block rounded-md px-1.5 py-0.5 -mx-0.5 transition hover:bg-white/5 active:opacity-80",
                      isSelected && "bg-sky-500/15 ring-1 ring-inset ring-sky-500/40"
                    )}
                  >
                    {text}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="shrink-0 mt-5">
            <AudioButton speed={1} size="normal" text={sentence} />
          </div>
        </div>
      </div>

      {showTranslations && (
        <>
          <Divider className="my-0" />
          <div className="px-3 sm:px-4 py-3">
            <p className="text-xs text-secondary/80">{t.commandMenuChips?.[0] ?? "Translation"}</p>
            <p className="mt-1 text-base text-smokewhite break-words">
              {isLookupLoading ? t.loading : selectedGloss ?? lookupData?.translated ?? data.translated}
            </p>
            {hasMultipleWords && (
              <p className="mt-1 text-xs text-secondary/70 break-words">
                Full: {data.translated}
              </p>
            )}
          </div>
        </>
      )}

      {showDefinitions && (
        <>
          <Divider className="my-0" />
          <div className="px-3 sm:px-4 py-3">
            <p className="text-xs text-secondary/80">{t.commandMenuChips?.[1] ?? "Word Definition"}</p>
            {/* Definition panel for selected token */}
            <div className="mt-4 rounded-md border border-secondary/10 bg-black/20 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-secondary/80">Selected</p>
                  <p className="mt-1 text-xl tracking-wide">{selectedText}</p>
                </div>
                {!!selectedText && <AudioButton text={selectedText} size="small" />}
              </div>

              {isSelectedPunctuation && (
                <p className="mt-2 text-sm text-secondary/80">No definition for punctuation.</p>
              )}

              {!isSelectedPunctuation && isLookupLoading && (
                <p className="mt-2 text-sm text-secondary/80">{t.loading}</p>
              )}

              {!isSelectedPunctuation && !isLookupLoading && lookupEntries.length === 0 && (
                <p className="mt-2 text-sm text-secondary/80">No definition found in the local dictionary.</p>
              )}

              {!isSelectedPunctuation && !isLookupLoading && lookupEntries.length > 0 && (
                <>
                  {lookupEntries.length > 1 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lookupEntries.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedEntryIndex(i)}
                          className={cn(
                            "rounded-md px-3 py-1 text-xs border transition",
                            i === safeEntryIndex
                              ? "bg-smokewhite text-black border-smokewhite"
                              : "border-secondary/20 text-smokewhite/80 active:bg-softzinc"
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="text-sm text-secondary/80">Reading</p>
                    <p className="mt-0.5 text-base">{activeEntry?.reading}</p>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-secondary/80">Glosses</p>
                    <ul className="mt-1 ml-4 space-y-0.5">
                      {(activeEntry?.glosses ?? []).slice(0, 30).map((g, i) => (
                        <li key={i} className="list-disc text-sm">
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}