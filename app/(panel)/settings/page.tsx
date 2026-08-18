"use client";

import { useCallback, useEffect, useState } from "react";
import { Server, Bot, Database, ShieldCheck, LogOut, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiGet, clearSession, API_BASE } from "@/lib/api";

interface ServerInfo {
  id: number;
  name: string;
  status: string;
  players: number;
  maxPlayers: number;
  uptime: string;
  version: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState<{ name: string; available: boolean } | null>(null);
  const [servers, setServers] = useState<ServerInfo[]>([]);

  const load = useCallback(() => {
    apiGet<{ name: string; available: boolean }>("/ai/provider").then(setProvider).catch(() => {});
    apiGet<ServerInfo[]>("/servers").then(setServers).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Sozlamalar</h1>
        <p className="mt-1 text-sm text-fg-muted">Tizim holati va ulanish ma'lumotlari</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Database className="h-4 w-4 text-info" />
            <h2 className="text-sm font-semibold text-fg">Backend ulanish</h2>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-fg-2">API manzili</dt>
              <dd className="font-mono text-xs text-fg">{API_BASE}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-fg-2">Auth</dt>
              <dd className="text-fg">JWT Bearer</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-fg-2">Holat</dt>
              <dd className="flex items-center gap-1.5 text-success">
                <span className="h-2 w-2 rounded-full bg-success" />
                Onlayn
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Bot className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-fg">AI provayder</h2>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-fg-2">Provayder</dt>
              <dd className="font-medium text-fg">{provider?.name ?? "..."}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-fg-2">Mavjudlik</dt>
              <dd>
                {provider?.available ? (
                  <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                    Faol
                  </span>
                ) : (
                  <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">
                    Noaniq
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-card border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-success" />
              <h2 className="text-sm font-semibold text-fg">Serverlar</h2>
            </div>
            <button onClick={load} title="Yangilash" className="rounded-lg border border-border p-2 text-fg-2 transition-colors hover:text-fg">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {servers.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-canvas px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-fg">{s.name}</p>
                  <p className="text-xs text-fg-muted">
                    v{s.version} · Uptime {s.uptime}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-fg-2">
                    {s.players}/{s.maxPlayers}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      s.status === "Online"
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-warning/30 bg-warning/10 text-warning"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="flex items-center justify-between rounded-card border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-fg">Sessiya</p>
            <p className="text-xs text-fg-muted">Tizimdan chiqish va token tozalash</p>
          </div>
        </div>
        <button
          onClick={() => {
            clearSession();
            router.replace("/login");
          }}
          className="flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/20"
        >
          <LogOut className="h-4 w-4" />
          Chiqish
        </button>
      </section>
    </div>
  );
}