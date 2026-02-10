import { CHARACTERS_PER_PAGE, type JapaneseCharacter, type Level } from "@/data/constants";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type PaginationProps = {
  allCharacters: Array<JapaneseCharacter>;
  totalPages: number;
  currentLevel: Level;
  previousLevelTotalPages: number;
  hasPreviousLevel: boolean;
  hasNextLevel: boolean;
};

export function usePagination({
  allCharacters,
  totalPages,
  currentLevel,
  previousLevelTotalPages,
  hasPreviousLevel,
  hasNextLevel,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const rawPage = searchParams.get("page");
  const parsedPage = rawPage ? Number.parseInt(rawPage, 10) : 1;
  const currentPage = !Number.isFinite(parsedPage) || parsedPage < 1
    ? 1
    : Math.min(parsedPage, totalPages || 1);

  const characters = useMemo(() => {
    const start = (currentPage - 1) * CHARACTERS_PER_PAGE;
    const end = start + CHARACTERS_PER_PAGE;
    return allCharacters.slice(start, end);
  }, [allCharacters, currentPage]);

  const canNextLevel = currentPage === totalPages && hasNextLevel;
  const canPreviousLevel = currentPage === 1 && hasPreviousLevel;

  const previousHref =
    currentPage > 1
      ? `/jlpt/${currentLevel}?page=${currentPage - 1}`
      : hasPreviousLevel
        ? `/jlpt/${Number(currentLevel) - 1}?page=${previousLevelTotalPages || 1}`
        : `/jlpt/${currentLevel}?page=1`;

  const nextHref =
    currentPage < totalPages
      ? `/jlpt/${currentLevel}?page=${currentPage + 1}`
      : hasNextLevel
        ? `/jlpt/${Number(currentLevel) + 1}?page=1`
        : `/jlpt/${currentLevel}?page=${totalPages || 1}`;

  return {
    characters,
    currentPage,
    canNextLevel,
    canPreviousLevel,
    previousHref,
    nextHref,
  };
}
