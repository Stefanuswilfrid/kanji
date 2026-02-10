import { JLPTButton } from "@/components/jlpt/jlpt-link-button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/locales/use-locale";
import { useRouter } from "next/navigation";

export function AddToFlashcard({ kanji }: { kanji: string }) {
  const { t } = useLocale();

  return (
    <JLPTButton
      className={cn(
        "shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50 max-w-[240px] w-full max-sm:hidden",
      )}
      onClick={() => {}}
    >
      {t.saveToFlashcard}
    </JLPTButton>
  );
}

export function AddToFlashcardMobile({ kanji}: { kanji: string; }) {
    const router = useRouter();
  
  
    const { t } = useLocale();
  
    return (
      <JLPTButton
        className={cn(
          "shadow-none border-zinc text-smokewhite aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-smokewhite/50 col-span-2 sm:hidden",
        )}
        onClick={() => {
          
        }}
      >
        { t.saveToFlashcard}
      </JLPTButton>
    );
  }
