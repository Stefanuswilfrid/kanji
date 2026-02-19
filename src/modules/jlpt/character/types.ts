export type JLPT = "N1" | "N2" | "N3" | "N4" | "N5";

export interface KanjiApiResponse {
  definition: {
    word: string;
    reading: string;
    romaji: string;
    jlpt: JLPT;
    frequency: number;
    entries: {
      pos: string[];
      meanings: string[];
    }[];
  };

  related: {
    word: string;
    reading: string;
    meaning: string;
  }[];

  idioms: {
    word: string;
    reading: string;
    meaning: string;
    type: "yojijukugo" | "idiom" | "proverb" | string;
  }[];

  lessons: {
    japanese: string;
    reading: string | null;
    english?: string;
    indonesian?: string;
    lessonInfo: {
      level: string;
    };
  }[];
}
