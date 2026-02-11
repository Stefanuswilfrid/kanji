import { useLocale } from "@/locales/use-locale";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Flashcard } from "./useJLPTFlashcard";
import { AddNewFlashcardModal } from "./add-new-flashcard-modal";

export   function AddNewFlashcardButton({
    setFlashcards,
  }: {
    setFlashcards: React.Dispatch<React.SetStateAction<Array<Flashcard>>>;
  }) {
    const { t } = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    return (
      <>
        <AddNewFlashcardModal setFlashcards={setFlashcards} />
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("add", "true");
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="shrink-0 rounded-md font-medium max-md:w-full text-white p-3 md:py-2.5 md:px-4 duration-200 bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {t.add}
        </button>
      </>
    );
  }