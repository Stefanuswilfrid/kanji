import React from "react";
import { Onboarding } from "@/modules/onboarding";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/modules/layout";
import { useOnboarded } from "@/modules/onboarding/use-onboarded";

export default function Home() {
  const { isOnboarded, setIsOnboarded } = useOnboarded();

  return (
    <div className=" min-h-dvh">
      <main className="max-w-[960px] mx-auto px-4 md:px-8 py-32">
      <AnimatePresence mode="wait">
          {isOnboarded ? (
            <Layout key="home">
              <h1 className="text-3xl font-bold">Welcome back!</h1>
            </Layout>
          ) : (
            <Onboarding
              onContinue={() => {
                setIsOnboarded(true);
                localStorage.setItem("focus_onboarded", "true");
              }}
            />
          )}
        </AnimatePresence>      </main>
    </div>
  );
}
