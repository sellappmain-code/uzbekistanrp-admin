"use client";

import { type ReactNode, type HTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  align?: "left" | "right";
}

export function Dropdown({ trigger, open, onOpenChange, align = "right", className, children }: DropdownProps) {
  return (
    <div className={cn("relative", className)}>
      <div onClick={() => onOpenChange(!open)}>{trigger}</div>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => onOpenChange(false)} aria-hidden />
          <div
            className={cn(
              "absolute z-40 mt-2 min-w-[200px] rounded-card border border-border bg-surface-3 shadow-md animate-fade-in",
              align === "right" ? "right-0" : "left-0",
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export function DropdownItem({
  icon,
  children,
  onClick,
  danger,
}: {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors",
        "first:rounded-t-card last:rounded-b-card",
        danger ? "text-danger hover:bg-danger/10" : "text-fg-2 hover:bg-surface-2 hover:text-fg",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-border" />;
}

export function DropdownHeader({ children }: { children: ReactNode }) {
  return <div className="border-b border-border px-3.5 py-3">{children}</div>;
}

export function TriggerLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {children}
      <ChevronDown className="h-3.5 w-3.5 text-fg-muted" />
    </span>
  );
}