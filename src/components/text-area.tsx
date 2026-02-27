import React from "react";

type TextareaProps = {
  onEscape?: (e: KeyboardEvent) => void;
  minHeight?: string;
  placeholderClassName?: string | boolean | (string | boolean)[];
  limitHeightOnBlur?: boolean;
  preventHeightChange?: boolean;
} & React.ComponentPropsWithoutRef<"textarea">;

export function Textarea({
  className,
  placeholderClassName,
  minHeight = "136px",
  onEscape = (_) => {},
  onChange,
  limitHeightOnBlur = false,
  preventHeightChange = false,
  ...rest
}: TextareaProps) {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const textArea = textAreaRef.current;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        textAreaRef.current?.blur();
        onEscape(e);
      }
    }

    textArea?.addEventListener("keydown", handleEscape);

    return () => {
      textArea?.removeEventListener("keydown", handleEscape);
    };
  }, [onEscape]);

  return (
    <div className="relative w-full">
      <textarea
        style={{
          maxHeight: preventHeightChange ? minHeight : undefined,
        }}
        onFocus={(_) => {
          if (preventHeightChange) return;
          const el = textAreaRef.current;
          if (!el) return;

          if (limitHeightOnBlur && el.scrollHeight > el.clientHeight) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }
        }}
        onBlur={(_) => {
          if (preventHeightChange) return;
          if (limitHeightOnBlur) {
            const el = textAreaRef.current;
            if (!el) return;
            el.style.height = minHeight;
          }
        }}
        ref={textAreaRef}
        onChange={(e) => {
          if (onChange) onChange(e);
          const el = textAreaRef.current;
          if (!el || preventHeightChange) return;

          el.style.height = minHeight;
          el.style.height = `${el.scrollHeight}px`;
        }}
        className="relative bg-transparent px-3 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 transition-shadow duration-200 text-secondary focus:text-white placeholder:text-secondary/50 focus:outline-none w-full h-34 peer resize-none scrollbar-none"
        {...rest}
      />
    </div>
  );
}

// use this when working with react-hook-form
export const FormTextarea = React.forwardRef(function FormTextarea(
  { className, placeholderClassName, minHeight = "136px", onEscape = (_) => {}, onChange, ...rest }: TextareaProps,
  ref: React.Ref<HTMLTextAreaElement>
) {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        textAreaRef.current?.blur();
        onEscape(e);
      }
    }

    textArea.addEventListener("keydown", handleEscape);

    return () => {
      textArea.removeEventListener("keydown", handleEscape);
    };
  }, [onEscape]);

  const value = (rest.value ?? "") as string;
  const displayedValue = focused ? rest.value : value.slice(0, 300) + (value.length > 300 ? "..." : "");

  React.useEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;

    if (focused) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    } else {
      el.style.height = minHeight;
    }
  }, [focused, minHeight]);

  return (
    <textarea
      {...rest}
      ref={(node) => {
        textAreaRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }}
      onChange={(e) => {
        if (onChange) onChange(e);
        const el = textAreaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }}
      onFocus={(e) => {
        setFocused(true);
      }}
      onBlur={(e) => {
        setFocused(false);
      }}
      style={{
        minHeight,
      }}
      className="relative bg-transparent px-3 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 transition-shadow duration-200 text-secondary focus:text-white placeholder:text-secondary/50 focus:outline-none w-full h-34 peer resize-none scrollbar-none"
      spellCheck={false}
      value={displayedValue}
    />
  );
});
