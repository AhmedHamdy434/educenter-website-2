import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  actionButton?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: TitleIcon,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  actionButton,
  children,
}: PageHeaderProps) {
  const finalLabel = actionButton?.label || actionLabel;
  const FinalIcon = actionButton?.icon || ActionIcon;
  const finalOnClick = actionButton?.onClick || onAction;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-5">
      <div className="flex items-start gap-3.5">
        {TitleIcon && (
          <div className="size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <TitleIcon className="size-5.5 stroke-[2.25]" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground font-medium">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {children}
        {finalLabel && finalOnClick && (
          <Button
            onClick={finalOnClick}
            variant="brand"
            size="brandMd"
            className="flex items-center gap-2 font-bold shadow-none"
          >
            {FinalIcon && <FinalIcon className="size-4 shrink-0 stroke-[2.25]" />}
            <span>{finalLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
