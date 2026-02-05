import { JapaneseCharacter } from "@/data/constants";
import clsx from "clsx";

export type Locale = "en" | "id";

export function CharacterCard({
  id,
  character,
  onFlip,
  isCompleted,
  onCompleteToggle,
}: JapaneseCharacter & {
  character: string;
  isCompleted: boolean;
  onCompleteToggle: () => void;
  onFlip: () => void;
}) {
    return (
        <>
<div
        onClick={onFlip}
        className={clsx("select-none text-4xl aspect-square", isCompleted ? "text-smokewhite" : "text-lightgray")}
      >
        </div>
        </>
    )
}
