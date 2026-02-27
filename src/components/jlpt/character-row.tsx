"use client";

import { JapaneseCharacter } from "@/data/constants";
import clsx from "clsx";
import { MarkAsCompleted } from "./mark-as-completed";

export function CharacterRow({
  id,
  kanji,
  reading,
  translations,
  isCompleted,
  onClick,
  onCompleteToggle,
}: JapaneseCharacter & {
  isCompleted: boolean;
  onClick?: () => void;
  onCompleteToggle: () => void;
}) {
  const handleRowClick = onClick ?? (() => {});

  return (
    <div
      onClick={handleRowClick}
      className={clsx("relative group transition select-none", isCompleted ? "text-smokewhite" : "text-lightgray")}
    >
      <div className="pl-3 pr-4 pt-7 pb-3 flex gap-2 items-center transition border-b border-b-secondary/10 bg-softblack active:bg-hovered">
        <div className="shrink-0 font-medium text-4xl">{kanji}</div>
        <MarkAsCompleted
          className={isCompleted ? "bg-transparent" : ""}
          isCompleted={isCompleted}
          onClick={onCompleteToggle}
        />
        <div className="absolute left-4 top-3 text-xs">{id}</div>
        <div className="pl-1 pt-0.5">
          <div className="text-sm text-secondary">{reading}</div>
          <div className="text-xs text-secondary">{translations.join(", ")}</div>
        </div>
      </div>
    </div>
  );

}