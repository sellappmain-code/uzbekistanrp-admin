"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Images, UploadCloud, Loader2, Trash2, Copy, Check } from "lucide-react";
import { apiGet, apiDelete, apiUpload, mediaUrl } from "@/lib/api";
import type { UploadedFile } from "@/lib/types";
import { format } from "date-fns";

export default function MediaPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function load() {
    apiGet<UploadedFile[]>("/admin/uploads").then(setFiles).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await apiUpload<UploadedFile>("/admin/uploads", file);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Yuklashda xatolik");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(f: UploadedFile) {
    if (!confirm(`"${f.name}" faylini o'chirishni tasdiqlaysizmi?`)) return;
    try {
      await apiDelete(`/admin/uploads/${f.id}`);
      setFiles((prev) => prev.filter((x) => x.id !== f.id));
    } catch {
      /* ignore */
    }
  }

  async function copyUrl(f: UploadedFile) {
    const url = mediaUrl(f.url);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(f.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* ignore */
    }
  }

  const images = files.filter((f) => f.type.startsWith("image/"));
  const others = files.filter((f) => !f.type.startsWith("image/"));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Media</h1>
          <p className="mt-1 text-sm text-fg-muted">{files.length} ta fayl</p>
        </div>
        <div>
          <input ref={inputRef} type="file" hidden onChange={onUpload} />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {uploading ? "Yuklanmoqda..." : "Fayl yuklash"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-fg-muted">Yuklanmoqda...</p>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-fg-muted">
          <Images className="h-10 w-10" />
          <p className="text-sm">Hali fayllar yo'q</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((f) => (
              <div key={f.id} className="group overflow-hidden rounded-card border border-border bg-surface shadow-sm">
                <div className="relative aspect-video bg-canvas">
                  <Image
                    src={mediaUrl(f.url)}
                    alt={f.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-canvas/70 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => copyUrl(f)}
                      className="rounded-lg bg-surface-3 p-2 text-fg transition-colors hover:text-info"
                      title="URL nusxalash"
                    >
                      {copiedId === f.id ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => remove(f)}
                      className="rounded-lg bg-surface-3 p-2 text-fg transition-colors hover:text-danger"
                      title="O'chirish"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <p className="truncate text-xs text-fg-2" title={f.name}>
                    {f.name}
                  </p>
                  <p className="text-[10px] text-fg-muted">
                    {(f.size / 1024).toFixed(1)} KB · {format(new Date(f.created), "dd.MM HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {others.length > 0 && (
            <div className="rounded-card border border-border bg-surface shadow-sm">
              <div className="border-b border-border px-5 py-3">
                <h2 className="text-sm font-semibold text-fg">Boshqa fayllar</h2>
              </div>
              <div className="divide-y divide-border">
                {others.map((f) => (
                  <div key={f.id} className="flex items-center justify-between px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-fg">{f.name}</p>
                      <p className="text-xs text-fg-muted">
                        {f.type} · {(f.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyUrl(f)}
                        className="rounded-lg border border-border p-2 text-fg-2 transition-colors hover:text-info"
                        title="URL nusxalash"
                      >
                        {copiedId === f.id ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => remove(f)}
                        className="rounded-lg border border-border p-2 text-fg-2 transition-colors hover:text-danger"
                        title="O'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}