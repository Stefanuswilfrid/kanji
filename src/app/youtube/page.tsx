"use client";
import { BackRouteButton } from "@/components/route-button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/locales/use-locale";
import { Layout } from "@/modules/layout/layout";
import { usePersistedState } from "@/modules/youtube/hooks/usePersistedState";
import { VideoChannels } from "@/modules/youtube/video-channel";
import { VideoContainer } from "@/modules/youtube/video-container";

export default function Youtube() {
    const [category, setCategory] = usePersistedState<number>("youtube-category", 0);


  const { t } = useLocale();
  return (
    <Layout>
      <div>
      <main className="max-w-[960px] mx-auto md:px-8 pb-4">
      <div className="sticky top-0 flex flex-col justify-end bg-black z-10 max-md:px-2 pb-4 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>

            <div className="mt-2">
              <div className="flex">
                <button
                  className={cn("px-3 duration-200", category === 0 ? "opacity-100" : "opacity-50")}
                  onClick={() => setCategory(0)}
                >
                  {t.youtube?.buttons?.[0] ?? "All"}
                </button>
                <button
                  className={cn("px-3 duration-200", category === 1 ? "opacity-100" : "opacity-50")}
                  onClick={() => setCategory(1)}
                >
                  {t.youtube?.buttons?.[1] ?? "Channels"}
                </button>
                <button
                  className={cn("px-3 duration-200", category === 2 ? "opacity-100" : "opacity-50")}
                  onClick={() => setCategory(2)}
                >
                  {t.youtube?.buttons?.[2] ?? "Watch History"}
                </button>
              </div>
            </div>
          </div>         
           {category === 0 && <VideoContainer />}
           {category === 1 && <VideoChannels />}

          
        </main>
      </div>
    </Layout>
  );
}
