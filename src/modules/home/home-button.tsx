import { cn } from "@/lib/utils";
import { push } from "@/lib/utils/page-router";
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

  return (
    <button
      className={cn(buttonClassNames, "text-left", className)}
      onClick={(e) => {
        onClick?.(e);
        push(router, path);
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