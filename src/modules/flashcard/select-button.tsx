import { cn } from "@/lib/utils";

export function SelectButton({ children, className, ...rest }: React.ComponentPropsWithoutRef<"button">) {
    return (
      <button
        className={cn(
          "w-full p-2 text-lg font-medium text-smokewhite rounded-md bg-subtle/50 active:bg-hovered duration-200",
          "disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }