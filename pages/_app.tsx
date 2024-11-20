import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

import { Seo } from "@/components";
import { apiClient } from "@/utils";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/modules/auth";
import { ConfettiProvider, NewReadingLayout } from "@/modules/layout/new-reading-layout";

export default function App({ Component, pageProps, router }: AppProps) {
  const isNewReading = router.pathname.startsWith("/new");
  const isTools = router.pathname.startsWith("/tools");
  const isHsk = router.pathname.startsWith("/hsk");
  const isOldHsk = router.pathname.startsWith("/old-hsk");
  const isReading = router.pathname.startsWith("/read");
  
  return (
    <ThemeProvider forcedTheme="dark">
      <Seo />
      <SWRConfig
        value={{
          fetcher: (url) => {
            if (url.includes("undefined")) return undefined;
            return apiClient.get(url).then((res) => res.data);
          },
        }}
      >
        <SessionProvider session={pageProps.session}>
          <AuthProvider>
            <ConfettiProvider>
              <AnimatePresence mode="wait">
                {isNewReading ? (
                  <NewReadingLayout key="new-reading">
                    <Component key={router.pathname} {...pageProps} />
                  </NewReadingLayout>
                ) :  (
                  <Component key={router.pathname} {...pageProps} />
                )}
                {/* <Component key={router.pathname} {...pageProps} /> */}
              </AnimatePresence>
            </ConfettiProvider>
          </AuthProvider>
        </SessionProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
