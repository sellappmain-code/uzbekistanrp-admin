import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  crumbs?: ReactNode;
}

export function PageHeader({ title, description, icon, actions, crumbs }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {crumbs && <div className="mb-3">{crumbs}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-default border border-border bg-surface-2">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-[28px]">{title}</h1>
            {description && <p className="mt-1.5 max-w-2xl text-sm text-fg-2 leading-relaxed">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

interface SectionHeadingProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function SectionHeading({ title, description, actionLabel, onAction, actionHref, className }: SectionHeadingProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-fg">{title}</h2>
        {actionLabel && (actionHref || onAction) && (
          <a
            href={actionHref}
            onClick={onAction ? (e) => { e.preventDefault(); onAction(); } : undefined}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-colors hover:text-primary-hover"
          >
            {actionLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
      {description && <p className="mt-1 text-[13px] text-fg-2">{description}</p>}
    </div>
  );
}