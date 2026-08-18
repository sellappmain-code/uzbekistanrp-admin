import { AlertCircle, Inbox, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: "inbox" | "search" | "error" | "offline";
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const icons = {
  inbox: Inbox,
  search: AlertCircle,
  error: AlertCircle,
  offline: WifiOff,
};

export function EmptyState({ icon = "inbox", title, description, actionLabel, onAction, className }: EmptyStateProps) {
  const Icon = icons[icon];
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-center", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-card border border-border bg-surface-2">
        <Icon className="h-6 w-6 text-fg-muted" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
        {description && <p className="mt-1 text-[13px] text-fg-2 max-w-sm">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingState({ label = "Yuklanmoqda..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm text-fg-2">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-card border border-danger/30 bg-danger/10">
        <AlertCircle className="h-6 w-6 text-danger" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-fg">Xatolik yuz berdi</h3>
        <p className="mt-1 text-[13px] text-fg-2 max-w-sm">{message ?? "Ma'lumotlarni yuklashda muammo bo‘ldi."}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Qayta urinish
        </Button>
      )}
    </div>
  );
}