'use client';
import en from "@/locales/en.json";
import id from "@/locales/id.json";
import { usePathname, useSearchParams } from "next/navigation";

export function useLocale(){
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Locale detection for App Router + middleware rewrite:
  // - `/en/...` is rewritten to `/<path>?__locale=en` (so `usePathname()` won't include `/en`)
  // - Default `id` has no prefix and no `__locale`
  const localeFromQuery = searchParams.get("__locale");
  const locale: "en" | "id" =
    localeFromQuery === "en" ? "en" : pathname.startsWith("/en") ? "en" : "id";

  return {
    locale,
    t: locale === "en" ? en : id,
  };
}