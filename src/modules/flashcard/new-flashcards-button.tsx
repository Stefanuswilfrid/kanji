"use client";
import { useLocale } from "@/locales/use-locale";
import { useState } from "react";
import { Flashcard } from "./useJLPTFlashcard";
import { AddNewFlashcardModal } from "./add-new-flashcard-modal";

export function AddNewFlashcardButton({
  setFlashcards,
}: {
  setFlashcards: React.Dispatch<React.SetStateAction<Array<Flashcard>>>;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddNewFlashcardModal
        setFlashcards={setFlashcards}
        open={open}
        onClose={() => setOpen(false)}
      />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-md font-medium max-md:w-full text-white p-3 md:py-2.5 md:px-4 duration-200 bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {t.add}
      </button>
    </>
  );
}