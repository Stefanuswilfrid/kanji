"use client";
import { BackRouteButton } from "@/components/route-button";
import { Layout } from "@/modules/layout/layout";
import {
  useFlashcard,
  useFlashcardList,
} from "@/modules/layout/reading-layout";
import { LucideTrash2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

export default function FlashcardsIdPage() {
  const params = useParams<{ id?: string }>();
  const id = decodeURIComponent(params?.id as string);
  const { flashcardItem, removeFlashcard } = useFlashcard(id);
  const [openAlert, setOpenAlert] = React.useState(false);

  console.log("flashcards id", flashcardItem);
  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
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
        </main>
      </div>
    </Layout>
  );
}
