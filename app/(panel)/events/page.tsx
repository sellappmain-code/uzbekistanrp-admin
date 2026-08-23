"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Plus, Sparkles, Loader2, X, Send, Trash2 } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import type { GameEvent } from "@/lib/types";
import { format } from "date-fns";

export default function EventsPage() {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [location, setLocation] = useState("Los-Santos markazi");
  const [reward, setReward] = useState("");
  const [organizer, setOrganizer] = useState("Administratsiya");
  const [maxParticipants, setMaxParticipants] = useState("50");
  const [description, setDescription] = useState("");

  function load() {
    apiGet<GameEvent[]>("/events").then(setEvents).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setTitle("");
    setDate("");
    setTime("18:00");
    setLocation("Los-Santos markazi");
    setReward("");
    setOrganizer("Administratsiya");
    setMaxParticipants("50");
    setDescription("");
    setShowForm(false);
  }

  async function create(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPost("/events", {
        title,
        date,
        time,
        location,
        reward,
        organizer,
        maxParticipants: Number(maxParticipants),
        description,
      });
      resetForm();
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  }

  async function generate() {
    setAiBusy(true);
    try {
      const res = await apiPost<{ success: boolean; message: string }>("/ai/action", {
        action: "event",
        input: { time, location, reward, organizer },
      });
      alert(res.message);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "AI xatolik");
    } finally {
      setAiBusy(false);
    }
  }

  async function remove(ev: GameEvent) {
    if (!confirm(`"${ev.title}" tadbirini o'chirishni tasdiqlaysizmi?`)) return;
    try {
      await apiDelete(`/events/${ev.slug}`);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "O'chirishda xatolik");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Tadbirlar</h1>
          <p className="mt-1 text-sm text-fg-muted">Jami {events.length} ta tadbir</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generate}
            disabled={aiBusy}
            className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
          >
            {aiBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            AI yaratish
          </button>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-fg transition-colors hover:bg-primary-hover"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Berkitish" : "Yangi"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={create} className="animate-slide-in-up rounded-card border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-fg">Yangi tadbir</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Nomi</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Tadbir nomi" className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Sana</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Vaqt</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Manzil</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Mukofot</label>
              <input value={reward} onChange={(e) => setReward(e.target.value)} required placeholder="500 000 so'm" className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Tashkilotchi</label>
              <input value={organizer} onChange={(e) => setOrganizer(e.target.value)} required className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Maks ishtirokchi</label>
              <input type="number" min={1} value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} required className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Tavsif</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full resize-y rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={resetForm} className="rounded-lg border border-border px-4 py-2 text-sm text-fg-2 transition-colors hover:bg-surface-2">
              Bekor qilish
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-primary-hover disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Saqlash
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-fg-muted">Yuklanmoqda...</p>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-fg-muted">
          <CalendarDays className="h-10 w-10" />
          <p className="text-sm">Tadbirlar topilmadi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="rounded-card border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-fg">{ev.title}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      ev.status === "Upcoming"
                        ? "border-info/30 bg-info/10 text-info"
                        : ev.status === "Ongoing"
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-border bg-border/40 text-fg-muted"
                    }`}>
                      {ev.status}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-sm text-fg-2">{ev.description}</p>
                  <p className="mt-1.5 text-xs text-fg-muted">
                    {format(new Date(ev.date), "dd.MM.yyyy")} · {ev.time} · {ev.location} · {ev.organizer} ·{" "}
                    {ev.participants}/{ev.maxParticipants} ishtirokchi · {ev.reward}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => remove(ev)} title="O'chirish" className="rounded-lg border border-border p-2 text-fg-2 transition-colors hover:border-danger/40 hover:text-danger">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}