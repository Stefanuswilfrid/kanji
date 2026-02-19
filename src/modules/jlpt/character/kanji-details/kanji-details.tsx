import { Level } from "@/data/constants";
import clsx from "clsx";
import React from "react";
import { KanjiApiResponse } from "../types";
import { IdKanjiMapKey } from "../kanji-modal";
import { KanjiDefinition } from "./kanji-definition";
import { AudioButton } from "../audio-button";
import { ExampleSentences } from "./example-sentences";

export function KanjiDetails({
  definition,
  lessons,
  idioms,
  related,
  currentKanji,
  currentLevel,
}: KanjiApiResponse & {
  currentKanji: IdKanjiMapKey;
  currentLevel: Level;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [entryIndex, setEntryIndex] = React.useState(0);

  const actualEntryIndex = Math.min(entryIndex, definition.entries.length - 1);
  const kanji = definition.word;

  const currentEntry = definition.entries[actualEntryIndex];
  const isIdiom = kanji.length === 4;

  console.log("currentEntry", definition);

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
      <div className="space-y-2">
        {isIdiom ? (
          <></>
        ) : (
          <div className="flex items-end gap-2 px-4">
            <p className="text-6xl font-medium">{kanji}</p>
            <div>
              <AudioButton text={kanji} />
              <p className="font-medium">{definition.reading}</p>

              <p className="font-medium">{definition.romaji}</p>
            </div>
          </div>
        )}
        <KanjiDefinition entry={currentEntry} />
        <ExampleSentences kanji={kanji} lessons={lessons} />
      </div>
    </div>
  );
}
