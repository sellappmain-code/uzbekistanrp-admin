"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, defaultValue, value, onChange, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const active = value ?? internal;

  return (
    <div className={cn("flex gap-1 rounded-default bg-surface-2 border border-border p-1", className)} role="tablist">
      {items.map((item) => (
        <button
          key={item.value}
          role="tab"
          aria-selected={active === item.value}
          onClick={() => {
            setInternal(item.value);
            onChange?.(item.value);
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-sm px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150",
            active === item.value
              ? "bg-surface-3 text-fg shadow-sm"
              : "text-fg-2 hover:text-fg hover:bg-surface-3/50",
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span
              className={cn(
                "rounded-pill px-1.5 py-0.5 text-[11px]",
                active === item.value ? "bg-primary/15 text-primary" : "bg-surface-2 text-fg-muted",
              )}
            >
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}