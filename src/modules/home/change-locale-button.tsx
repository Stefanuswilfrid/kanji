"use client";

import { useLocale } from "@/locales/use-locale";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ChangeLocaleButton() {
  const pathname = usePathname();
  const { locale: currentLocale } = useLocale();

  const nextLocale: "en" | "id" = currentLocale === "en" ? "id" : "en";

  const visiblePathname = typeof window !== "undefined" ? window.location.pathname : pathname;
  const prefix = /^\/(en|id)(?=\/|$)/;
  const restPath = visiblePathname.replace(prefix, "") || "/";
  const normalizedRestPath = restPath === "/" ? "" : restPath;

  const basePath =
    nextLocale === "en" ? `/en${normalizedRestPath}` : normalizedRestPath || "/";

  return (
    <Link
      href={basePath}
      className="relative grid place-items-center z-50 px-4 py-2.5 rounded-md text-sm bg-softblack border border-secondary/10 sm:flex-1 active:bg-hovered duration-200"
    >
      {currentLocale.toUpperCase()}
    </Link>
  );
}