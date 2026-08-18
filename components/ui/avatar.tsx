import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const dotSizes = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
};

export function Avatar({ name, color = "#7C3AED", size = "md", online, className }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-default font-semibold text-white",
          sizes[size],
        )}
        style={{ backgroundColor: color }}
        role="img"
        aria-label={name}
      >
        {initials(name)}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-canvas",
            dotSizes[size],
            online ? "bg-success" : "bg-border-strong",
          )}
          aria-hidden
        />
      )}
    </div>
  );
}