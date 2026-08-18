import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-surface border border-border",
        hoverable &&
          "transition-all duration-200 hover:border-border-strong hover:border-primary/40 hover:-translate-y-px",
        className,
      )}
      {...props}
    />
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export function CardHeader({ className, title, description, icon, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-border px-5 py-4", className)} {...props}>
      <div className="flex items-start gap-3">
        {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
        <div>
          {title && <h3 className="text-[15px] font-semibold text-fg">{title}</h3>}
          {description && <p className="mt-0.5 text-[13px] text-fg-2">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-t border-border px-5 py-4", className)} {...props} />;
}