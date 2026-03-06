"use client";
import { BackRouteButton } from "@/components/route-button";
import { FlashcardSettingsModal } from "@/modules/flashcard/flashcard-settings-modal";
import { FooterButtons } from "@/modules/flashcard/footer-buttons";
import { Flashcard } from "@/modules/flashcard/useJLPTFlashcard";
import { Layout } from "@/modules/layout/layout";
import {
  useFlashcard,
  useFlashcardList,
} from "@/modules/layout/reading-layout";
import { ChevronRightIcon, LucideTrash2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

function exportFlashcard(words: string[], filename: string) {
  const element = document.createElement("a");
  const file = new Blob(
    [`// ${filename}`, ...words].map((str) => str + "\n"),
    { type: "text/plain" }
  );
  element.href = URL.createObjectURL(file);
  element.download = `${filename}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export default function FlashcardsIdPage() {
  const params = useParams<{ id?: string }>();
  const id = decodeURIComponent(params?.id as string);
  const { flashcardItem, removeFlashcard } = useFlashcard(id);
  const [openAlert, setOpenAlert] = React.useState(false);

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
          <div className="max-md:sticky top-0 h-45 flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="flex justify-between">
              <div className="w-fit">
                <BackRouteButton defaultBack />
              </div>
              <button
                onClick={() => setOpenAlert(true)}
                className="mt-4 p-2 rounded-md duration-200 active:bg-hovered text-secondary flex items-center gap-2"
              >
                <LucideTrash2 />
              </button>
            </div>
          </div>
          {flashcardItem && <DisplayFlashcard flashcard={flashcardItem} />}

        </main>
      </div>
    </Layout>
  );
}
  
function DisplayFlashcard({ flashcard }: { flashcard: Flashcard }) {
  const [bookName, ...chapterParts] = flashcard.chapter.split("-");
  const chapterName = chapterParts.join("-").trim();
  const words = (flashcard.words ?? []).filter(Boolean);


  return (
    <>
          <FlashcardSettingsModal flashcard={flashcard} />

    <div className="mx-4 mt-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">{bookName}</h1>
          {chapterName ? (
            <p className="mt-1 text-sm text-secondary">{chapterName}</p>
          ) : null}
        </div>
        <div className="text-sm text-secondary">{words.length} words</div>
      </div>

      {words.length === 0 ? (
        <div className="mt-6 rounded-md border border-subtle bg-softblack p-4 text-secondary">
          No words in this flashcard yet.
        </div>
      ) : (
        <div className="mt-6 border-y border-subtle">
          {words.map((w, idx) => (
            <button
              key={`${w}-${idx}`}
              type="button"
              onClick={() => {}}
              className="w-full text-left px-0 py-4 border-b border-subtle last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-6 text-sm text-secondary tabular-nums">{idx + 1}</div>

                <div className="flex-1 min-w-0">
                  <div className="text-3xl leading-none text-primary">{w}</div>
                  <div className="mt-1 text-sm text-secondary truncate">
                    {/* Placeholder for reading/meaning if you add it later */}
                  </div>
                </div>

                <div className="text-secondary/60 text-xl leading-none"><ChevronRightIcon/></div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>

    {words.length > 0 && (
        <FooterButtons
          onExport={() => {
            exportFlashcard(words, flashcard.chapter);
          }}
        />
      )}
    </>
  );
}
