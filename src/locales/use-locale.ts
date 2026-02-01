'use client';
import en from "@/locales/en.json";
import id from "@/locales/id.json";
import { usePathname } from "next/navigation";

const contents = {
  en,
  id,
};

export function useLocale(){
  const pathname = usePathname();

  
  const locale: "en" | "id" = pathname.startsWith("/en") ? "en" : "id";

  return {
    t: contents[locale],
    locale,
  };
}