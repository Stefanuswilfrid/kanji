import useIsMobile from "@/hooks/useIsMobile";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useLocale } from "@/locales/use-locale";
import { FlashcardedResult } from "@/server/routers/flashcard";
import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useReview } from "./provider";
import { CharacterCard } from "./character-card";
import { useSmoothScroll } from "@/hooks/useSmoothScrollToIndex";

export function CardContainer({
  words,
  onCardClick,
}: {
  words: FlashcardedResult[];
  onCardClick: (word: FlashcardedResult) => void;
}) {
  const { width } = useWindowSize();
  const { locale } = useLocale();

  const isMobile = useIsMobile();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [flippedIndex, setFlippedIndex] = React.useState<number | null>(null);

  const containerHeight = React.useMemo(
    () => (width && width < 640 ? Math.min(width - 16, 384) : 320),
    [width],
  );
  const viewportWidth = React.useMemo(() => Math.min(width, 960), [width]);

  const marginLeftRight = React.useMemo(
    () =>
      width > 768
        ? viewportWidth / 2 - containerHeight / 2 - 32
        : width > 384
        ? viewportWidth / 2 - containerHeight / 2
        : undefined,
    [containerHeight, viewportWidth, width]
  );

  const rowVirtualizer = useVirtualizer({
    count: words.length + 1,
    estimateSize: () => containerHeight,
    overscan: isMobile ? 10 : 5,
    getScrollElement: () => containerRef.current,
    horizontal: true,
  });

  const { currentIndex, reviewResult, flipped } = useReview();

  const smoothScrollToIndex = useSmoothScroll(rowVirtualizer as any, "quad");

  React.useEffect(() => {
    smoothScrollToIndex(currentIndex, {
      align: "start",
      duration: 300,
    });
  }, [currentIndex, smoothScrollToIndex]);



  return (
    <div
      className="mt-4 w-full overflow-x-hidden flex gap-2 scrollbar-none"
      ref={containerRef}
    >
      <div
        style={{
          width: `${rowVirtualizer.getTotalSize()}px`,
          height: containerHeight,
          position: "relative",
          marginLeft: marginLeftRight,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const index = virtualItem.index;
          const word = words[index];

          if (!word) {
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${virtualItem.size}px`,
                  height: "100%",
                  transform: `translateX(${virtualItem.start}px)`,
                }}
              >
                <div
                  key="placeholder"
                  className="shrink-0 w-full max-w-96 sm:max-w-80 aspect-square"
                  ref={(el) => {
                    if (el) {
                      cardRefs.current[index] = el;
                    }
                  }}
                ></div>
              </div>
            );
          }

          const character = word.text;
          const reading = word.entries.map((entry) => entry.reading).join(", ");
          const translations = word.entries[0]?.glosses ?? [];
          const active = index === currentIndex;

          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${virtualItem.size}px`,
                height: "100%",
                transform: `translateX(${virtualItem.start}px)`,
              }}
            >
              <div
                key={word.text}
                className="shrink-0 w-full max-w-96 sm:max-w-80 aspect-square"
                ref={(el) => {
                  if (el) {
                    cardRefs.current[index] = el;
                  }
                }}
              >
                <CharacterCard
                  index={index}
                  character={character}
                  reading={reading}
                  translations={translations.join(", ")}
                  className={active ? "opacity-100" : "opacity-40 scale-90"}
                  status={reviewResult[index]}
                  isFlipped={flipped === index}
                  onCardClick={() => {
                    onCardClick(word);
                  }}
                />
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
