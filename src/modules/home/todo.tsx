'use client'
import { Divider } from "@/components/divider";
import AuthButton from "./auth-button";
import { SearchIcon } from "lucide-react";
import { useWindowSize } from "@/hooks/useWindowSize";

export function HomeTodo() {
  const { width } = useWindowSize();

  return (
    <div>
      <div className="flex items-center justify-between">
               <AuthButton />

        <div className="flex gap-2"></div>
                <button
          onClick={() => {
          
          }}
          className="relative flex gap-2 items-center text-secondary sm:flex-1 rounded-md border border-secondary/10 p-2.5 sm:max-w-xs active:bg-hovered duration-200 bg-softblack"
        >
          <SearchIcon size={20} strokeWidth={1.5} className="shrink-0 duration-200 group-hover:text-sky-400" />
          {width > 640 && (
            <span>
              検索
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono pl-2">⌘K</span>
            </span>
          )}
        </button>
      </div>

            <Divider />


      <div className="grid md:grid-cols-2 gap-4"></div>
    </div>
  );
}
