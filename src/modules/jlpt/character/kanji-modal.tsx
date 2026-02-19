"use client";
import { Drawer } from "@/components/jlpt/drawer";
import { MarkAsCompleted } from "@/components/jlpt/mark-as-completed";
import {
  CHARACTERS_PER_LEVEL,
  JLPT_LEVELS,
  type Level,
} from "@/data/constants";
import clsx from "clsx";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { KanjiDetails } from "./kanji-details/kanji-details";
import IdKanjiMap from "@/data/id-kanji-map.json";
import { JLPTButton } from "@/components/jlpt/jlpt-link-button";
import {
  AddToFlashcard,
  AddToFlashcardMobile,
} from "../flashcard/add-to-flashcard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Locale, url } from "@/components/jlpt/character-card";
import { useLocale } from "@/locales/use-locale";
import { KanjiApiResponse } from "./types";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingBar } from "@/components/jlpt/loader/loading-bar";
import { useWindowSize } from "@/hooks/useWindowSize";
export type IdKanjiMapKey = keyof typeof IdKanjiMap;

const parseLevel = (raw?: string): Level | null => {
  const n = Number.parseInt(raw?.replace(/^n/, "") ?? "", 10);
  return JLPT_LEVELS.includes(n as any) ? (n as Level) : null;
};

const parseKanjiId = (id?: string) => {
  const [, levelRaw, idxRaw] = id?.match(/^N(\d+)-(\d+)$/) ?? [];
  const level = parseLevel(levelRaw);
  const idx = Number.parseInt(idxRaw ?? "", 10);
  return level && Number.isFinite(idx) ? { level, idx } : null;
};

export function KanjiModal() {
  const router = useRouter();
  const { width } = useWindowSize();

  const params = useParams<{ level?: string }>();
  const searchParams = useSearchParams();
  const kanji = searchParams.get("kanji") as IdKanjiMapKey;
  const currentKanjiId = searchParams.get("id") as string;

  const levelParam = Array.isArray(params?.level)
    ? params.level[0]
    : params?.level;
  const currentLevel = parseLevel(levelParam) as Level;
  const parsed = parseKanjiId(currentKanjiId);
  const effectiveLevel = currentLevel ?? parsed?.level ?? null;
  const effectiveIdx = parsed?.idx ?? null;
  const lastIdx = effectiveLevel ? CHARACTERS_PER_LEVEL[effectiveLevel] : null;

  const previousIdStr =
    effectiveLevel && effectiveIdx && effectiveIdx > 1
      ? `N${effectiveLevel}-${effectiveIdx - 1}`
      : undefined;
  const nextIdStr =
    effectiveLevel && effectiveIdx && lastIdx && effectiveIdx < lastIdx
      ? `N${effectiveLevel}-${effectiveIdx + 1}`
      : undefined;

  const getKanjiById = (id?: string) =>
    id && id in IdKanjiMap ? IdKanjiMap[id as IdKanjiMapKey] : undefined;
  const previousKanji = getKanjiById(previousIdStr);
  const nextKanji = getKanjiById(nextIdStr);

  const { locale } = useLocale();

  // use swri mutable = use query
  //todo define types
  const { data, isLoading } = useQuery<KanjiApiResponse>({
    queryKey: ["kanji-details", locale, kanji],
    queryFn: async () => {
      const res = await fetch(url(kanji!, locale));
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json();
    },
    enabled: Boolean(kanji), //null
    staleTime: Infinity, //dont refetch automatically
    gcTime: 30 * 60 * 1000, //keep cached for 30 minutes
    placeholderData: keepPreviousData, //keep previous data
  });

  console.log("kanji and type of kanji", kanji, typeof kanji);
  const isMobile = width < 640;

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={Boolean(kanji)}
      onOpenChange={(open) => {
        if (!open) {
          if (true) {
            router.replace(`/jlpt/${currentLevel}?page=5`, undefined);
          } else if (Boolean(kanji)) {
            router.back();
          }
        }
      }}
    >
      <Drawer.Content
        className={clsx(
          "px-0 pt-4 pb-[120px] sm:pb-[72px] flex flex-col",
          "h-dvh rounded-none max-w-xl w-full",
        )}
      >
        { data && (
          <KanjiDetails currentLevel={currentLevel} currentKanji={kanji} {...data} />
        )}
        <div className="absolute top-8 sm:top-4 left-0 right-0 mx-4 bg-linear-to-b from-black h-6"></div>
        <div className="absolute bottom-24 sm:bottom-12 left-0 right-0 mx-4 bg-linear-to-t from-black h-12"></div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loading-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid place-items-center absolute inset-0 z-50 bg-black/50"
            >
              <LoadingBar className="scale-150" />
            </motion.div>
          )}
        </AnimatePresence>

        <MarkAsCompleted
          className="absolute top-12 sm:top-9 right-4 sm:right-8 w-12 h-12"
          checkmarkClassName="w-8 h-8"
          isCompleted={false}
          onClick={() => {}}
        />

        <div className="absolute bg-black max-sm:py-2 max-sm:grid max-sm:grid-cols-2 flex gap-2 bottom-0 left-0 right-0 px-3 sm:px-4 sm:pb-4">
          <JLPTButton
            onMouseEnter={() => {}}
            disabled={!previousKanji}
            className="shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50 whitespace-nowrap flex-1"
            onClick={() => {
              router.replace(`/jlpt/${currentLevel}?kanji=${previousKanji}&id=${previousIdStr}`, undefined);
            }}
          >
            &#x2190; {previousKanji}
          </JLPTButton>
          <AddToFlashcard kanji={kanji} />

          <JLPTButton
            onMouseEnter={() => {}}
            disabled={!nextKanji}
            className="shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50 whitespace-nowrap flex-1"
            onClick={() => {
              router.replace(`/jlpt/${currentLevel}?kanji=${nextKanji}&id=${nextIdStr}`, undefined);
            }}
          >
            {nextKanji} &#x2192;
          </JLPTButton>
          <AddToFlashcardMobile kanji={kanji} />
        </div>
      </Drawer.Content>
    </Drawer>
  );
}
