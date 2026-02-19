import React from "react";

export function useDragToScroll() {
    const ref = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);
    const startX = React.useRef(0);
    const startScroll = React.useRef(0);
  
    const onPointerDown = (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el) return;
  
      isDragging.current = true;
      startX.current = e.clientX;
      startScroll.current = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };
  
    const onPointerMove = (e: React.PointerEvent) => {
      if (!isDragging.current) return;
  
      const el = ref.current;
      if (!el) return;
  
      const dx = e.clientX - startX.current;
      el.scrollLeft = startScroll.current - dx;
    };
  
    const onPointerUp = () => {
      isDragging.current = false;
    };
  
    return { ref, onPointerDown, onPointerMove, onPointerUp };
  }
  