"use client";
import { cn } from "@/lib/utils";
import { replace } from "@/lib/utils/page-router";
import { useRouter } from "next/navigation";
import React from "react";
import { useLocale } from "@/locales/use-locale";

export function ReplaceRouteButton({
  children,
  path,
}: {
  children: React.ReactNode;
  path?: string;
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const resolvedPath = path ?? (locale === "en" ? "/en" : "/");

  const ref = React.useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      onClick={() => {
        if (ref.current) {
          ref.current.disabled = true;
          replace(router, resolvedPath);
        }
      }}
      type="button"
      className={cn(
        "py-2 pl-4 pr-3 rounded-md",
        "duration-200 active:bg-hovered",
        "flex items-center gap-2",
      )}
    >
      {children}
    </button>
  );
}
