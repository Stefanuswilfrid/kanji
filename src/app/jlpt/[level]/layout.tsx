import { DesktopSidebar } from "@/modules/hsk/layout/sidebar";
import { AnimatePresence } from "framer-motion";

function JLPTLayout({ children }: { children: React.ReactNode }) {
  return (
    //existing component finish it animation entirely before new comp begins entering
    // <AnimatePresence mode="wait">
    <div className="flex-grow">
      <header className="fixed z-50 top-0 w-screen h-16">

      </header>
      <div className="mx-auto max-w-360 flex gap-1">
              <DesktopSidebar/>
              {children}

        </div>

      </div>
    // </AnimatePresence>
  );
}

export default JLPTLayout;
