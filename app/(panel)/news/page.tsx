"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Newspaper,
  Plus,
  Sparkles,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Send,
} from "lucide-react";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import type { NewsPost } from "@/lib/types";
import { NEWS_CATEGORIES } from "@/lib/types";
import { format } from "date-fns";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "post";
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [aiBusy, setAiBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(NEWS_CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  function load() {
    apiGet<NewsPost[]>("/news").then(setPosts).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setTitle("");
    setCategory(NEWS_CATEGORIES[0]);
    setExcerpt("");
    setContent("");
    setTags("");
    setShowForm(false);
  }

  async function create(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPost("/news", {
        slug: slugify(title),
        title,
        category,
        excerpt,
        content: content.split("\n").map((l) => l.trim()).filter(Boolean),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        featured: false,
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
      const res = await apiPost<{ success: boolean; message: string; data?: Record<string, unknown> }>(
        "/ai/action",
        { action: "news", input: {} }
      );
      alert(res.message);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "AI xatolik");
    } finally {
      setAiBusy(false);
    }
  }

  async function toggleStatus(post: NewsPost) {
    const next = post.status.toLowerCase() === "published" ? "draft" : "published";
    setError("");
    try {
      await apiPatch(`/news/${post.slug}/status`, { status: next });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Statusni o'zgartirishda xatolik");
    }
  }

  async function remove(post: NewsPost) {
    if (!confirm(`"${post.title}" yangiligini o'chirishni tasdiqlaysizmi?`)) return;
    setError("");
    try {
      await apiDelete(`/news/${post.slug}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "O'chirishda xatolik");
    }
  }

  const filtered = filter === "All" ? posts : posts.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-card border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Yangiliklar</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {posts.filter((p) => p.status === "published").length} ta chop etilgan · jami {posts.length} ta
          </p>
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
        <form
          onSubmit={create}
          className="animate-slide-in-up rounded-card border border-border bg-surface p-6 shadow-sm"
        >
          <h2 className="mb-4 text-sm font-semibold text-fg">Yangi yangilik</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Sarlavha</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Yangilik sarlavhasi"
                className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Kategoriya</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary"
              >
                {NEWS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Teglar (vergul bilan)</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Server, Update"
                className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Qisqacha tavsif</label>
              <input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                placeholder="1-2 jumlalik tavsif"
                className="w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-fg-2">Matn (har bir qator — xatboshi)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={5}
                placeholder={"Birinchi qator\nIkkinchi qator\n..."}
                className="w-full resize-y rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-border px-4 py-2 text-sm text-fg-2 transition-colors hover:bg-surface-2"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Saqlash
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {["All", "published", "draft"].map((s) => (
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
          <Newspaper className="h-10 w-10" />
          <p className="text-sm">Yangiliklar topilmadi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-card border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-fg">{p.title}</h3>
                    {p.featured && (
                      <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-sm text-fg-2">{p.excerpt}</p>
                  <p className="mt-1.5 text-xs text-fg-muted">
                    {p.category} · {p.author} · {format(new Date(p.date), "dd.MM.yyyy HH:mm")} ·{" "}
                    {p.readingMinutes} daq · {p.views} ko'rish
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      p.status === "published"
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-warning/30 bg-warning/10 text-warning"
                    }`}
                  >
                    {p.status}
                  </span>
                  <button
                    onClick={() => toggleStatus(p)}
                    title={p.status === "published" ? "Chop etishni to'xtatish" : "Chop etish"}
                    className="rounded-lg border border-border p-2 text-fg-2 transition-colors hover:border-info/40 hover:text-info"
                  >
                    {p.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => remove(p)}
                    title="O'chirish"
                    className="rounded-lg border border-border p-2 text-fg-2 transition-colors hover:border-danger/40 hover:text-danger"
                  >
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