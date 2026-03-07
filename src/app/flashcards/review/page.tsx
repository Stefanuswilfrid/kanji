"use client";
import { LoadingBar } from "@/components/jlpt/loader/loading-bar";
import { BackRouteButton } from "@/components/route-button";
import { useLocale } from "@/locales/use-locale";
import { FlashcardReviewContent } from "@/modules/flashcard/review/content";
import { Layout } from "@/modules/layout/layout";
import { useFlashcard } from "@/modules/layout/reading-layout";
import { FlashcardedResult } from "@/server/routers/flashcard";
import { api } from "@/trpc/client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function FlashcardReview() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") as string;
  const numOfCards = searchParams.get("numOfCards") as string;
  const chapter = searchParams.get("chapter") as string;

  const { t, locale } = useLocale();
  const { flashcardItem } = useFlashcard(chapter);

  const previousWords = React.useRef<string[]>([]);

  const words = React.useMemo(() => {
    try {
      const allWords = flashcardItem?.words ?? [];

      if (category === "Random") {
        const sorted = allWords
          .sort(() => Math.random() - 0.5)
          .slice(0, Number(numOfCards));
        previousWords.current = sorted;
        return sorted;
      }

      const [start, end] = category.split("-").map(Number);
      const toReturn = allWords.slice(start - 1, end);
      previousWords.current = toReturn;
      return toReturn;
    } catch {
      return previousWords.current;
    }
  }, [category, flashcardItem?.words, numOfCards]);

  const text = words.join("-");
  const enabled = words.length > 0;
  const router = useRouter();

  const enQuery = api.flashcard.en.useQuery(
    { text },
    { enabled: enabled && locale === "en" },
  );

  const idQuery = api.flashcard.id.useQuery(
    { text },
    { enabled: enabled && locale === "id" },
  );

  const data = locale === "id" ? idQuery.data : enQuery.data;
  const isLoading = locale === "id" ? idQuery.isLoading : enQuery.isLoading;
  const [details, setDetails] = React.useState<FlashcardedResult>();

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto sm:px-8 pb-4">
          <div className="max-sm:sticky top-0 flex flex-col justify-end bg-black z-20 max-md:px-4 border-b-[1.5px] border-b-subtle">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="w-fit"
              >
                <BackRouteButton className="my-3" />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {isLoading || !data ? (
              <Layout key="loading-bar" className="absolute w-full max-w-[960px] h-80 grid place-items-center">
                <div className="flex gap-2 items-center">
                  <LoadingBar /> {t.loadingFlashcards}
                </div>
              </Layout>
            ) : (
              <Layout key="content">
                <FlashcardReviewContent
                  words={data.filter((card) => card.entries && card.entries.length > 0)}
                  onCardClick={()=>{}}
                />
              </Layout>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
