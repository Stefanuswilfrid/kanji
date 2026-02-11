import { useRouter, useSearchParams } from "next/navigation";
import { Flashcard } from "./useJLPTFlashcard";
import { useLocale } from "@/locales/use-locale";

export function AddNewFlashcardModal({
    setFlashcards,
  }: {
    setFlashcards: React.Dispatch<React.SetStateAction<Array<Flashcard>>>;
  }) {
    const router = useRouter();
    const searchParams = useSearchParams();
  
    const open = searchParams.get("add") === "true";
  
    const { t } = useLocale();
  
    return (
      <div></div>
    );
  }