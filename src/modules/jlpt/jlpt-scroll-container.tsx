"use client";

import { useRef } from "react";

export function JlptScrollContainer({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="w-full h-full overflow-y-auto scrollbar max-sm:pb-12">
      {children}
    </div>
  );
}

