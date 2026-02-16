import { JLPTButton } from "@/components/jlpt/jlpt-link-button";
import { Level } from "@/data/constants";
import { cn } from "@/lib/utils";
import { useLocale } from "@/locales/use-locale";
import { useJLPTFlashcard } from "@/modules/flashcard/useJLPTFlashcard";
import { useParams, useRouter } from "next/navigation";

export function AddToFlashcard({ kanji }: { kanji: string }) {
  const { t } = useLocale();
  const params = useParams<{ level?: string }>();
  const level = params?.level as unknown as Level;
  const key = `JLPT ${level}`;
  const { isWordInFlashcard, addToFlashcard, removeFromFlashcard } = useJLPTFlashcard(key, kanji);

  return (
    <JLPTButton
      className={cn(
        "shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50 max-w-[240px] w-full max-sm:hidden",
        isWordInFlashcard ? "text-sky-500 border-sky-500/50" : ""

      )}
      onClick={() => {
        if (isWordInFlashcard) {
          removeFromFlashcard(key, kanji);
        } else {
          addToFlashcard(key, kanji);
        }
      }}
    >
      {isWordInFlashcard ? t.removeFromFlashcard : t.saveToFlashcard}
      </JLPTButton>
  );
}

export function AddToFlashcardMobile({ kanji}: { kanji: string; }) {
    const router = useRouter();
    const params = useParams<{ level?: string }>();
    const level = params?.level as unknown as Level;
    const key = `JLPT ${level}`;
    const { isWordInFlashcard, addToFlashcard, removeFromFlashcard } = useJLPTFlashcard(key, kanji);
  
    const { t } = useLocale();
  
    return (
      <JLPTButton
        className={cn(
          "shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50 col-span-2 sm:hidden",
          isWordInFlashcard ? "text-sky-500 border-sky-500/50" : ""

        )}
        onClick={() => {
          if (isWordInFlashcard) {
            removeFromFlashcard(key, kanji);
          } else {
            addToFlashcard(key, kanji);
          }
          
        }}
      >
      {isWordInFlashcard ? t.removeFromFlashcard : t.saveToFlashcard}
      </JLPTButton>
    );
  }
