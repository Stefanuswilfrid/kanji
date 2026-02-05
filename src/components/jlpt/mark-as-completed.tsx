"use client";

import { cn } from "@/lib/utils";
import { LucideCheckCircle } from "lucide-react";

export function MarkAsCompleted({
  className,
  checkmarkClassName,
  isCompleted,
  onClick,
}: {
  className?: string;
  checkmarkClassName?: string;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute right-2 bottom-2 w-10 h-10 grid place-items-center transition active:scale-95 hover:opacity-100 rounded-md text-sm active:bg-mossgreen/10",
        isCompleted && "bg-sky-500/10",
        className
      )}
    >
      <input
        checked={isCompleted}
        onChange={onClick}
        type="checkbox"
        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Checkmark className={checkmarkClassName} />
    </div>
  );
}

export function Checkmark({ className }: { className?: string }) {
  return (
    <LucideCheckCircle
      className={cn(
        "h-6 w-6 text-smokewhite/20 peer-active:text-sky-500/50 peer-checked:text-sky-500/90 transition pointer-events-none",
        className
      )}
    />
  );
}