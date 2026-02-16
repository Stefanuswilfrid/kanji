import React from "react";

import type { Flashcard } from "../flashcard/useJLPTFlashcard";

export function useFlashcardList() {
    const [flashcards, setFlashcards] = React.useState<Array<Flashcard>>([]);
  
    React.useEffect(() => {
      const savedFlashcard = localStorage.getItem("flashcard-data");
      if (savedFlashcard) {
        setFlashcards(JSON.parse(savedFlashcard).filter((f: Flashcard) => f.words.length > 0));
      }
    }, []);
  
    return { flashcards, setFlashcards };
}

export function useFlashcard(name: string) {
  const [flashcardItem, setFlashcardItem] = React.useState<Flashcard | null>(null);

  const removeFlashcard = React.useCallback(() => {
    const flashcards = localStorage.getItem("flashcard-data");
    if (flashcards) {
      const parsedFlashcards = JSON.parse(flashcards) as Array<Flashcard>;
      const newFlashcards = parsedFlashcards.filter((f) => f.chapter !== name);
      localStorage.setItem("flashcard-data", JSON.stringify(newFlashcards));
      setFlashcardItem(null);
    }
  }, [name]);

  React.useEffect(() => {
    const savedFlashcard = localStorage.getItem("flashcard-data");
    if (savedFlashcard) {
      const flashcard = JSON.parse(savedFlashcard) as Array<Flashcard>;
      const flashcardItem = flashcard.find((f) => f.chapter === name);
      if (flashcardItem) {
        setFlashcardItem(flashcardItem);
      }
    }
  }, [name]);

  return { flashcardItem, removeFlashcard };
}