"use client";

import { usePathname, useRouter } from "next/navigation";

export function ChangeLocaleButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Locale routing:
  // - Indonesian: `/id/...`
  // - English: `/en/...`
  const localePrefix = /^\/(en|id)(?=\/|$)/;
  const currentLocale: "en" | "id" =
    pathname.match(localePrefix)?.[1] === "en" ? "en" : "id";
  const nextLocale: "en" | "id" = currentLocale === "en" ? "id" : "en";

  const restPath = pathname.replace(localePrefix, "") || "/";
  const normalizedRestPath = restPath === "/" ? "" : restPath;

  const href = `/${nextLocale}${normalizedRestPath}`;

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="relative grid place-items-center z-50 px-4 py-2.5 rounded-md text-sm bg-softblack border border-secondary/10 sm:flex-1 active:bg-hovered duration-200"
    >
      {currentLocale.toUpperCase()}
    </button>
  );
}