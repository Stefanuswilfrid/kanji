import { Virtualizer } from "@tanstack/react-virtual";
import { easeInOut } from "framer-motion";
import React from "react";
type EaseInOutType = "quint" | "cubic" | "sine" | "quad";

// base on smooth scroll example from v2 https://github.com/TanStack/virtual/blob/main/examples/smooth-scroll/src/main.jsx
export const useSmoothScroll = (virtualizer: Virtualizer<Window, Element>, easeInOutType: EaseInOutType = "quint") => {
    const scrollingRef = React.useRef(0);
  
    return React.useCallback(
      (
        index: number,
        {
          align: initialAlign,
          duration = 1000,
          additionalOffset = 0,
        }: { align?: "start" | "center" | "end" | "auto"; duration?: number; additionalOffset?: number } = {}
      ) => {
        const start = virtualizer.scrollOffset ?? 0;
        const startTime = (scrollingRef.current = Date.now());
        const [, align] = virtualizer.getOffsetForIndex(index, initialAlign) ?? [0, "start"];
  
        const run = () => {
          if (scrollingRef.current !== startTime) return;
          const now = Date.now();
          const elapsed = now - startTime;
          const progress = easeInOut(Math.min(elapsed / duration, 1));
          const [offset] = virtualizer.getOffsetForIndex(index, align) ?? [0, "start"];
          const interpolated = start + (offset - start) * progress;
  
          if (elapsed < duration) {
            virtualizer.scrollToOffset(interpolated + additionalOffset, { align: "start" });
            requestAnimationFrame(run);
          } else {
            virtualizer.scrollToOffset(interpolated + additionalOffset, { align: "start" });
          }
        };
  
        requestAnimationFrame(run);
      },
      [easeInOutType, virtualizer]
    );
  };