import { cn } from "@/lib/utils";


export const LoadingBar = ({ className }: { className?: string }) => (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
    </div>
  );
  