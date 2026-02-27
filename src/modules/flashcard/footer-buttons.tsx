 "use client";
import { useLocale } from "@/locales/use-locale";
import { motion, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { LucideColumns2, LucideDownload } from "lucide-react";
import { useRouter } from "next/navigation";

export function FooterButtons({ onExport }: { onExport: () => void }) {
  const { t } = useLocale();

  const y = useMotionValue(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous) {
      if (latest > previous) {
        y.set(144);
      } else {
        y.set(0);
      }
    }
  });

  const router = useRouter();

  return (
    <motion.div
      style={{
        y,
        bottom: "calc(env(safe-area-inset-bottom))",
        transitionDuration: "300ms",
        transitionProperty: "transform",
        transitionTimingFunction: "ease-in-out",
      }}
      className="sticky mt-8 max-md:mx-4 flex flex-col md:flex-row justify-end gap-2 pb-2"
    >
      <button
        type="button"
        onClick={() => {
          const params = new URLSearchParams(window.location.search);
          params.set("review", "true");
          router.push(`${window.location.pathname}?${params.toString()}`);
        }}
        className="shrink-0 rounded-md font-medium max-md:w-full text-white p-3 md:py-2.5 md:px-4 duration-200 bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {t.review} <LucideColumns2 size={20} />
      </button>
      <button
        type="button"
        onClick={onExport}
        className="shrink-0 rounded-md font-medium max-md:w-full text-white p-3 md:py-2.5 md:px-4 duration-200 bg-blue-500 active:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {t.export} <LucideDownload size={20} />
      </button>
    </motion.div>
  );
}
