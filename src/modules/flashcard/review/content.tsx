import { FlashcardedResult } from "@/server/routers/flashcard";
import { CardContainer } from "./card-container";
import { ReviewProvider } from "./provider";
import { ReviewResult } from "./review-result";
export type CardStatus = "wrong" | "correct" | "untouched";

export function FlashcardReviewContent({
  words,
  onCardClick,
}: {
  words: FlashcardedResult[];
  onCardClick: (card: FlashcardedResult) => void;
}) {
  return (
    <div className="max-sm:px-2 flex flex-col items-center justify-center min-h-[calc(100dvh-5.5rem)]">
      <ReviewProvider length={words.length}>
      <ReviewResult />

        <CardContainer onCardClick={onCardClick} words={words} />
      </ReviewProvider>
    </div>
  );
}
