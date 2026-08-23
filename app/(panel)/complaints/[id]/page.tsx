"use client";

import { use, useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Loader2,
  Paperclip,
  Bot,
  User,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type { Complaint } from "@/lib/types";
import { COMPLAINT_STATUSES } from "@/lib/types";
import { format } from "date-fns";

export default function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    apiGet<Complaint>(`/complaints/${id}`)
      .then(setComplaint)
      .catch((err) => setError(err instanceof Error ? err.message : "Shikoyatni yuklashda xatolik"));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function sendReply(e: FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    setError("");
    try {
      await apiPost(`/complaints/${id}/messages`, { content: reply.trim() });
      setReply("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xabar yuborishda xatolik. Javob saqlanmadi.");
    } finally {
      setSending(false);
    }
  }

  async function aiReply() {
    setAiBusy(true);
    try {
      const res = await apiPost<{ success: boolean; preview?: string; message: string }>(
        "/ai/action",
        { action: "reply-complaint", input: { complaintId: String(id) } }
      );
      if (res.success) load();
      else alert(res.message);
    } catch {
      alert("AI javob olishda xatolik");
    } finally {
      setAiBusy(false);
    }
  }

  async function changeStatus(status: string) {
    setError("");
    try {
      await apiPatch(`/complaints/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Statusni o'zgartirishda xatolik");
      load();
    }
  }

  if (!complaint) {
    return <p className="py-10 text-center text-sm text-fg-muted">Yuklanmoqda...</p>;
  }

  const messages = [...(complaint.messages ?? [])].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-card border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {error}
        </div>
      )}
      <Link
        href="/complaints"
        className="inline-flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        Shikoyatlar
      </Link>

      <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-fg">{complaint.target}</h1>
              <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-fg-2">
                #{complaint.id} · {complaint.type}
              </span>
            </div>
            <p className="mt-2 text-sm text-fg-2">{complaint.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
              <span>Muallif: {complaint.author}</span>
              <span>Server: {complaint.server}</span>
              <span>Kategoriya: {complaint.category}</span>
              <span>{format(new Date(complaint.date), "dd.MM.yyyy HH:mm")}</span>
            </div>
            {complaint.evidence?.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-fg-2">
                <Paperclip className="h-3.5 w-3.5" />
                {complaint.evidence.map((e, i) => (
                  <span key={i} className="rounded-md border border-border bg-surface-2 px-2 py-0.5">
                    {e}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                complaint.priority === "High"
                  ? "border-danger/30 bg-danger/10 text-danger"
                  : complaint.priority === "Medium"
                    ? "border-warning/30 bg-warning/10 text-warning"
                    : "border-border bg-border/40 text-fg-2"
              }`}
            >
              {complaint.priority} ustuvorlik
            </span>
            <select
              value={complaint.status}
              onChange={(e) => changeStatus(e.target.value)}
              className="rounded-lg border border-border bg-canvas px-3 py-1.5 text-xs text-fg outline-none focus:border-primary"
            >
              {COMPLAINT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-fg">
            Muloqot ({messages.length})
          </h2>
          <button
            onClick={aiReply}
            disabled={aiBusy}
            className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
          >
            {aiBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            AI javob yozish
          </button>
        </div>

        <div className="space-y-3 px-5 py-4">
          {messages.length === 0 && (
            <p className="py-4 text-center text-sm text-fg-muted">
              Hozircha xabarlar yo'q
            </p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.authorRole === "author" ? "" : "flex-row-reverse"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  m.authorRole === "ai"
                    ? "bg-primary/20 text-primary"
                    : m.authorRole === "admin"
                      ? "bg-info/15 text-info"
                      : "bg-surface-3 text-fg-2"
                }`}
              >
                {m.authorRole === "ai" ? (
                  <Bot className="h-4 w-4" />
                ) : m.authorRole === "admin" ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-lg border px-4 py-2.5 ${
                  m.authorRole === "author"
                    ? "border-border bg-surface-2"
                    : m.authorRole === "ai"
                      ? "border-primary/30 bg-primary/10"
                      : "border-info/20 bg-info/5"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-medium text-fg">{m.author}</span>
                  <span className="text-[10px] text-fg-muted">
                    {format(new Date(m.date), "dd.MM HH:mm")}
                  </span>
                  {m.authorRole === "ai" && (
                    <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                      <Sparkles className="h-2.5 w-2.5" /> AI
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm text-fg-2">{m.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={sendReply} className="flex gap-2 border-t border-border p-4">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Javob yozing..."
            className="flex-1 rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-primary"
          />
          <button
            type="submit"
            disabled={sending || !reply.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Yuborish
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <span className="text-xs text-fg-muted">
          AI javob taklifi{" "}
          {complaint.aiReply ? "mavjud — muloqotda AI xabari ko'rinadi" : "hali yaratilmagan"}
        </span>
      </div>
    </div>
  );
}