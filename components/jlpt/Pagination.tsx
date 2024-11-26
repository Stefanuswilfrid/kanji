import React from "react";
import { JLPTLinkButton } from "./HSKLinkButton";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  canNextLevel: boolean;
  canPreviousLevel: boolean;
  previousHref: string;
  nextHref: string;
};

export function Pagination({
  currentPage,
  canNextLevel,
  canPreviousLevel,
  totalPages,
  previousHref,
  nextHref,
}: PaginationProps) {
  return (
    <div className="max-sm:w-full flex justify-center items-center gap-1 bg-black sm:p-1">
      <JLPTLinkButton
        prefetch={false}
        shallow={currentPage !== 1}
        href={previousHref}
        disabled={currentPage === 1 && !canPreviousLevel}
      >
        &#x2190;
      </JLPTLinkButton>

      <JLPTLinkButton
        prefetch={false}
        shallow={currentPage !== totalPages}
        href={nextHref}
        disabled={currentPage === totalPages && !canNextLevel}
      >
        &#x2192;
      </JLPTLinkButton>
    </div>
  );
}
