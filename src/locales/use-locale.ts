'use client';
import en from "@/locales/en.json";
import id from "@/locales/id.json";
import { usePathname } from "next/navigation";

export function useLocale(){
  const pathname = usePathname();
  const localeFromQuery = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get("__locale")
    : null;
  const locale: "en" | "id" =
    localeFromQuery === "en" ? "en" : pathname.startsWith("/en") ? "en" : "id";

  return {
    locale,
    t: locale === "en" ? en : id,
  };
}