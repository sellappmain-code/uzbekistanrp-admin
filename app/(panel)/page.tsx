"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  CircleDot,
  Shield,
  Store,
  CalendarDays,
  Wallet,
  MessageSquareWarning,
  Newspaper,
  ArrowRight,
  Server,
} from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Stats, Complaint, NewsPost } from "@/lib/types";
import { format } from "date-fns";

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-fg">{value}</p>
          <p className="text-xs text-fg-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);

  useEffect(() => {
    apiGet<Stats>("/servers/stats")
      .then(setStats)
      .catch(() => {});
    apiGet<Complaint[]>("/complaints")
      .then(setComplaints)
      .catch(() => {});
    apiGet<NewsPost[]>("/news")
      .then(setNews)
      .catch(() => {});
  }, []);

  const openComplaints = complaints.filter((c) => c.status !== "Closed").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Boshqaruv paneli</h1>
        <p className="mt-1 text-sm text-fg-muted">Platforma holati va so'nggi faoliyat</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={CircleDot} label="Online o'yinchilar" value={String(stats?.onlinePlayers ?? 0)} accent="bg-success/15 text-success" />
        <StatCard icon={Users} label="Ro'yxatdan o'tgan" value={String(stats?.registeredUsers ?? 0)} accent="bg-info/15 text-info" />
        <StatCard icon={Shield} label="Faol fraktsiyalar" value={String(stats?.activeFactions ?? 0)} accent="bg-primary/15 text-primary" />
        <StatCard icon={Store} label="Bizneslar" value={String(stats?.businesses ?? 0)} accent="bg-warning/15 text-warning" />
        <StatCard icon={CalendarDays} label="Bu oydagi tadbirlar" value={String(stats?.eventsThisMonth ?? 0)} accent="bg-warning/15 text-warning" />
        <StatCard icon={Wallet} label="Byudjet" value={stats?.totalRevenue ?? "0"} accent="bg-success/15 text-success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-card border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <MessageSquareWarning className="h-4 w-4 text-warning" />
              <h2 className="text-sm font-semibold text-fg">So'nggi shikoyatlar</h2>
            </div>
            <Link href="/complaints" className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover">
              Barchasi <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {complaints.length === 0 && (
              <p className="px-5 py-6 text-sm text-fg-muted">Shikoyatlar topilmadi</p>
            )}
            {complaints.slice(0, 5).map((c) => (
              <Link key={c.id} href={`/complaints/${c.id}`} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-surface-2">
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">
                    <span className="font-medium">{c.target}</span>
                    <span className="text-fg-muted"> — {c.type}</span>
                  </p>
                  <p className="text-xs text-fg-muted">
                    {c.author} · {format(new Date(c.date), "dd.MM HH:mm")}
                  </p>
                </div>
                <span
                  className={`ml-3 shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                    c.status === "Pending"
                      ? "border-warning/30 bg-warning/10 text-warning"
                      : c.status === "Closed"
                        ? "border-border bg-border/40 text-fg-muted"
                        : "border-info/30 bg-info/10 text-info"
                  }`}
                >
                  {c.status}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-card border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-fg">So'nggi yangiliklar</h2>
            </div>
            <Link href="/news" className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover">
              Boshqarish <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {news.length === 0 && (
              <p className="px-5 py-6 text-sm text-fg-muted">Yangiliklar topilmadi</p>
            )}
            {news.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{n.title}</p>
                  <p className="text-xs text-fg-muted">
                    {n.category} · {format(new Date(n.date), "dd.MM HH:mm")}
                  </p>
                </div>
                <span
                  className={`ml-3 shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                    n.status === "Published"
                      ? "border-success/30 bg-success/10 text-success"
                      : "border-warning/30 bg-warning/10 text-warning"
                  }`}
                >
                  {n.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-card border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Server className="h-5 w-5 text-info" />
          <div>
            <p className="text-sm font-medium text-fg">Serverlar</p>
            <p className="text-xs text-fg-muted">
              {openComplaints} ta ochiq shikoyat · 24/7 monitoring
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}