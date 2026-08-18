"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/70 animate-fade-in" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        className={cn(
          "relative w-full rounded-modal border border-border bg-surface shadow-lg animate-modal-in flex flex-col max-h-[85vh]",
          sizes[size],
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-border px-5 py-4">
            <div>
              {title && <h2 className="text-base font-semibold text-fg">{title}</h2>}
              {description && <p className="mt-0.5 text-[13px] text-fg-2">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="ml-4 rounded-default p-1.5 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-border px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}