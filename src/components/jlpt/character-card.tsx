"use client";

import { JapaneseCharacter } from "@/data/constants";
import clsx from "clsx";
import { MarkAsCompleted } from "./mark-as-completed";
import Link from "next/link";
import { queryClient } from "@/lib/react-query";

export type Locale = "en" | "id";

export const url = (kanji: string, locale: Locale) => `https://stefanuswilfrid.github.io/jlpt-content-pipeline/character/${locale}/${kanji}.json`;

export async function preloadKanjiDetails(kanji: string, locale: Locale) {
  await queryClient.prefetchQuery({
    queryKey: ["kanji-details", locale, kanji],
    queryFn: async () => {
      const response = await fetch(url(kanji, locale));
      if (!response.ok) throw new Error(`Failed to fetch kanji details: ${response.status}`);
      return response.json();
    },
  });
}


export function CharacterCard({
  id,
  kanji,
  reading,
  translations,
  onFlip,
  locale,
  kanjiHref,
  isFlipped,
  isCompleted,
  onCompleteToggle,
}: JapaneseCharacter & {
  isCompleted: boolean;
  kanjiHref: string;
  locale: Locale;
  onCompleteToggle: () => void;
  onFlip: () => void;
  isFlipped: boolean;
}) {
  return (
    <>
      <style jsx>{`
        .card {
          transition: transform 0.5s;
          transform-style: preserve-3d;
        }

        .card-flipped {
          transform: rotateY(180deg);
        }

        .card-content {
          -webkit-backface-visibility: hidden; /* Safari */
          backface-visibility: hidden;
        }

        .text-flipped {
          transform: rotateY(180deg);
        }
      `}</style>
      <div
        onClick={onFlip}
        className={clsx(
          "select-none text-4xl aspect-square",
          isCompleted ? "text-smokewhite" : "text-lightgray",
        )}
      >
        <div
          className={clsx(
            "relative w-full h-full card",
            isFlipped && "card-flipped",
          )}
        >
          {/* Front */}
          <div
            className={clsx(
              "card-content has-[input:active]:scale-[98%] transition absolute inset-0 border-b-[1.5px] grid place-items-center bg-softblack border-secondary/10",
            )}
          >
            <span className="font-medium">{kanji}</span>
            <MarkAsCompleted
              className={isCompleted ? "bg-transparent" : ""}
              isCompleted={isCompleted}
              onClick={onCompleteToggle}
            />
            <div
              className={clsx(
                "absolute top-2 right-2 transition p-2 rounded-md",
                !isCompleted
                  ? "text-lightgray/50 active:bg-zinc"
                  : "active:bg-mossgreen/10",
              )}
            >
               <Link
                onMouseEnter={() => preloadKanjiDetails(kanji, locale)}
                onClick={(e) => e.stopPropagation()}
                href={kanjiHref}
                shallow
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              </Link>
            </div>
            <div className="absolute left-4 top-4 text-sm">{id}</div>
          </div>

          {/* Back */}
          <div
            className={clsx(
              "card-content absolute inset-0 border-b-[1.5px] bg-softblack flex flex-col items-center justify-center text-flipped px-4 border-secondary/10",
            )}
          >
            <div className="text-3xl">{reading}</div>
            <div className="text-lg text-center">{translations.join(", ")}</div>
            <div className="absolute left-4 top-4 text-sm">{id}</div>
          </div>
        </div>
      </div>
    </>
  );
}
