import { useState } from "react";
import { DocsMetadaum, formatTime, PLACEHOLDER_SRC } from "./utils/media";
import Image from "next/image";
import Link from "next/link";

function getThumbnailSrc(doc: DocsMetadaum): string {
  const img = doc.image as unknown;
  let src = "";
  if (typeof img === "string") src = img.trim();
  else if (img && typeof img === "object") {
    const obj = img as Record<string, unknown>;
    const s = obj.src ?? obj.url ?? obj.URL;
    src = typeof s === "string" ? s.trim() : "";
  }
  if (src && (src.includes("img.youtube.com") || src.includes("i.ytimg.com"))) {
    src = src.replace("img.youtube.com", "i.ytimg.com");
  }
  return src;
}

export const YoutubeCard = ({ doc, priority = false }: { doc: DocsMetadaum; priority?: boolean }) => {
  const [error, setError] = useState(false);
  const thumbnail = getThumbnailSrc(doc);
  const thumbnailSrc = !error && thumbnail ? thumbnail : PLACEHOLDER_SRC;
  const rawChannelId = doc.info.channelId as unknown;
  const channelId = typeof rawChannelId === "string" ? rawChannelId.trim() : "";

  return (
    <Link
      key={doc.diocoDocId}
      href={`/youtube/${doc.info.videoId}?lang=${doc.lang_G}`}
      className="active:opacity-80 transition"
    >
      <div className="overflow-hidden">
        <div className="relative sm:rounded-lg overflow-hidden aspect-video">
          <Image
            onError={() => setError(true)}
            src={thumbnailSrc}
            alt="thumbnail"
            className="w-full h-full object-cover"
            width={480}
            height={360}
            priority={priority}
            unoptimized
          />
          <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 inline-flex items-center rounded-md bg-subtle/80 px-2 py-1 text-xs font-medium text-secondary-100 ring-inset">
            {doc.durationText ?? formatTime((doc.duration_ms ?? 0) / 1000)}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          {doc.info.channelAvatarUrl ? (
            <div className="relative rounded-full overflow-hidden w-10 h-10">
              <Image
                src={doc.info.channelAvatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
                width={88}
                height={88}
              />
            </div>
          ) : channelId ? (
            <div className="relative rounded-full overflow-hidden w-10 h-10">
              <Image
                src={`https://api-cdn.dioco.io/mmd_ytChannelThumb/88/${channelId}`}
                alt="avatar"
                className="w-full h-full object-cover"
                width={88}
                height={88}
              />
            </div>
          ) : null}
          <div className="-mt-0.5 flex-1 space-y-1">
            <p className="font-medium text-smokewhite line-clamp-2">
              {doc.diocoDocName_translation?.translation || doc.diocoDocName}
            </p>
            <p className="text-sm text-secondary">
              {(doc.publishedAtDisplay ?? (doc.publishDate ? new Date(doc.publishDate.timestamp_unixms).toLocaleDateString() : ""))} • {doc.info.viewCount ?? 0} views
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
