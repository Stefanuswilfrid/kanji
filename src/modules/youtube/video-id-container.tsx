"use client";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { SubtitleSettings } from "./transcripts/components/react/settings";
import { SubtitleSettingsProvider, useSubtitleSettings } from "./transcripts/provider/subtitle-settings";
import { DictEntryProvider, useDictEntry } from "./transcripts/provider/dict-entry";


export function VideoIdContainer() {
  return (
    <DictEntryProvider>
  <SubtitleSettingsProvider>
    <TranscriptComponent />
  </SubtitleSettingsProvider>
  </DictEntryProvider>);
}

function TranscriptComponent() {
    const playerRef = useRef<ReactPlayer>(null);
    const subtitleSettingsRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState<any>(null);
    const { videoId, videoSize, audioOnly } = useSubtitleSettings();

    const toStopAfterRef = useRef(0);
    const { drawerOpen, setDrawerOpen } = useDictEntry();

    const searchParams = useSearchParams();

    const lastWatched = parseInt(searchParams.get("last_watched") ?? "0");


  return (
    <div>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row md:gap-3 xl:gap-6 p-0 sm:p-0 md:p-3 xl:p-6">
        <div className="h-full w-full sm:w-2/3">
          <div ref={subtitleSettingsRef}>
            <SubtitleSettings />
          </div>
          {/* Video */}
          <div
            className={clsx(
              "md:rounded-lg sm:overflow-hidden sm:mt-0 md:mt-3 xl:mt-6",
              videoSize === "default" && "aspect-video w-full",
              videoSize === "half-screen" && "h-[50dvh] w-full",
              videoSize === "full-screen" && "h-[calc(100dvh+4px)] w-full",
              audioOnly && "opacity-0 h-0 w-0",
            )}
          >
            <ReactPlayer
              ref={playerRef}
              url={`https://www.youtube.com/watch?v=${videoId}`}
              playing={playing}
              width="100%"
              height="100%"
              controls={drawerOpen ? false : true}
              onReady={() => {
                if (lastWatched) {
                  playerRef?.current?.seekTo(lastWatched);
                  setPlaying(true);
                }
              }}
              onPlay={() => {
                setPlaying(true);

                if (subtitleSettingsRef.current) {
                  const offsetTop = subtitleSettingsRef.current.offsetTop;
                  const height = subtitleSettingsRef.current.offsetHeight;
                  const scrollToY = offsetTop + height; // 16px below the component

                  const additionalPixel = window.innerWidth < 768 ? 2 : 0;

                  window.scrollTo({
                    top: scrollToY + additionalPixel,
                    behavior: "smooth",
                  });
                }

                if (toStopAfterRef.current) {
                  setTimeout(() => {
                    setPlaying(false);
                  }, toStopAfterRef.current - 300);

                  toStopAfterRef.current = 0;
                }
              }}
              onPause={() => setPlaying(false)}
              onProgress={async ({
                playedSeconds,
              }: {
                playedSeconds: number;
              }) => {
                
                // 	setCurrentTime(playedSeconds);
              }
            }
            />
          </div>

          {/* Right Panel (md+ only) */}
          <div className="hidden sm:block m-3">
            <p>Subtitles API:</p>
            <a
              href="https://www.languagereactor.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400"
            >
              Language Reactor
            </a>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
