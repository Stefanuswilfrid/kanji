"use client";

import { CharacterCard } from "@/components/jlpt/character-card";
import { CharacterRow } from "@/components/jlpt/character-row";
import type { JapaneseCharacter, Level } from "@/data/constants";
import { useLocale } from "@/locales/use-locale";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KanjiModal } from "./character/kanji-modal";
import { Pagination } from "@/components/jlpt/pagination";

function storageKey(level: Level) {
  return `jlpt:completed:n${level}`;
}

function readCompleted(level: Level): Array<string> {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(level));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function writeCompleted(level: Level, ids: Array<string>) {
  try {
    window.localStorage.setItem(storageKey(level), JSON.stringify(ids));
  } catch {
    // ignore quota / privacy errors
  }
}

export function JlptLevelClient({
  level,
  items,
}: {
  level: Level;
  items: Array<JapaneseCharacter & { translationsEn: Array<string> }>;
}) {
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [completedIds, setCompletedIds] = useState<Array<string>>([]);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  useEffect(() => {
    setCompletedIds(readCompleted(level));
  }, [level]);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const toggleCompleted = useCallback(
    (id: string) => {
      setCompletedIds((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        writeCompleted(level, next);
        return next;
      });
    },
    [level]
  );

  const goToCharacter = useCallback(
    (id: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.delete("__locale");
      sp.set("id", id);
      const basePath = locale === "en" ? `/en${pathname}` : pathname;
      router.push(`${basePath}?${sp.toString()}`);
    },
    [locale, pathname, router, searchParams]
  );

  return (
    <>
      <KanjiModal/>
      <div className="relative h-dvh pt-12 w-full">

    <div className="pt-5 sm:pr-1 pb-4 sm:pb-20 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-1">
      {items.map((character) => {
        const isCompleted = completedSet.has(character.id);
        const characterForLocale: JapaneseCharacter = {
          id: character.id,
          kanji: character.kanji,
          reading: character.reading,
          translations: locale === "en" ? character.translationsEn : character.translations,
        };

        return (
          <div key={character.id}>
            <div className="sm:hidden">
              <CharacterRow
                {...characterForLocale}
                isCompleted={isCompleted}
                onClick={() => goToCharacter(character.id)}
                onCompleteToggle={() => toggleCompleted(character.id)}
              />
            </div>

            <div className="hidden sm:block">
              <CharacterCard
                {...characterForLocale}
                isCompleted={isCompleted}
                kanjiHref={`/jlpt/${level}/?kanji=${character.kanji}&id=${character.id}&page=1`}
                isFlipped={flippedId === character.id}
                onFlip={() => setFlippedId((prev) => (prev === character.id ? null : character.id))}
                onCompleteToggle={() => toggleCompleted(character.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
    </div>
    <div className="fixed w-full left-0 max-w-[1440px] mx-auto max-sm:border-t border-t-secondary/10 p-1 max-sm:bg-black bottom-0 md:right-4 md:px-4 flex justify-end mt-8 gap-1">
      <Pagination
        currentPage={1}
        totalPages={4}
        canNextLevel={true}
        canPreviousLevel={true}
        previousHref={"previousHref"}
        nextHref={"nextHref"}
      />
    </div>

    </>
  );
}

