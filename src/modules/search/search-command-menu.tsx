"use client";
import { cn } from "@/lib/utils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CommandMenuFooter } from "./command-menu/footer";
import { Command } from "cmdk";
import { useLocale } from "@/locales/use-locale";
import { CommandMenuHeader } from "./command-menu/header";
import React from "react";
import { CommandMenuChips } from "./command-menu/chips";
import { CommandMenuSearch } from "./command-menu/search";

export function SearchCommandMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  return (
    <Dialog
      className="relative z-[998]"
      open={Boolean(search)}
      onClose={() => {
        router.back();
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-y-0 left-0 w-screen z-[998] bg-black/20 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-y-0 left-0 z-[998] w-screen p-2 sm:p-4 overflow-y-auto">
        <div className="flex justify-center text-center sm:items-center">
          <DialogPanel
            transition
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:-translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
              "bg-softblack text-smokewhite border border-secondary/10",
            )}
          >
            <CommandMenuContent />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

function CommandMenuContent() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [active, setActive] = React.useState([0, 1]);
  const [isWriting, setIsWriting] = React.useState(false);

  return (
    <>
      <Command
        filter={() => 1}
        label={t.searchPlaceholder}
        className="relative bg-softblack h-[85vh] min-h-[400px]"
      >
        <CommandMenuHeader scrolled={scrolled}>
        <CommandMenuSearch
            isLoading={false}
            placeholder={t.searchPlaceholder}
            value={value}
            onValueChange={setValue}
            isWriting={isWriting}
            setIsWriting={setIsWriting}
          />
          <CommandMenuChips
            active={active}
            toggleActive={(value) => {
              setActive((prev) => {
                const updated = Array.from(prev);
                if (updated.includes(value)) {
                  return updated.filter((item) => item !== value);
                } else {
                  return [...updated, value];
                }
              });
            }}
          />
        </CommandMenuHeader>
      </Command>
      <CommandMenuFooter />
    </>
  );
}
