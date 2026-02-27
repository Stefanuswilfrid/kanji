import React from "react";
import { Playlist, PLACEHOLDER_SRC } from "./utils/media";
import Image from "next/image";

export const PlaylistCard = ({
    playlist,
    onPlaylistClicked,
    priority = false,
  }: {
    playlist: Playlist;
    onPlaylistClicked: (id: string) => void;
    priority?: boolean;
  }) => {
    const [error, setError] = React.useState(false);
  
    const thumbnail =
      !error && (playlist.image_big?.src || playlist.image_small?.src)
        ? (playlist.image_big?.src || playlist.image_small?.src)!
        : PLACEHOLDER_SRC;
  
    return (
      <button onClick={() => onPlaylistClicked(playlist.diocoPlaylistId)} className="active:opacity-80 transition w-full">
        <div className="overflow-hidden">
          <div className="relative rounded-full overflow-hidden aspect-square">
            <Image
              onError={() => setError(true)}
              src={thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover"
              width={480}
              height={360}
              priority={priority}
            />
          </div>
          <div className="mt-4 space-y-1 px-1">
            <p className="font-medium text-smokewhite line-clamp-2">
              {playlist.title_translation?.translation || playlist.title}
            </p>
            <p className="text-sm text-secondary">{playlist.satisfiesFiltersCount} total</p>
          </div>
        </div>
      </button>
    );
  };