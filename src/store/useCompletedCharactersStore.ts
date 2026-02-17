import { Level } from "@/data/constants";
import { create } from "zustand";

interface CompletedCharactersState {
  showUncompletedOnly: boolean;
  completedCharacters: {
    [k in Level]: Array<string>;
  };

  actions: {
    handleValueMismatch: () => void;
    hydrateCompletedCharacters: () => void;
    hydrateSettings: () => void;
    addCompletedCharacters: (level: Level, id: string) => void;
    removeCompletedCharacters: (level: Level, id: string) => void;
    resetLevel: (level: Level) => void;
    toggleSettings: () => void;
  };
}

const KEY = "completed-characters";
const SETTINGS_KEY = "show-uncompleted-only";
