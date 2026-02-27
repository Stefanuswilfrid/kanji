"use client";

import { CharacterCard } from "@/components/jlpt/character-card";
import { CharacterRow } from "@/components/jlpt/character-row";
import type { JapaneseCharacter, Level } from "@/data/constants";
import { usePagination } from "@/hooks/usePagination";
import { useLocale } from "@/locales/use-locale";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KanjiModal } from "./character/kanji-modal";
import { Pagination } from "@/components/jlpt/pagination";
import {
  useCompletedCharacters,
  useCompletedCharactersActions,
} from "@/store/useCompletedCharactersStore";

export function JlptLevelClient({
  level,
  allCharacters,
  totalPages,
  previousLevelTotalPages,
  hasPreviousLevel,
  hasNextLevel,
}: {
  level: Level;
  allCharacters: Array<JapaneseCharacter & { translationsEn: Array<string> }>;
  totalPages: number;
  previousLevelTotalPages: number;
  hasPreviousLevel: boolean;
  hasNextLevel: boolean;
}) {
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  type JLPTCharacter = JapaneseCharacter & { translationsEn: Array<string> };

  const {
    characters,
    currentPage,
    previousHref,
    nextHref,
    canNextLevel,
    canPreviousLevel,
  } = usePagination({
    allCharacters: allCharacters as Array<JapaneseCharacter>,
    totalPages,
    currentLevel: level,
    previousLevelTotalPages,
    hasPreviousLevel,
    hasNextLevel,
  });

  const items = characters as Array<JLPTCharacter>;

  const withLocalePrefix = useCallback(
    (href: string) => (locale === "en" ? `/en${href}` : href),
    [locale],
  );

  const {
    handleValueMismatch,
    hydrateSettings,
    hydrateCompletedCharacters,
    addCompletedCharacters,
    removeCompletedCharacters,
  } = useCompletedCharactersActions();

  const completedCharacters = useCompletedCharacters();
  const currentCompletedCharacters = completedCharacters[level] ?? [];
  const [flippedId, setFlippedId] = useState<string | null>(null);

  useEffect(() => {
    // hydrate from localStorage once on client
    handleValueMismatch();
    hydrateSettings();
    hydrateCompletedCharacters();
  }, [handleValueMismatch, hydrateCompletedCharacters, hydrateSettings]);

  const completedSet = useMemo(
    () => new Set(currentCompletedCharacters),
    [currentCompletedCharacters],
  );

  const toggleCompleted = useCallback(
    (id: string) => {
      if (completedSet.has(id)) removeCompletedCharacters(level, id);
      else addCompletedCharacters(level, id);
    },
    [addCompletedCharacters, completedSet, level, removeCompletedCharacters],
  );

  const goToCharacter = useCallback(
    (id: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.delete("__locale");
      sp.set("id", id);
      sp.set("page", String(currentPage));
      const basePath = locale === "en" ? `/en${pathname}` : pathname;
      router.push(`${basePath}?${sp.toString()}`);
    },
    [currentPage, locale, pathname, router, searchParams],
  );

  return (
    <>
      <KanjiModal />
      <div className="relative h-dvh pt-12 w-full">
        <div className="pt-5 sm:pr-1 pb-4 sm:pb-20 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-1">
          {items.map((character) => {
            const isCompleted = completedSet.has(character.id);
            const characterForLocale: JapaneseCharacter = {
              id: character.id,
              kanji: character.kanji,
              reading: character.reading,
              translations:
                locale === "en"
                  ? character.translationsEn
                  : character.translations,
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
                    locale={locale}
                    kanjiHref={`${withLocalePrefix(`/jlpt/${level}`)}?kanji=${character.kanji}&id=${character.id}&page=${currentPage}`}
                    isFlipped={flippedId === character.id}
                    onFlip={() =>
                      setFlippedId((prev) =>
                        prev === character.id ? null : character.id,
                      )
                    }
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
          currentPage={currentPage}
          totalPages={totalPages}
          canNextLevel={canNextLevel}
          canPreviousLevel={canPreviousLevel}
          previousHref={withLocalePrefix(previousHref)}
          nextHref={withLocalePrefix(nextHref)}
        />
      </div>
    </>
  );
}
