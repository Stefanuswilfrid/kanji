"use client";

import { cn } from "@/lib/utils";
import { push } from "@/lib/utils/page-router";
import { useLocale } from "@/locales/use-locale";
import { useRouter } from "next/navigation";
type AdditionalProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
};

const buttonClassNames = "group duration-200 hover:bg-hovered border dark:border-black p-4 rounded-lg";


export function HomeButton({
  className,
  title,
  description,
  icon,
  path,
  children,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & AdditionalProps) {
  const router = useRouter();
  const { locale } = useLocale();

  const href = (() => {
    // If the caller already provided `/en/...`, keep it.
    if (path === "/en" || path.startsWith("/en/")) {
      return path;
    }

    // URL scheme:
    // - Indonesian (default): `/...` (no prefix)
    // - English: `/en/...`
    if (locale === "en") {
      if (path === "/") return "/en";
      return `/en${path}`;
    }

    return path;
  })();

  return (
    <button
      className={cn(buttonClassNames, "text-left", className)}
      onClick={(e) => {
        onClick?.(e);
        push(router, href);
      }}
      {...props}
    >
      <div className="flex items-center gap-4 h-full">
        {icon}
        <div className="space-y-0">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-sm mt-2 text-secondary">{description}</p>
        </div>
      </div>
      {children}
    </button>
  );
}