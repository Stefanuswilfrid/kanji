import * as React from "react";
import { KanjiApiResponse } from "../types";
import { BASE_URL } from "@/pages/_app";
import { AudioButton } from "../AudioButton";

import clsx from "clsx";
import { ExampleSentences } from "./ExampleSentences";
import { KanjiDefinition } from "./KanjiDefinition";
import { ExampleIdioms } from "./ExampleIdioms";
import { RelatedKanji } from "./RelatedKanji";
import { IdHanziMapKey } from "../KanjiModal";
import { Level } from "@/data/constants";

export function KanjiDetails({
  definition,
  lessons,
  idioms,
  related,
  currentHanzi,
  currentLevel,
}: KanjiApiResponse & {
  currentHanzi: IdHanziMapKey;
  currentLevel: Level;
}) {
  const [entryIndex, setEntryIndex] = React.useState(0);

  const ref = React.useRef<HTMLDivElement>(null);


  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [definition?.simplified]);

  if (definition === null)
    return (
      <div className="grid place-items-center h-full">
        <p>
          Definition for <span className="text-xl">{currentHanzi}</span> not found.
        </p>
      </div>
    );

  const actualEntryIndex = Math.min(entryIndex, definition.entries.length - 1);

  const currentEntry = definition.entries[actualEntryIndex];
  const entryLength = definition.entries.length;

  const hanzi =  definition.simplified;
  const pinyin = currentEntry.pinyin;
  const audioUrl = BASE_URL + `/api/audio/${encodeURI(hanzi)}?pinyin=${pinyin}`;

  const isIdiom = hanzi.length === 4;

  return (
    <div ref={ref} className="overflow-y-auto flex-1 scrollbar-none py-4">
      {<span className="px-4 text-sm">HSK {currentLevel}</span>}
      <div className="space-y-2">
        {isIdiom ? (
          <>
            <p className="px-4 text-6xl font-medium">{hanzi}</p>
            <div className="flex items-end gap-2 px-4">
              <p className="font-medium">{currentEntry.pinyin}</p>
              <AudioButton text={hanzi} />
            </div>
          </>
        ) : (
          <div className="flex items-end gap-2 px-4">
            <p className="text-6xl font-medium">{hanzi}</p>
            <div>
              <AudioButton text={hanzi} />
              <p className="font-medium">{currentEntry.pinyin}</p>
            </div>
          </div>
        )}

        {entryLength > 1 && (
          <div className="space-x-2 px-4">
            {definition.entries.map((_, index) => {
              return (
                <button
                  onClick={() => setEntryIndex(index)}
                  className={clsx(
                    "rounded-md px-4 text-sm py-0.5 border",
                    entryIndex === index ? "bg-smokewhite text-black border-white" : "border-softzinc"
                  )}
                  key={index}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        )}

        <KanjiDefinition entry={currentEntry} />

        <RelatedKanji hanzi={hanzi} related={related} />

        <ExampleIdioms hanzi={definition.simplified } idioms={idioms} />

        <ExampleSentences hanzi={definition.simplified} lessons={lessons} />
      </div>
    </div>
  );
}
