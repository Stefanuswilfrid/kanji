"use client";
import { Divider } from "@/components/divider";
import AuthButton from "./auth-button";
import {
  BookAIcon,
  ClapperboardIcon,
  KeyboardIcon,
  LanguagesIcon,
  LibraryBigIcon,
  LightbulbIcon,
  LucideVideo,
  NotebookPen,
  PickaxeIcon,
  SearchIcon,
} from "lucide-react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { ChangeLocaleButton } from "./change-locale-button";
import { HomeButton } from "./home-button";
import { useLocale } from "@/locales/use-locale";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";

export function HomeTodo() {
  const { width } = useWindowSize();
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

//podcast
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {/* <AuthButton /> */}

          <ChangeLocaleButton />
        </div>
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set("search", "true");
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="relative flex gap-2 items-center text-secondary sm:flex-1 rounded-md border border-secondary/10 p-2.5 sm:max-w-xs active:bg-hovered duration-200 bg-softblack"
        >
          <SearchIcon
            size={20}
            strokeWidth={1.5}
            className="shrink-0 duration-200 group-hover:text-sky-400"
          />
          {width > 640 && (
            <span>
              検索
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono pl-2">
                ⌘K
              </span>
            </span>
          )}
        </button>
      </div>

      <Divider />

      <div className="grid md:grid-cols-2 gap-4">
        <HomeButton
          className="relative hover:bg-sky-200/5"
          icon={
            <NotebookPen
              size={48}
              strokeWidth={1.5}
              className="shrink-0 duration-200 group-hover:text-green-400"
            />
          }
          path="/jlpt/5"
          title={t.home.jlpt.title}
          description={t.home.jlpt.description}
        >
          <div className="absolute top-2 right-2 inline-flex text-xs items-center rounded-md bg-sky-500/10 px-2 py-1 font-medium text-sky-500 ring-1 ring-inset ring-sky-500/20">
            2026
          </div>
        </HomeButton>

        <HomeButton
          path="/youtube"
          className="relative hover:bg-green-200/5"
          icon={
            <LucideVideo
              size={48}
              strokeWidth={1.5}
              className="shrink-0 duration-200 group-hover:text-green-400"
            />
          }
          title={t.home.youtube.title}
          description={t.home.youtube.description}
        >
        
        </HomeButton>

        <HomeButton
          path="/explore"
          className="relative hover:bg-green-200/5"
          icon={
            <LibraryBigIcon
              size={48}
              strokeWidth={1.5}
              className="shrink-0 duration-200 group-hover:text-green-400"
            />
          }
          title={t.home.explore.title}
          description={t.home.explore.description}
        >
          <div className="absolute top-2 right-2 inline-flex text-xs items-center rounded-md backdrop-blur-sm bg-green-500/10 px-2 py-1 font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
            WIP
          </div>
        </HomeButton>

        <HomeButton
          path="/flashcards/radicals"
          className="relative hover:bg-sky-200/5"
          icon={
            <LanguagesIcon
              size={48}
              strokeWidth={1.5}
              className="shrink-0 duration-200 group-hover:text-sky-400"
            />
          }
          title={t.home.radicals.title}
          description={t.home.radicals.description}
        >
            <div className="absolute top-2 right-2 inline-flex text-xs items-center rounded-md backdrop-blur-sm bg-green-500/10 px-2 py-1 font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
            WIP
          </div>
        </HomeButton>

        <HomeButton
          path="/teleprompter"
          className="relative hover:bg-sky-200/5"
          icon={
            <ClapperboardIcon
              size={48}
              strokeWidth={1.5}
              className="shrink-0 duration-200 group-hover:text-sky-400"
            />
          }
          title={t.home.teleprompter.title}
          description={t.home.teleprompter.description}
        >
            <div className="absolute top-2 right-2 inline-flex text-xs items-center rounded-md backdrop-blur-sm bg-green-500/10 px-2 py-1 font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
            WIP
          </div>
        </HomeButton>

        <HomeButton
          path="/flashcards"
          className="hover:bg-sky-200/5"
          icon={
            <BookAIcon
              size={48}
              strokeWidth={1.5}
              className="shrink-0 duration-200 group-hover:text-sky-400"
            />
          }
          title={t.home.flashcards.title}
          description={t.home.flashcards.description}
        />

        {/* <HomeButton
          path="/typing-test"
          className="hover:bg-sky-200/5 relative disabled:pointer-events-none disabled:opacity-50"
          icon={
            <KeyboardIcon
              size={48}
              strokeWidth={1.5}
              className="shrink-0 duration-200 group-hover:text-sky-400"
            />
          }
          title={t.home.typingTest.title}
          description={t.home.typingTest.description}
        >
            <div className="absolute top-2 right-2 inline-flex text-xs items-center rounded-md backdrop-blur-sm bg-green-500/10 px-2 py-1 font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
            WIP
          </div>
        </HomeButton> */}

        <HomeButton
          path="/suggestions"
          className="relative hover:bg-green-200/5"
          icon={
            <LightbulbIcon
              size={48}
              strokeWidth={1.5}
              className="shrink-0 duration-200 group-hover:text-green-400"
            />
          }
          title={t.home.suggestions.title}
          description={t.home.suggestions.description}
        >
            <div className="absolute top-2 right-2 inline-flex text-xs items-center rounded-md backdrop-blur-sm bg-green-500/10 px-2 py-1 font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
            WIP
          </div>

          </HomeButton>
      </div>
    </div>
  );
}
