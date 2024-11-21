import { create } from "zustand";

interface LastViewedKanjiState {
  lastViewedKanji: {
    character: string;
    pathname: string;
  } | null;

  actions: {
    handleValueMismatch: () => void;
    hydrateLastViewedKanji: () => void;
  };
}

export const LAST_VIEWED_KANJI_KEY = "last-viewed-kanji";

const useLastViewedKanjiStore = create<LastViewedKanjiState>()((set) => ({
  lastViewedKanji: null,
  actions: {
    handleValueMismatch: () => {
      try {
        const lastViewedKanji = localStorage.getItem(LAST_VIEWED_KANJI_KEY);
        if (lastViewedKanji) {
          !JSON.parse(lastViewedKanji).pathname && localStorage.removeItem(LAST_VIEWED_KANJI_KEY);
        }
      } catch {
        localStorage.removeItem(LAST_VIEWED_KANJI_KEY);
      }
    },
    hydrateLastViewedKanji: () =>
      set((_) => {
        const lastViewedKanji = localStorage.getItem(LAST_VIEWED_KANJI_KEY);
        if (!lastViewedKanji) return { lastViewedKanji: null };
        return {
          lastViewedKanji: JSON.parse(lastViewedKanji),
        };
      }),
  },
}));

export const useLastViewedKanji = () => useLastViewedKanjiStore((state) => state.lastViewedKanji);

export const useLastViewedKanjiActions = () => useLastViewedKanjiStore((state) => state.actions);
