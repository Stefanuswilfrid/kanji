"use client";
import { Drawer } from "@/components/jlpt/drawer";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export function KanjiModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kanji = searchParams.get("kanji") as string;
  const currentKanjiId = searchParams.get("id") as string;

  React.useEffect(() => {}, [currentKanjiId, kanji, router]);

  return (
    <Drawer open={Boolean(kanji)}
    onOpenChange={(open) => !open && router.back()}
    >
      <Drawer.Content
        className={clsx(
          "px-0 pt-4 pb-[120px] sm:pb-[72px] flex flex-col",
          "h-dvh rounded-none max-w-xl w-full",
        )}
      >
        hello
        <div className="absolute top-8 sm:top-4 left-0 right-0 mx-4 bg-gradient-to-b from-black h-6"></div>
        <div className="absolute bottom-24 sm:bottom-12 left-0 right-0 mx-4 bg-gradient-to-t from-black h-12"></div>
        <div className="absolute bg-black max-sm:py-2 max-sm:grid max-sm:grid-cols-2 flex gap-2 bottom-0 left-0 right-0 px-3 sm:px-4 sm:pb-4"></div>
      </Drawer.Content>
    </Drawer>
  );
}
