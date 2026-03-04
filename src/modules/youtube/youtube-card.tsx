import { useCallback, useState } from "react";
import { DocsMetadaum, formatTime, PLACEHOLDER_SRC } from "./utils/media";
import Image from "next/image";
import Link from "next/link";

export const YoutubeCard = ({ doc }: { doc: DocsMetadaum }) => {
  const [src, setSrc] = useState(doc.image?.src || PLACEHOLDER_SRC);
  const onError = useCallback(() => setSrc(PLACEHOLDER_SRC), []);
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={onError}
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
