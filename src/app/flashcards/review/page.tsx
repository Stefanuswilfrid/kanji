"use client";
import { BackRouteButton } from "@/components/route-button";
import { Layout } from "@/modules/layout/layout";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function FlashcardReview() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const numOfCards = searchParams.get("numOfCards");
  const chapter = searchParams.get("chapter");
  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto sm:px-8 pb-4">
          <div className="max-sm:sticky top-0 flex flex-col justify-end bg-black z-20 max-md:px-4 border-b-[1.5px] border-b-subtle">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="w-fit"
              >
                <BackRouteButton className="my-3" />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </Layout>
  );
}
