import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import * as React from "react";
import IdHanziMap from "@/data/id-hanzi-map.json";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import { cn } from "@/utils";
import { useReading } from "@/modules/layout";
import { Divider } from "@/components";
import { LoadingBar } from "@/components/jlpt/Loader";
import { AnimatePresence, motion } from "framer-motion";
import { SaveToFlashcard } from "./save-to-flashcard";
import { toast } from "sonner";

import { useLocale } from "@/locales/use-locale";
import { TranslateApiResponse } from "@/pages/api/translate";
import { AudioButton } from "../jlpt/Character/AudioButton";
import { useWindowSize } from "@/hooks";
import { LucideCopy, LucideCopyCheck } from "lucide-react";

export type IdHanziMapKey = keyof typeof IdHanziMap;

type DefinitionModalProps = {
  previousSentence: () => string;
  nextSentence: () => string;
  onClose: () => void;
  getDefinitionUrl: (locale: string) => string;
  totalSentences: number;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
};

export function CopyToClipboard({
  text,
  size,
  className,
  iconClassName,
}: {
  text: string;
  size: number;
  className?: string;
  iconClassName?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const Icon = copied ? LucideCopyCheck : LucideCopy;

  return (
    <button
      disabled={copied}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={cn(
        "group relative flex h-9 md:h-12 w-9 md:w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 disabled:active:bg-transparent active:bg-hovered",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={copied.toString()}
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.9,
            opacity: 0.5,
          }}
          transition={{
            duration: 0.15,
          }}
        >
          <Icon
            strokeWidth={2}
            size={size}
            className={cn("text-sky-400", copied ? "opacity-100" : "opacity-50", iconClassName)}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export function DefinitionModal({
  previousSentence,
  nextSentence,
  onClose,
  getDefinitionUrl,
  totalSentences,
  previousDisabled,
  nextDisabled,
}: DefinitionModalProps) {
  const router = useRouter();
  const sentence = router.query.sentence as string;
  const sentenceIndex = router.query.sentenceIndex as string;

  const { t, locale } = useLocale();

  const { data, isLoading } = useSWRImmutable<TranslateApiResponse>(
    sentence ? getDefinitionUrl(locale) : undefined,
    async () => {
      const response = await fetch(getDefinitionUrl(locale));
      return response.json();
    },
    {
      keepPreviousData: true,
    }
  );

  React.useEffect(() => {
    if (data) {
      const result = data.result.flat();
      const firstNonPunctuationIndex = result.findIndex((segment) => !segment.isPunctuation);
      setActiveIndex(firstNonPunctuationIndex);
    }
  }, [data]);

  React.useEffect(() => {
    if (sentence) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.scrollbarGutter = "stable";
      toast.dismiss("last-read");
    }

    const timeout = setTimeout(() => {
      if (!sentence) {
        document.body.style.overflowY = "scroll";
        document.documentElement.style.scrollbarGutter = "";
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [sentence]);

  const sections = data?.result.flat();
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const [entryIndex, setEntryIndex] = React.useState(0);

  const currentSection = sections?.[activeIndex];

  const currentSimplifiedLength = currentSection?.simplified.length;
  const isIdiom = currentSimplifiedLength && currentSimplifiedLength >= 3;

  const currentEntries = currentSection?.entries ?? [];

  const actualEntryIndex = Math.min(entryIndex, currentEntries.length - 1);
  const currentEntry = currentEntries[actualEntryIndex] ?? [];

  const { fontSize } = useReading();

  const latestSentenceIndex = React.useRef(sentenceIndex);

  React.useEffect(() => {
    if (sentenceIndex) {
      latestSentenceIndex.current = sentenceIndex;
    }
  }, [sentenceIndex]);

  const { width } = useWindowSize();


  const currentHanzi = isSimplified ? currentSection?.simplified : currentSection?.traditional;

  return (
    <Dialog className="relative z-[998]" open={Boolean(sentence)} onClose={onClose}>
      <DialogBackdrop
        transition
        className="fixed inset-y-0 left-0 w-screen z-[998] bg-black/20 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-y-0 left-0 z-[998] w-screen p-2 sm:p-4 overflow-y-auto scrollbar-none">
        <div className="flex justify-center text-center sm:items-center">
          <DialogPanel
            transition
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white py-3 sm:py-4 text-left shadow-xl transition-all data-[closed]:-translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
              "bg-softblack text-smokewhite"
            )}
          >
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "tween", duration: 0.2 }}
                  className="flex justify-center pt-6 sm:pt-7 absolute inset-0 h-full z-50 bg-black/50"
                >
                  {<LoadingBar visible />}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between px-3 sm:px-4 text-secondary">
              <button
                onClick={() => {
                  router.replace(previousSentence(), undefined, {
                    shallow: true,
                  });
                }}
                aria-disabled={previousDisabled}
                className="flex select-none items-center gap-1 rounded-md font-medium duration-200 active:bg-hovered px-3 py-1.5 aria-disabled:opacity-50 aria-disabled:pointer-events-none"
              >
                <div className="mb-[3px]">&#8592;</div> {t.previous}
              </button>
              <button
                onClick={() => {
                  router.replace(nextSentence(), undefined, {
                    shallow: true,
                  });
                }}
                aria-disabled={nextDisabled}
                className="flex select-none items-center gap-1 rounded-md font-medium duration-200 active:bg-hovered px-3 py-1.5 aria-disabled:opacity-50 aria-disabled:pointer-events-none"
              >
                {t.next} &#8594;
              </button>
            </div>

            <Divider />

            <div className="mt-2">
              <div className="px-3 sm:px-4">
                <span className="text-sm text-secondary">{t.sentence}:</span>
                <p className={cn(fontSize.className, "mt-1 leading-[30px]")}>
                  {sections?.map((section, index) => {
                    const isLastIndex = sections.length - 1 === index;

                    let additionalPunctuation = "";
                    let nextIndex = index + 1;

                    while (nextIndex < sections.length && sections[nextIndex].isPunctuation && !isLastIndex) {
                      additionalPunctuation += sections[nextIndex].simplified;
                      nextIndex++;
                    }
                    if (section.isPunctuation && index > 0) return null;
                    return (
                      <span
                        key={index}
                        onClick={() => {
                          if (!section.isPunctuation) {
                            setActiveIndex(index);
                            setEntryIndex(0);
                          }
                        }}
                        className={cn("inline-block select-none", "whitespace-pre-wrap")}
                      >
                        <span
                          className={cn(
                            "underline-offset-4 cursor-pointer border-b-[1.5px] border-softblack",
                            "relative rounded-b-md rounded-t pb-0.5 box-clone active:bg-indigo-300/20",
                            activeIndex === index && "bg-indigo-300/30 border-sky-300 active:bg-indigo-300/30"
                          )}
                        >
                          {isSimplified ? section.simplified : section.traditional}
                        </span>
                        {additionalPunctuation}
                      </span>
                    );
                  })}
                </p>
                <div key={sentence} className="mt-2 pr-2 flex justify-end items-center gap-1 md:gap-2">
                  <CopyToClipboard text={sentence} size={width < 768 ? 20 : 26} />
                  <AudioButton speed={1.2} size={width < 768 ? "normal" : "large"} text={sentence} />
                </div>
              </div>

              <TranslateSentence translated={data?.translated ?? ""} />

              <div className="px-3 sm:px-4 relative bg-softblack">
                <span className="text-sm text-secondary">{t.definition}:</span>

                {data && (
                  <React.Fragment>
                    <div className="flex justify-between">
                      {isIdiom ? (
                        <div>
                          <p className="mt-1 text-4xl md:text-5xl font-medium">{currentHanzi}</p>
                          <div className="flex items-end gap-2 mt-1.5">
                            <p className="font-medium text-lg md:text-xl">{currentEntry?.pinyin}</p>
                            <AudioButton text={currentHanzi ?? ""} size="normal" />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-end gap-2">
                          <p className="text-4xl md:text-5xl font-medium">{currentHanzi}</p>
                          <div>
                            <p className="font-medium text-lg md:text-xl">{currentEntry?.pinyin}</p>
                          </div>
                          <AudioButton text={currentHanzi ?? ""} size="normal" />
                        </div>
                      )}

                      <SaveToFlashcard key={currentHanzi} word={currentHanzi} />
                    </div>

                    {currentEntries.length > 1 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {currentEntries.map((_, index) => {
                          return (
                            <button
                              onClick={() => setEntryIndex(index)}
                              className={cn(
                                "rounded-md px-4 text-sm py-0.5 border",
                                entryIndex === index ? "bg-smokewhite text-black border-white" : "border-softzinc"
                              )}
                              key={index}
                            >
                              {index + 1}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <ul className="mt-1 ml-4 pr-1">
                      {currentEntry?.english?.map((definition, index) => {
                        return (
                          <li key={index} className="list-disc">
                            {definition}
                          </li>
                        );
                      })}
                    </ul>
                  </React.Fragment>
                )}
              </div>

              <Divider />

              <div className="mt-2 px-3 sm:px-4 flex justify-between items-end bg-softblack">
                <span className="text-sm text-secondary">
                  {parseInt(sentenceIndex ?? latestSentenceIndex.current) + 1}/{totalSentences}
                </span>
                <button
                  onClick={onClose}
                  className="block rounded-md font-medium duration-200 bg-hovered active:bg-subtle px-3 py-1.5"
                >
                  OK
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

function TranslateSentence({ translated }: { translated: string }) {
  const [show, setShow] = React.useState(true);

  const { t } = useLocale();

  const displayText = show ? t.hideTranslation : t.seeTranslation;

  return (
    <React.Fragment>
      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
          >
            <div className="pt-4">
              <div className="border-t border-t-secondary/10">
                <div className="mt-4 px-3 sm:px-4">
                  <span className="text-sm text-secondary">{t.translation}:</span>
                  <p className="mt-1">{translated}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative w-full pt-6">
        {/* <Divider /> */}
        <div className="border-t border-t-secondary/10 pt-4"></div>

        {/* Translate Sentence Button */}
        <button
          onClick={() => setShow(!show)}
          className="grid place-items-center px-3 py-0.5 text-xs absolute top-1/2 -translate-y-[calc(50%-0.25rem)] left-1/2 -translate-x-1/2 bg-softblack active:bg-hovered duration-200 text-sky-300 rounded-full border border-secondary/10 min-w-[6.75rem]"
        >
          {displayText}
        </button>
      </div>
    </React.Fragment>
  );
}
