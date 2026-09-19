import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({ message = "جاري التحميل...", className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <Loader2 className="size-8 animate-spin text-primary mb-2" />
      <p className="text-sm font-semibold text-muted-foreground">{message}</p>
    </div>
  );
}
