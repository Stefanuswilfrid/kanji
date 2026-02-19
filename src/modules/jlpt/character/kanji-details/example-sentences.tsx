import React from "react";
import { KanjiApiResponse } from "../types";
import { clsx } from "clsx";
import { DragToScrollWrapper } from "@/components/jlpt/drag-to-scroll-wrapper";

export function ExampleSentences({
  kanji,
  lessons,
}: {
  kanji: string;
  lessons: KanjiApiResponse["lessons"];
}) {
  const [currentLevel, setCurrentLevel] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (lessons.length > 0) {
      setCurrentLevel(lessons[0].lessonInfo.level.toLowerCase());
    }
  }, [lessons]);
  const lessonLevelSet = new Set(
    lessons.map((lesson) => lesson.lessonInfo.level.toLowerCase()),
  );
  const lessonLevels = Array.from(lessonLevelSet);

  const currentLesson = lessons.filter(
    (lesson) => lesson.lessonInfo.level.toLowerCase() === currentLevel,
  );
  console.log("lessons", lessons);
  return (
    <>
      {lessonLevels.length > 1 && (
        <DragToScrollWrapper key={kanji}>
          {lessonLevels.map((level) => {
            return (
              <button
                onClick={() => {
                  setCurrentLevel(level);
                }}
                className={clsx(
                  "rounded-md px-4 text-sm py-0.5 border",
                  currentLevel === level
                    ? "bg-smokewhite text-black border-white"
                    : "border-softzinc",
                )}
                key={level}
              >
                {level}
              </button>
            );
          })}
        </DragToScrollWrapper>
      )}
      <ul className="relative space-y-2 px-4">
        {currentLesson.map((lesson, index) => {
          return (
            <li key={index} className="list-none">
              <Popover>
              <Popover.Content
                  align="start"
                  className="leading-5 text-smokewhite px-2 max-[640px]:max-w-[calc(100vw-1rem)] max-w-[calc(570px-1rem)]"
                >
                <p>{lesson.japanese}</p>
                </Popover.Content>
              </Popover>
              <p className="text-gray">{lesson.english}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
