"use client";

import { JapaneseCharacter } from "@/data/constants";
import clsx from "clsx";
import { MarkAsCompleted } from "./mark-as-completed";

export function CharacterRow({
  id,
  character,
  isCompleted,
}: JapaneseCharacter & {
  character: string;
  isCompleted: boolean;
}) {
  const onClick = () => {
    // TODO: open details / modal
  };

  const onCompleteToggle = () => {
    // TODO: persist completion state (e.g. localStorage)
  };

  return (
    <div
      onClick={onClick}
      className={clsx("relative group transition select-none", isCompleted ? "text-smokewhite" : "text-lightgray")}
    >
      <div className="pl-3 pr-4 pt-7 pb-3 flex gap-2 items-center transition border-b border-b-secondary/10 bg-softblack active:bg-hovered">
        <div className="shrink-0 font-medium text-4xl">{character}</div>
        <MarkAsCompleted
          className={isCompleted ? "bg-transparent" : ""}
          isCompleted={isCompleted}
          onClick={onCompleteToggle}
        />
        <div className="absolute left-4 top-3 text-xs">{id}</div>

</div>

    </div>
  );

}