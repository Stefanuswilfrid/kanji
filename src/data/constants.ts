export const JLPT_LEVELS = [1, 2, 3, 4, 5] as const;
export const CHARACTERS_PER_PAGE = 48;
export const CHARACTERS_PER_LEVEL = {
  1: 2699,
  2: 1748,
  3: 2139,
  4: 668,
  5: 718,
};

export type Level = keyof typeof CHARACTERS_PER_LEVEL;
