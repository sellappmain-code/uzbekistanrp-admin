"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquareWarning, Inbox } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Complaint } from "@/lib/types";
import { format } from "date-fns";

const STATUS_FILTERS = ["All", "Pending", "Under Review", "Approved", "Rejected", "Closed"];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Complaint[]>("/complaints")
      .then(setComplaints)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Shikoyatlar</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {complaints.filter((c) => c.status !== "Closed").length} ta ochiq · jami {complaints.length} ta
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === s
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-surface text-fg-2 hover:text-fg"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-fg-muted">Yuklanmoqda...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-fg-muted">
          <Inbox className="h-10 w-10" />
          <p className="text-sm">Shikoyatlar topilmadi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/complaints/${c.id}`}
              className="block rounded-card border border-border bg-surface p-5 shadow-sm transition-colors hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-fg">{c.target}</h3>
                    <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-fg-2">
                      {c.type}
                    </span>
                    <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-fg-2">
                      {c.category}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-fg-2">{c.description}</p>
                  <p className="mt-2 text-xs text-fg-muted">
                    {c.author} · {format(new Date(c.date), "dd.MM.yyyy HH:mm")}
                    {c.assignedTo ? ` · ${c.assignedTo}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      c.status === "Pending"
                        ? "border-warning/30 bg-warning/10 text-warning"
                        : c.status === "Closed"
                          ? "border-border bg-border/40 text-fg-muted"
                          : "border-info/30 bg-info/10 text-info"
                    }`}
                  >
                    {c.status}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-fg-muted">
                    <span className="flex items-center gap-1">
                      <MessageSquareWarning className="h-3.5 w-3.5" />
                      {c.messages.length}
                    </span>
                    <span
                      className={`font-medium ${
                        c.priority === "High" ? "text-danger" : c.priority === "Medium" ? "text-warning" : "text-fg-2"
                      }`}
                    >
                      {c.priority}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}