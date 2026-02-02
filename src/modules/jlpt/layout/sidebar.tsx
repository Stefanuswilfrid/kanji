"use client";

import { Drawer } from "@/components/jlpt/drawer";
import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { JLPTLevelItems } from "./JLPTLevelItems";
import { useLocale } from "@/locales/use-locale";

export function DesktopSidebar() {
  const { locale } = useLocale();

  return (
    <div className="max-md:hidden border-r border-r-secondary/10">
      <aside className="px-4 pb-4 pt-20 z-10 sticky top-0 h-[calc(100dvh-7rem)] overflow-y-auto scrollbar min-w-64">
        <ul className="space-y-1">
          <JLPTLevelItems locale={locale} />
        </ul>
      </aside>
      <div className="ml-6 space-y-2 pt-3 max-w-45"></div>
    </div>
  );
}

export function SidebarItem({
  href,
  children,
  isActive,
  rightItem,
  isDrawer = false,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  rightItem?: React.ReactNode;
  isDrawer?: boolean;
}) {
  return (
    <li
      className={clsx(
        "flex rounded-md md:rounded items-center gap-4 relative font-medium text-lg list-none duration-200",
        !isActive && "active:bg-softblack",
      )}
    >
      <ActiveIndicator isActive={isActive} />
      {isDrawer ? (
        <Drawer.Close asChild>
          <Link
            className={clsx(
              "inline-block w-full transition pl-4 py-4",
              isActive ? "translate-x-0" : "md:-translate-x-2",
              !isActive && "opacity-50",
              !rightItem && "pr-4",
            )}
            href={href}
          >
            {children}
          </Link>
        </Drawer.Close>
      ) : (
        <Link
          className={clsx(
            "inline-block w-full transition pl-4 py-4",
            isActive ? "translate-x-0" : "md:-translate-x-2",
            !isActive && "opacity-50",
            !rightItem && "pr-4",
          )}
          href={href}
        >
          {children}
        </Link>
      )}
      {rightItem && (
        <div className={clsx("transition pr-4", !isActive && "opacity-50")}>
          {rightItem}
        </div>
      )}
    </li>
  );
}

const ActiveIndicator = React.memo(
  function ActiveIndicator({ isActive }: { isActive: boolean }) {
    if (!isActive) return null;

    return (
      <motion.div
        layoutId="active"
        className="absolute -z-10 inset-0 rounded-md bg-zinc"
      ></motion.div>
    );
  },
  (prev, curr) => prev.isActive === curr.isActive,
);
