"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-default bg-surface-2 border border-border text-fg placeholder:text-fg-muted text-sm px-3.5 transition-colors duration-150 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-fg-2">
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={cn(fieldBase, "h-10", error && "border-danger/60 focus:border-danger focus:ring-danger/30")} {...props} />
        {error ? (
          <p className="text-xs text-danger">{error}</p>
        ) : hint ? (
          <p className="text-xs text-fg-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-fg-2">
            {label}
          </label>
        )}
        <textarea ref={ref} id={inputId} className={cn(fieldBase, "min-h-[100px] py-2.5", error && "border-danger/60 focus:border-danger focus:ring-danger/30")} {...props} />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-fg-2">
            {label}
          </label>
        )}
        <select ref={ref} id={inputId} className={cn(fieldBase, "h-10 appearance-none bg-surface-2 [&>option]:bg-surface-2 [&>option]:text-fg")} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);
Select.displayName = "Select";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label htmlFor={inputId} className={cn("flex items-center gap-2.5 cursor-pointer select-none", className)}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="h-4 w-4 rounded-sm border-border bg-surface-2 accent-primary"
          {...props}
        />
        {label && <span className="text-sm text-fg-2">{label}</span>}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label htmlFor={inputId} className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none", className)}>
        <span className="relative inline-flex">
          <input ref={ref} id={inputId} type="checkbox" className="peer sr-only" {...props} />
          <span className="h-5 w-9 rounded-pill bg-border-strong transition-colors duration-150 peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:duration-150 peer-checked:after:translate-x-4" />
        </span>
        {label && <span className="text-sm text-fg-2">{label}</span>}
      </label>
    );
  },
);
Switch.displayName = "Switch";