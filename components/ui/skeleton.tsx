import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-default bg-surface-2",
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:animate-[skeleton-shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.04] before:to-transparent",
        className,
      )}
      aria-hidden
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-card border border-border bg-surface p-5", className)}>
      <Skeleton className="mb-4 h-32 w-full rounded-sm" />
      <Skeleton className="mb-3 h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
    </div>
  );
}

export function SkeletonList({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-card border border-border bg-surface p-4">
          <Skeleton className="h-10 w-10 rounded-default" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}