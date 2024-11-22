import React from "react";
import { useJlptFlashcard } from "./useJlptFlashcard";
// import { useHskFlashcard } from "./useHskFlashcard";
import { useRouter } from "next/router";
import { JLPTButton } from "@/components";
// import { HSKButton } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { cn } from "@/utils";

export function AddToFlashcard({ hanzi, isNewHSK = false }: { hanzi: string; isNewHSK?: boolean }) {
  const router = useRouter();
  const level = router.query.level as string;

  const key = `${isNewHSK ? "New HSK" : "Old HSK"}-HSK ${level}`;
  const { isWordInFlashcard, addToFlashcard, removeFromFlashcard } = useJlptFlashcard(key, hanzi);

  const { t } = useLocale();

  return (
    <JLPTButton
      className={cn(
        "shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50 max-w-[240px] w-full max-sm:hidden",
        isWordInFlashcard ? "text-sky-500 border-sky-500/50" : ""
      )}
      onClick={() => {
        if (isWordInFlashcard) {
          removeFromFlashcard(key, hanzi);
        } else {
          addToFlashcard(key, hanzi);
        }
      }}
    >
      {isWordInFlashcard ? t.removeFromFlashcard : t.saveToFlashcard}
    </JLPTButton>
  );
}

export function AddToFlashcardMobile({ hanzi, isNewHSK = false }: { hanzi: string; isNewHSK?: boolean }) {
  const router = useRouter();
  const level = router.query.level as string;

  const key = `${isNewHSK ? "New HSK" : "Old HSK"}-HSK ${level}`;
  const { isWordInFlashcard, addToFlashcard, removeFromFlashcard } = useJlptFlashcard(key, hanzi);

  const { t } = useLocale();

  return (
    <JLPTButton
      className={cn(
        "shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50 col-span-2 sm:hidden",
        isWordInFlashcard ? "text-sky-500 border-sky-500/50" : ""
      )}
      onClick={() => {
        if (isWordInFlashcard) {
          removeFromFlashcard(key, hanzi);
        } else {
          addToFlashcard(key, hanzi);
        }
      }}
    >
      {isWordInFlashcard ? t.removeFromFlashcard : t.saveToFlashcard}
    </JLPTButton>
  );
}
