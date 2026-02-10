"use client";
import { Drawer } from "@/components/jlpt/drawer";
import { MarkAsCompleted } from "@/components/jlpt/mark-as-completed";
import { JLPT_LEVELS, type Level } from "@/data/constants";
import clsx from "clsx";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {  KanjiDetails } from "./kanji-details/kanji-details";



export function KanjiModal() {
  const router = useRouter();
  const params = useParams<{ level?: string }>();
  const searchParams = useSearchParams();
  const kanji = searchParams.get("kanji") as string;
  const currentKanjiId = searchParams.get("id") as string;

  const currentLevel: Level | null = (() => {
    const raw = params?.level;
    const levelParam = Array.isArray(raw) ? raw[0] : raw;
    if (!levelParam) return null;
    const normalized = levelParam.startsWith("n") ? levelParam.slice(1) : levelParam;
    const n = Number.parseInt(normalized, 10);
    if (!Number.isFinite(n)) return null;
    if (!JLPT_LEVELS.includes(n as any)) return null;
    return n as Level;
  })();

  const previousHanziId = (parseInt(currentKanjiId) - 1).toString() as any;
  const nextHanziId = (parseInt(currentKanjiId) + 1).toString() as any;



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
        {currentLevel && <KanjiDetails currentLevel={currentLevel} />}
        <div className="absolute top-8 sm:top-4 left-0 right-0 mx-4 bg-linear-to-b from-black h-6"></div>
        <div className="absolute bottom-24 sm:bottom-12 left-0 right-0 mx-4 bg-linear-to-t from-black h-12"></div>
        
        <MarkAsCompleted
          className="absolute top-12 sm:top-9 right-4 sm:right-8 w-12 h-12"
          checkmarkClassName="w-8 h-8"
          isCompleted={false}
          onClick={() => {
            
          }}
        />
        
        
        <div className="absolute bg-black max-sm:py-2 max-sm:grid max-sm:grid-cols-2 flex gap-2 bottom-0 left-0 right-0 px-3 sm:px-4 sm:pb-4">

        </div>
      </Drawer.Content>
    </Drawer>
  );
}
