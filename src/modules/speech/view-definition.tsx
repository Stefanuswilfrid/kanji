import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { LucideCopy, LucideCopyCheck } from "lucide-react";
import React from "react";

export function CopyToClipboard({
    text,
    size,
    className,
    iconClassName,
  }: {
    text: string;
    size: number;
    className?: string;
    iconClassName?: string;
  }) {
    const [copied, setCopied] = React.useState(false);
  
    const Icon = copied ? LucideCopyCheck : LucideCopy;
  
    return (
      <button
        disabled={copied}
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className={cn(
          "group relative flex h-9 md:h-12 w-9 md:w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 disabled:active:bg-transparent active:bg-hovered",
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={copied.toString()}
            initial={{
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.9,
              opacity: 0.5,
            }}
            transition={{
              duration: 0.15,
            }}
          >
            <Icon
              strokeWidth={2}
              size={size}
              className={cn("text-sky-400", copied ? "opacity-100" : "opacity-50", iconClassName)}
            />
          </motion.div>
        </AnimatePresence>
      </button>
    );
  }