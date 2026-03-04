"use client";
import { cn } from "@/lib/utils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CommandMenuFooter } from "./command-menu/footer";
import { Command } from "cmdk";
import { useLocale } from "@/locales/use-locale";
import { CommandMenuHeader } from "./command-menu/header";
import React from "react";
import { CommandMenuChips } from "./command-menu/chips";
import { CommandMenuSearch } from "./command-menu/search";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AudioProvider } from "../layout/audio-provider";
import { CommandMenuGroupCard } from "./command-menu/group";

export type TranslateApiResponse = {
  text: string;
  translatedText: string;
  from: string;
  to: string;
};

const KEYWORD_REGEX = /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\sー々〆ヵヶ]+$/u;

function updateRecentlySearched(keyword: string) {
  try {
    const key = "recently-searched";
    const raw = localStorage.getItem(key);
    const prev = raw ? (JSON.parse(raw) as unknown) : [];
    const arr = Array.isArray(prev) ? prev.filter((x) => typeof x === "string") : [];
    const next = [keyword, ...arr.filter((k) => k !== keyword)].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function SearchCommandMenu() {
  return (
    <React.Suspense fallback={null}>
      <SearchCommandMenuInner />
    </React.Suspense>
  );
}

function SearchCommandMenuInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  return (
    <Dialog
      className="relative z-[998]"
      open={Boolean(search)}
      onClose={() => {
        router.back();
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-y-0 left-0 w-screen z-[998] bg-black/20 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-y-0 left-0 z-[998] w-screen p-2 sm:p-4 overflow-y-auto">
        <div className="flex justify-center text-center sm:items-center">
          <DialogPanel
            transition
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:-translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
              "bg-softblack text-smokewhite border border-secondary/10",
            )}
          >
            <CommandMenuContent />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

function CommandMenuContent() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [active, setActive] = React.useState([0, 1]);
  const [isWriting, setIsWriting] = React.useState(false);
  const { locale } = useLocale();
  const listRef = React.useRef<HTMLDivElement>(null);

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyword = value.trim();
  const showTranslation = active.includes(0);
  const showDefinition = active.includes(1);

  const { data: searchResult, isFetching: isLoading } = useQuery({
    queryKey: ["translate", locale, keyword],
    enabled: keyword.length > 0 && typeof locale === "string",
    placeholderData: keepPreviousData,
    queryFn: async (): Promise<TranslateApiResponse | null> => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const isMatch = KEYWORD_REGEX.test(keyword);
      if (!isMatch) {
        timeoutRef.current = setTimeout(() => {
          // eslint-disable-next-line no-console
          console.warn("Search keyword rejected by regex:", keyword);
        }, 1000);
        return null;
      }

      updateRecentlySearched(keyword);

      const response = await fetch(
        `/api/translate?to=${encodeURIComponent(locale)}&text=${encodeURIComponent(keyword)}`
      );
      if (!response.ok) throw new Error(`Translate failed (${response.status})`);
      return (await response.json()) as TranslateApiResponse;
    },
  });

  return (
    <>
      <Command
        filter={() => 1}
        label={t.searchPlaceholder}
        className="relative bg-softblack h-[85vh] min-h-[400px]"
      >
        <CommandMenuHeader scrolled={scrolled}>
        <CommandMenuSearch
            isLoading={isLoading}
            placeholder={t.searchPlaceholder}
            value={value}
            onValueChange={setValue}
            isWriting={isWriting}
            setIsWriting={setIsWriting}
          />
          <CommandMenuChips
            active={active}
            toggleActive={(value) => {
              setActive((prev) => {
                const updated = Array.from(prev);
                if (updated.includes(value)) {
                  return updated.filter((item) => item !== value);
                } else {
                  return [...updated, value];
                }
              });
            }}
          />
        </CommandMenuHeader>

        <Command.List
          ref={listRef}
          onScroll={() => {
            if (!listRef.current) return;
            listRef.current?.scrollTop > 0 ? setScrolled(true) : setScrolled(false);
          }}
          className="overflow-y-auto h-[calc(100%-82px)] scrollbar-none p-2 scroll-pb-[86px] scroll-pt-[62px] pb-[calc(38px+0.5rem)]"
        >
          <AudioProvider>
           
              <React.Fragment>
                {/* {recentlySearched && isSearchEmpty && (
                  <CommandMenuGroupSearch
                    clearHistory={clearRecentlySearched}
                    onSelect={setValue}
                    heading={t.recentlySearched}
                    data={recentlySearched}
                  />
                )} */}
                <div className={cn("duration-200", isLoading ? "opacity-50" : "opacity-100")}>
                  {searchResult && value && (
                    <CommandMenuGroupCard active={active} data={searchResult} sentence={value} />
                  )}
                </div>
              </React.Fragment>
          </AudioProvider>
        </Command.List>
      </Command>
      <CommandMenuFooter />
    </>
  );
}
