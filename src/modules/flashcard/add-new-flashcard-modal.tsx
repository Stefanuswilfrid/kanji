import { Flashcard } from "./useJLPTFlashcard";
import { useLocale } from "@/locales/use-locale";
import { RouteDialog } from "@/components/route-dialog";

export function AddNewFlashcardModal({
    setFlashcards,
    open,
    onClose,
  }: {
    setFlashcards: React.Dispatch<React.SetStateAction<Array<Flashcard>>>;
    open: boolean;
    onClose: () => void;
  }) {
    const { t } = useLocale();
  
    return (
<RouteDialog
      className="sm:max-w-lg"
      open={open}
      onClose={onClose}
      withoutOkButton
    >
      <form action="" className="space-y-4">
        <h1>Add New Flashcard Modal (WIP)</h1>
        <div className="relative">
          <input
            className="bg-transparent pl-3 pr-10 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 text-secondary focus:text-white transition-shadow duration-200 placeholder:text-secondary/50 focus:outline-none w-full"
            type="text"
            placeholder={t.placeholderFlashcardTitle}
            required
          />
          <span className="absolute text-xs bg-black/50 backdrop-blur-sm h-7 w-8 text-secondary right-1 top-1/2 -translate-y-1/2 grid place-items-center">
            {1}
          </span>
        </div>
        <div className="mt-2 flex justify-end bg-softblack">
          <button
            type="submit"
            className="block rounded-md font-medium duration-200 bg-hovered active:bg-subtle px-3 py-1.5"
          >
            OK
          </button>
        </div>
        </form>
    </RouteDialog>
            );
  }