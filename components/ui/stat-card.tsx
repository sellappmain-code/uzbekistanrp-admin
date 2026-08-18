import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, hint, className }: StatCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-fg-2">{label}</p>
        {icon && <span className="text-fg-muted">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold text-fg">{value}</p>
      <div className="mt-1.5 flex items-center gap-2">
        {trend !== undefined && trend !== 0 && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              trend > 0 ? "text-success" : "text-danger",
            )}
          >
            {trend > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
        {hint && <span className="text-xs text-fg-muted">{hint}</span>}
      </div>
    </Card>
  );
}