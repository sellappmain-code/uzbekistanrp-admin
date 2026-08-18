import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeStatus = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

const styles: Record<BadgeStatus, string> = {
  success: "bg-success/10 text-success border-success/25",
  warning: "bg-warning/10 text-warning border-warning/25",
  danger: "bg-danger/10 text-danger border-danger/25",
  info: "bg-info/10 text-info border-info/25",
  neutral: "bg-surface-2 text-fg-2 border-border",
  primary: "bg-primary/10 text-primary border-primary/25",
};

const dots: Partial<Record<BadgeStatus, string>> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
  withDot?: boolean;
}

export function Badge({ className, status = "neutral", withDot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-xs font-medium",
        styles[status],
        className,
      )}
      {...props}
    >
      {withDot && dots[status] && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dots[status])} aria-hidden />
      )}
      {children}
    </span>
  );
}