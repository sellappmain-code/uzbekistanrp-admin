"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function SearchInput({ value, defaultValue, onChange, placeholder = "Qidirish...", className, autoFocus, onKeyDown }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
      <input
        type="search"
        value={value}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-default border border-border bg-surface-2 pl-10 pr-4 text-sm text-fg placeholder:text-fg-muted transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
      />
    </div>
  );
}