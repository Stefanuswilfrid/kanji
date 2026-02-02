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

  const firstSegment = pathname.split("/")[1] || "";
  const locale: "en" | "id" = firstSegment === "en" || firstSegment === "id" ? firstSegment : "id";

  return {
    t: contents[locale],
    locale,
  };
}