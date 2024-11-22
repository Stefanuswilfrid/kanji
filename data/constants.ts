export const HSK_LEVELS = [1, 2, 3, 4, 5] as const;
export const CHARACTERS_PER_PAGE = 48;
export const CHARACTERS_PER_LEVEL = {
  1: 3463,
  2: 1831,
  3: 1797,
  4: 632,
  5: 662,

};

export type Level = keyof typeof CHARACTERS_PER_LEVEL;

export type ChineseCharacter = {
  id: string;
  hanzi: string;
  traditional: string;
  pinyin: string;
  translations: Array<string>;
};
