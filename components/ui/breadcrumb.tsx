import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[13px] text-fg-muted">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-fg-muted/50" aria-hidden />}
            {item.href && !isLast ? (
              <Link href={item.href} className="transition-colors hover:text-fg">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-fg-2" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}