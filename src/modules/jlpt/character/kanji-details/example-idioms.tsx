import { Popover } from "@/components/jlpt/popover";
import { KanjiApiResponse } from "../types";
import clsx from "clsx";
import { Drawer } from "@/components/jlpt/drawer";
import { useLocale } from "@/locales/use-locale";
import { useWindowSize } from "@/hooks/useWindowSize";
import React from "react";

export function ExampleIdioms({ kanji, idioms }: { kanji: string; idioms: KanjiApiResponse["idioms"] }) {

    const { width } = useWindowSize();
    const isMobile = width < 640;
  
    const regex = new RegExp(`(${kanji})`);
  
    const { t } = useLocale();
  
  
    if (!idioms) return null;
  
    return (
      <Drawer.NestedRoot direction={isMobile ? "bottom" : "right"}>
        <Drawer.Trigger className="pl-2 text-sm underline underline-offset-2">{t.seeIdioms}</Drawer.Trigger>
        <Drawer.Content className={clsx("pt-4", isMobile ? "h-[95dvh] left-0" : "h-dvh rounded-none max-w-xl w-full")}>
          <div className="relative space-y-2 p-4 max-sm:pb-8 h-full overflow-y-auto scrollbar-none">
            <p className="text-xl font-medium">
              {t.exampleIdiomsOf} {kanji}
            </p>
            {idioms.length === 0 && (
              <p>
                Idioms for <span className="text-xl">{kanji}</span> not found.
              </p>
            )}
            <ul>
              {idioms.map((idiom, index) => {
                const splitted = idiom.word.split(regex);
                return (
                  <li key={`${idiom.word}-${index}`} className="list-none">
                    <Popover>
                      <Popover.Trigger className="text-left sm:text-lg font-medium">
                        {splitted.map((part, partIndex) => {
                          if (part === kanji)
                            return (
                              <span className="text-wheat" key={partIndex}>
                                {kanji}
                              </span>
                            );
                          return <React.Fragment key={partIndex}>{part}</React.Fragment>;
                        })}
                      </Popover.Trigger>
                      <Popover.Content
                        align="start"
                        className="text-xs sm:text-sm leading-5 text-smokewhite px-2 max-w-[calc(100vw-1rem)] md:max-w-[calc(540px-1rem)]"
                      >
                        <p>{idiom.reading}</p>
                      </Popover.Content>
                    </Popover>
                    <p className="text-sm sm:text-base text-lightgray">{idiom.meaning}</p>
                  </li>
                );
              })}
            </ul>
          </div>
  
          <div className="absolute top-6 sm:top-0 left-0 right-0 mx-4 bg-linear-to-b from-black h-6"></div>
          <div className="absolute bottom-0 left-0 right-0 mx-4 bg-linear-to-t from-black h-6"></div>
        </Drawer.Content>
      </Drawer.NestedRoot>
    );
}