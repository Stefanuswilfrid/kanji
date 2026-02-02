"use client";

import { ReplaceRouteButton } from "@/components/route-button";
import { useLocale } from "@/locales/use-locale";
import { DesktopSidebar } from "@/modules/jlpt/layout/sidebar";

function JLPTLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();

  return (
    <div className="grow">
      <header className="fixed z-50 top-0 left-0 w-screen h-16 grid place-items-center bg-black border-b border-b-secondary/10">
        <ReplaceRouteButton>
          <div className="mb-[3px]">&#8592;</div> {t.return}
        </ReplaceRouteButton>
      </header>
      <div className="mx-auto max-w-360 flex gap-1">
        <DesktopSidebar />
        {children}
      </div>
    </div>
  );
}

export default JLPTLayout;

