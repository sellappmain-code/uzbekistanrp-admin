"use client";

import { type ReactNode, type HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> extends HTMLAttributes<HTMLDivElement> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyText?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  loading,
  emptyText = "Ma'lumot topilmadi",
  className,
}: DataTableProps<T>) {
  const pageCount = Math.ceil((total ?? data.length) / pageSize);

  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-card bg-surface-2" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-2 py-16 text-center", className)}>
        <p className="text-sm text-fg-2">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-xs font-medium uppercase tracking-wide text-fg-muted",
                    col.hideOnMobile && "hidden md:table-cell",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row) => (
              <tr key={String(row[keyField])} className="transition-colors hover:bg-surface-2/60">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3.5 text-sm text-fg-2", col.hideOnMobile && "hidden md:table-cell", col.className)}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-fg-muted">
            {pageSize * (page - 1) + 1}–{Math.min(pageSize * page, total ?? data.length)} / {total ?? data.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)} aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm text-fg-2">
              {page} / {pageCount}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page >= pageCount} onClick={() => onPageChange?.(page + 1)} aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}