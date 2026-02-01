"use client";

import { usePathname, useRouter } from "next/navigation";

export function ChangeLocaleButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Locale routing:
  // - Indonesian (default): `/...`
  // - English: `/en/...`
  const enPrefix = /^\/en(?=\/|$)/;
  const currentLocale: "en" | "id" = enPrefix.test(pathname) ? "en" : "id";
  const nextLocale: "en" | "id" = currentLocale === "id" ? "en" : "id";

  const restPath = pathname.replace(enPrefix, "") || "/";
  const normalizedRestPath = restPath === "/" ? "" : restPath;

  const href =
    nextLocale === "en" ? `/en${normalizedRestPath}` : normalizedRestPath || "/";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        router.push(href);
      }}
      className="relative grid place-items-center z-50 px-4 py-2.5 rounded-md text-sm bg-softblack border border-secondary/10 sm:flex-1 active:bg-hovered duration-200"
    >
      {currentLocale.toUpperCase()}
    </button>
  );
}