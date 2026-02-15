import { useRouter, useSearchParams } from "next/navigation";
import { Flashcard } from "./useJLPTFlashcard";
import { useLocale } from "@/locales/use-locale";
import { RouteDialog } from "@/components/route-dialog";

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
<RouteDialog
      className="sm:max-w-lg"
      open={open}
      onClose={() => {
        router.back();
      }}
      withoutOkButton
    >
        <h1>test</h1>
    </RouteDialog>
            );
  }