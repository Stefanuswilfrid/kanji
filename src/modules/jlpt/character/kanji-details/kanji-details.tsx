import { Level } from "@/data/constants";
import clsx from "clsx";
import React from "react";
import { KanjiApiResponse } from "../types";
import { IdKanjiMapKey } from "../kanji-modal";

export function KanjiDetails({
  definition,
  lessons,
  idioms,
  related,
  currentKanji,
  currentLevel
}: KanjiApiResponse & {
  currentKanji : IdKanjiMapKey
  currentLevel : Level
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const levelTabs = [
    { key: "elementary", label: "Elementary", active: currentLevel >= 4 },
    {
      key: "intermediate",
      label: "Intermediate",
      active: currentLevel === 3 || currentLevel === 2,
    },
    { key: "advanced", label: "Advanced", active: currentLevel === 1 },
  ] as const;

  return (
    <div ref={ref} className="overflow-y-auto flex-1 scrollbar-none py-4">
      {<span className="px-4 text-sm">JLPT {currentLevel}</span>}
      <div className="flex items-end gap-2 px-4">
        <p className="text-6xl font-medium">{currentKanji} </p>
        <div>
          <p className="font-medium">Reading</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="pl-4 text-sm underline underline-offset-2">
          See Related
        </div>
        <div className="pl-2 text-sm underline underline-offset-2">
          See Idioms
        </div>
      </div>
      <div className="mt-3 px-4">
        <div className="inline-flex items-center rounded-md border border-softzinc bg-transparent overflow-hidden">
          {levelTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {}}
              className={clsx(
                "px-3 py-1 text-sm font-medium border-r last:border-r-0 border-softzinc",
                tab.active
                  ? "bg-smokewhite text-black border-white"
                  : "bg-transparent text-secondary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
