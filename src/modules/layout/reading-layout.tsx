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