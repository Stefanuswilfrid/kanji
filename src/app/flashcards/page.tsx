"use client";
import { BackRouteButton } from "@/components/route-button";
import { useLocale } from "@/locales/use-locale";
import { AddNewFlashcardButton } from "@/modules/flashcard/new-flashcards-button";
import { Layout } from "@/modules/layout/layout";

export default function FlashcardsPage() {
  const { t } = useLocale();

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
        <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
            <BackRouteButton />

            </div>
          </div>

          <div>
          <div className="max-md:px-4 mt-4">
          <AddNewFlashcardButton setFlashcards={()=>{}} />

            </div>
            </div>

          <div>
</div>

        </main>
      </div>
    </Layout>
  );
}
