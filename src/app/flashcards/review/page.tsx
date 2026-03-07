"use server";
import { FlashcardReviewClient } from "@/modules/flashcard/review/client";


type PageProps = {
    searchParams: Promise<{
      category?: string;
      numOfCards?: string;
      chapter?: string;
    }>;
  };
  

export default async function FlashcardReviewPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const category = params.category as string;
    const numOfCards = params.numOfCards as string;
    const chapter = params.chapter as string;


  return <FlashcardReviewClient category={category} numOfCards={numOfCards} chapter={chapter} />
}
