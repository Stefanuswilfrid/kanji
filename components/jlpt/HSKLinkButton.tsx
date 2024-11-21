import { cn } from "@/utils/cn";
import Link, { LinkProps } from "next/link";
import React from "react";

type JLPTLinkButtonProps = {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
} & LinkProps;

export function JLPTLinkButton({ disabled = false, className, children, ...rest }: JLPTLinkButtonProps) {
  return (
    <Link
      aria-disabled={disabled}
      className={cn(
        "select-none inline-block h-full text-center max-sm:flex-1 bg-softblack active:bg-softblack/40 text-smokewhite px-6 py-3.5 font-medium active:shadow-none active:translate-y-1 border-b border-secondary/10 aria-disabled:pointer-events-none aria-disabled:bg-softblack/80 aria-disabled:text-smokewhite/50 aria-disabled:border-secondary/10 backdrop-blur-md duration-200",
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

type JLPTButtonProps = {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"button">;

export function JLPTButton({ disabled = false, className, children, ...rest }: JLPTButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "select-none inline-block h-full text-center max-sm:flex-1 bg-softblack active:bg-softblack/40 text-smokewhite px-6 py-3.5 font-medium active:shadow-none active:translate-y-1 border-b border-secondary/10 aria-disabled:pointer-events-none aria-disabled:bg-softblack/80 aria-disabled:text-smokewhite/50 aria-disabled:border-secondary/10 backdrop-blur-md duration-200",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
