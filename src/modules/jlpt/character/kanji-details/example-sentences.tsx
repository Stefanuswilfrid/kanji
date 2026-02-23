import React from "react";
import { KanjiApiResponse } from "../types";
import { clsx } from "clsx";
import { DragToScrollWrapper } from "@/components/jlpt/drag-to-scroll-wrapper";
import { Popover } from "@/components/jlpt/popover";
import { AudioButton } from "../audio-button";
import { useLocale } from "@/locales/use-locale";
import { useQuery } from "@tanstack/react-query";
import { CopyToClipboard } from "@/modules/speech/view-definition";

function useTranslateToIndonesian(text?: string) {
  return useQuery({
    queryKey: ["translate", "auto->id", text],
    enabled: Boolean(text),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const res = await fetch(`/api/translate?to=id&text=${encodeURIComponent(text!)}`);
      if (!res.ok) throw new Error(`Translate failed: ${res.status}`);
      const json = (await res.json()) as { translatedText?: string };
      return json.translatedText ?? text!;
    },
  });
}

function LessonTranslation({
  locale,
  english,
  indonesian,
}: {
  locale: "en" | "id";
  english?: string;
  indonesian?: string;
}) {
  const rawIndonesian = indonesian ?? "";
  const rawEnglish = english ?? "";

  const sourceText = rawIndonesian || rawEnglish;
  const alreadyDifferent = rawIndonesian && rawEnglish && rawIndonesian !== rawEnglish;
  const needsTranslate = locale === "id" && Boolean(sourceText) && !alreadyDifferent;

  const { data: translated, isFetching, isError } = useTranslateToIndonesian(
    needsTranslate ? sourceText : undefined
  );

  if (locale === "id") {
    if (!needsTranslate) return <>{rawIndonesian || rawEnglish}</>;

    if (translated) return <>{translated}</>;

    // Avoid showing English while translation is in-flight.
    if (isFetching) return <>Menerjemahkan…</>;

    // If translation failed, fall back to whatever we have.
    if (isError) return <>{sourceText}</>;

    return <>Menerjemahkan…</>;
  }
  return <>{rawEnglish || rawIndonesian}</>;
}

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
  const regex = new RegExp(`(${kanji})`);

  const currentLesson = lessons.filter(
    (lesson) => lesson.lessonInfo.level.toLowerCase() === currentLevel,
  );
  const { locale } = useLocale();
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
          const splitted = lesson.japanese.split(regex);
          return (
            <li key={index} className="list-none">
              <Popover>
                <Popover.Trigger
                  asChild
                  className="text-left text-xl font-medium"
                >
                  <div role="button">
                    {splitted.map((part, index) => {
                      if (part === kanji)
                        return (
                          <span className="text-sky-400" key={index}>
                            {kanji}
                          </span>
                        );
                      return (
                        <React.Fragment key={index}>{part}</React.Fragment>
                      );
                    })}

<CopyToClipboard
                      className="inline-flex align-middle max-sm:mb-0.5 active:bg-transparent md:w-9 md:h-9"
                      text={lesson.japanese}
                      size={16}
                    />

                    <AudioButton
                      size="small"
                      key={index}
                      text={lesson.japanese}
                      speed={1}
                    />
                  </div>
                </Popover.Trigger>
                <Popover.Content
                  align="start"
                  className="leading-5 text-smokewhite px-2 max-[640px]:max-w-[calc(100vw-1rem)] max-w-[calc(570px-1rem)]"
                >
                  <p>{lesson.japanese}</p>
                </Popover.Content>
              </Popover>
              <p className="text-gray">
                <LessonTranslation
                  locale={locale}
                  english={lesson.english}
                  indonesian={lesson.indonesian}
                />
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
