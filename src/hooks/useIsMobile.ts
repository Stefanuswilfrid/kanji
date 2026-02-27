import React from "react";

export default function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const ua = navigator.userAgent ?? "";
    const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

    setIsMobile(isMobileUA || coarsePointer);
  }, []);

  return isMobile;
}

