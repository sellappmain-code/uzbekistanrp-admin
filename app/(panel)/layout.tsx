"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Newspaper,
  Images,
  Users,
  CalendarDays,
  BookOpen,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { getToken, getUser, clearSession, type AdminUser } from "@/lib/api";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/complaints", label: "Shikoyatlar", icon: MessageSquareWarning },
  { href: "/news", label: "Yangiliklar", icon: Newspaper },
  { href: "/media", label: "Media", icon: Images },
  { href: "/users", label: "Foydalanuvchilar", icon: Users },
  { href: "/events", label: "Tadbirlar", icon: CalendarDays },
  { href: "/wiki", label: "Wiki", icon: BookOpen },
  { href: "/settings", label: "Sozlamalar", icon: Settings },
];

const ROLE_BADGE: Record<string, string> = {
  SUPER_ADMIN: "bg-danger/15 text-danger border-danger/30",
  ADMIN: "bg-warning/15 text-warning border-warning/30",
  MODERATOR: "bg-info/15 text-info border-info/30",
  EDITOR: "bg-primary/15 text-primary border-primary/30",
  USER: "bg-border/40 text-fg-2 border-border",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    Promise.resolve().then(() => {
      setUser(getUser());
      setReady(true);
    });
  }, [router]);

  useEffect(() => {
    const onExpired = () => router.replace("/login");
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <ShieldCheck className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  const roleClass = ROLE_BADGE[user?.role ?? "USER"] ?? ROLE_BADGE.USER;

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-fg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-fg">Uzbekistan RP</p>
            <p className="text-xs text-fg-muted">Admin panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-fg-2 hover:bg-surface-2 hover:text-fg"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-fg"
              style={{ backgroundColor: user?.avatarColor ?? "#7c3aed" }}
            >
              {(user?.username ?? "?").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">{user?.username}</p>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${roleClass}`}
              >
                {user?.role}
              </span>
            </div>
            <button
              onClick={() => {
                clearSession();
                router.replace("/login");
              }}
              className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-danger"
              aria-label="Chiqish"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}