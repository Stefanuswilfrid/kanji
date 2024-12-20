import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import * as React from "react";
import { LoadingBar } from "@/components/jlpt/Loader";
// import { LoadingBar, HSKButton, MarkAsCompleted, preloadHanziDetails, Drawer, url, Locale } from "@/components";
import IdHanziMap from "@/data/id-hanzi-map.json";
import { KanjiApiResponse } from "./types";
import { KanjiDetails } from "./KanjiDetails/KanjiDetails";

import { useCompletedCharacters, useCompletedCharactersActions } from "@/store/useCompletedCharactersStore";
import { LAST_VIEWED_KANJI_KEY } from "@/store/useLasViewedKanji";
import { useWindowSize } from "@/hooks";
import clsx from "clsx";

import { Level } from "@/data/constants";
import { useAudio } from "@/modules/layout/jlpt-layout/audio-provider";

import { motion, AnimatePresence } from "framer-motion";
import { AddToFlashcard, AddToFlashcardMobile } from "../Flashcard";
// import { AddToFlashcard, AddToFlashcardMobile } from "../Flashcard";
import { Drawer, JLPTButton, Locale, MarkAsCompleted } from "@/components/jlpt";

export type IdHanziMapKey = keyof typeof IdHanziMap;

export function KanjiModal() {
  const router = useRouter();
  const hanzi = router.query.hanzi as IdHanziMapKey;
  const currentHanziId = router.query.id as string;

  const { width } = useWindowSize();

  React.useEffect(() => {
    const pathname = `/hsk/${router.query.level}?hanzi=${hanzi}&id=${currentHanziId}&page=${router.query.page}`;
    if (typeof window !== "undefined" && !pathname.includes("undefined")) {
      localStorage.setItem(
        LAST_VIEWED_KANJI_KEY,
        JSON.stringify({
          character: hanzi,
          pathname,
        })
      );
    }
  }, [currentHanziId, hanzi, router]);

  const currentLevel = router.query.level as unknown as Level;
  const from = router.query.from as string;

  const previousHanziId = (parseInt(currentHanziId) - 1).toString() as IdHanziMapKey;
  const nextHanziId = (parseInt(currentHanziId) + 1).toString() as IdHanziMapKey;

  const previousHanzi = currentHanziId == "1" ? undefined : IdHanziMap[previousHanziId];
  const nextHanzi = currentHanziId == "11092" ? undefined : IdHanziMap[nextHanziId];

  const { stopAudio } = useAudio();

  const locale = router.locale as Locale;

  const { data, isLoading } = useSWRImmutable<KanjiApiResponse>(
    hanzi ? url(hanzi, locale) : null,
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const completedCharacters = useCompletedCharacters();
  const currentCompletedCharacters = data?.definition && !isLoading ? completedCharacters[currentLevel] : null;
  const isCompleted = currentCompletedCharacters && currentCompletedCharacters.includes(currentHanziId);

  const { addCompletedCharacters, removeCompletedCharacters } = useCompletedCharactersActions();

  const isMobile = width < 640;

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={Boolean(hanzi)}
      onOpenChange={(open) => {
        if (!open) {
          if (Boolean(from)) {
            router.replace(`/hsk/${router.query.level}?page=${router.query.page}`, undefined, {
              shallow: true,
            });
          } else if (Boolean(hanzi)) {
            router.back();
          }
          stopAudio();
        }
      }}
    >
      <Drawer.Content
        className={clsx(
          "px-0 pt-4 pb-[120px] sm:pb-[72px] flex flex-col",
          isMobile ? "h-dvh left-0" : "h-dvh rounded-none max-w-xl w-full"
        )}
      >
        {data && <KanjiDetails currentLevel={currentLevel} currentHanzi={hanzi} {...data} />}

        <div className="absolute top-8 sm:top-4 left-0 right-0 mx-4 bg-gradient-to-b from-black h-6"></div>
        <div className="absolute bottom-24 sm:bottom-12 left-0 right-0 mx-4 bg-gradient-to-t from-black h-12"></div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="grid place-items-center absolute inset-0 h-full z-50 bg-black/50"
            >
              {<LoadingBar className="scale-150" visible />}
            </motion.div>
          )}
        </AnimatePresence>

        <MarkAsCompleted
          className="absolute top-12 sm:top-9 right-4 sm:right-8 w-12 h-12"
          checkmarkClassName="w-8 h-8"
          isCompleted={Boolean(isCompleted)}
          onClick={() => {
            if (isCompleted) {
              removeCompletedCharacters(currentLevel, currentHanziId);
            } else {
              addCompletedCharacters(currentLevel, currentHanziId);
            }
          }}
        />

        <div className="absolute bg-black max-sm:py-2 max-sm:grid max-sm:grid-cols-2 flex gap-2 bottom-0 left-0 right-0 px-3 sm:px-4 sm:pb-4">
          <JLPTButton
            onMouseEnter={() => {
              if (previousHanzi) preloadHanziDetails(previousHanzi, locale);
            }}
            disabled={!previousHanzi}
            className="shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50 whitespace-nowrap flex-1"
            onClick={() => {
              router.replace(
                `/hsk/${router.query.level}?hanzi=${previousHanzi}&id=${previousHanziId}&page=${router.query.page}`,
                undefined,
                {
                  shallow: true,
                }
              );
            }}
          >
            &#x2190; {previousHanzi}
          </JLPTButton>
          <AddToFlashcard hanzi={hanzi} isNewHSK />
          <JLPTButton
            onMouseEnter={() => {
              if (nextHanzi) preloadHanziDetails(nextHanzi, locale);
            }}
            disabled={!nextHanzi}
            className="shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50 whitespace-nowrap flex-1"
            onClick={() => {
              router.replace(
                `/hsk/${router.query.level}?hanzi=${nextHanzi}&id=${nextHanziId}&page=${router.query.page}`,
                undefined,
                {
                  shallow: true,
                }
              );
            }}
          >
            {nextHanzi} &#x2192;
          </JLPTButton>
          <AddToFlashcardMobile hanzi={hanzi} isNewHSK />
        </div>
      </Drawer.Content>
    </Drawer>
  );
}
