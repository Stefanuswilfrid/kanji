import clsx from "clsx";

export function AudioButton({
  text,
  speed = 1,
  size = "normal",
}: {
  text: string;
  speed?: number;
  size?: "small" | "normal" | "large";
}) {
    return (
        <button className={clsx("flex items-center opacity-50 text-sky-400",         size === "small" && "inline align-middle max-sm:mb-0.5",
        )}>
               <svg
        className={clsx(
          size === "small" && "w-[18px] h-[18px]",
          size === "normal" && "w-6 h-6",
          size === "large" && "w-8 h-8"
        )}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
        </button>
    )
}
