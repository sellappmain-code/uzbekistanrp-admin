"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BookOpen, Plus, Sparkles, Loader2, X, Send, Trash2 } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import type { WikiArticle } from "@/lib/types";
import { format } from "date-fns";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "maqola";
}

export default function WikiPage() {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Qo'llanma");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  function load() {
    apiGet<WikiArticle[]>("/wiki").then(setArticles).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setTitle("");
    setCategory("Qo'llanma");
    setExcerpt("");
    setContent("");
    setShowForm(false);
  }

  async function create(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPost("/wiki", {
        slug: slugify(title),
        title,
        category,
        excerpt,
        content: content.split("\n").map((l) => l.trim()).filter(Boolean),
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
      const res = await apiPost<{ success: boolean; message: string }>("/ai/action", { action: "wiki", input: {} });
      alert(res.message);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "AI xatolik");
    } finally {
      setAiBusy(false);
    }
  }

  async function remove(a: WikiArticle) {
    if (!confirm(`"${a.title}" maqolasini o'chirishni tasdiqlaysizmi?`)) return;
    await apiDelete(`/wiki/${a.slug}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Wiki</h1>
          <p className="mt-1 text-sm text-fg-muted">Jami {articles.length} ta maqola</p>
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
          <h2 className="mb-4 text-sm font-semibold text-fg">Yangi maqola</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Sarlavha</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Maqola sarlavhasi" className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Kategoriya</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Qisqacha tavsif</label>
              <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required placeholder="Maqola tavsifi" className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Matn (har bir qator — xatboshi)</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={5} className="w-full resize-y rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary" />
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
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-fg-muted">
          <BookOpen className="h-10 w-10" />
          <p className="text-sm">Maqolalar topilmadi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a.id} className="rounded-card border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-fg">{a.title}</h3>
                    <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-fg-2">{a.category}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-sm text-fg-2">{a.excerpt}</p>
                  <p className="mt-1.5 text-xs text-fg-muted">
                    Yangilangan: {format(new Date(a.updatedAt), "dd.MM.yyyy")} · {a.views} ko'rish
                  </p>
                </div>
                <button onClick={() => remove(a)} title="O'chirish" className="shrink-0 rounded-lg border border-border p-2 text-fg-2 transition-colors hover:border-danger/40 hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}