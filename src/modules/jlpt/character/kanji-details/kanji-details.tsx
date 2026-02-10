import { Level } from "@/data/constants";
import React from "react";

export function KanjiDetails({  currentLevel }: { currentLevel: Level }) {

    const ref = React.useRef<HTMLDivElement>(null);

    return (
    <div ref={ref} className="overflow-y-auto flex-1 scrollbar-none py-4">
      {<span className="px-4 text-sm">JLPT {currentLevel}</span>}
      </div>
    )
}
