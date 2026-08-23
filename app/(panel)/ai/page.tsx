"use client";

import { useCallback, useEffect, useState } from "react";
import { Bot, Plus, Trash2, RefreshCw, Plug, KeyRound, Check } from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface AiProviderRow {
  id: number;
  name: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
  priority: number;
  timeoutSeconds: number;
  maxTokens: number;
  hasKey: boolean;
  keyMasked?: string;
}

const EMPTY = {
  name: "",
  baseUrl: "",
  apiKey: "",
  model: "",
  enabled: true,
  priority: 10,
  maxTokens: 2000,
  timeoutSeconds: 90,
  systemPrompt: "",
};

export default function AiProvidersPage() {
  const [providers, setProviders] = useState<AiProviderRow[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [testResult, setTestResult] = useState<{ id: number; ok: boolean; reply: string; error: string } | null>(null);

  const load = useCallback(() => {
    apiGet<AiProviderRow[]>("/admin/ai/providers").then(setProviders).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setBusy(true);
    setNotice("");
    try {
      if (editingId) {
        // Tahrirlashda bo'sh maydonlar mavjud qiymatlarni buzmasin
        const payload: Record<string, unknown> = { ...form };
        if (!form.apiKey) delete payload.apiKey;
        if (!form.systemPrompt.trim()) delete payload.systemPrompt;
        await apiPut(`/admin/ai/providers/${editingId}`, payload);
      } else {
        await apiPost("/admin/ai/providers", form);
      }
      setForm({ ...EMPTY });
      setEditingId(null);
      load();
      setNotice("");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Bu provayderni o'chirishni tasdiqlaysizmi? Bu amal qaytarilmaydi.")) {
      return;
    }
    setNotice("");
    try {
      await apiDelete(`/admin/ai/providers/${id}`);
      load();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "O'chirishda xatolik");
    }
  };

  const edit = (p: AiProviderRow) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      baseUrl: p.baseUrl,
      apiKey: "",
      model: p.model,
      enabled: p.enabled,
      priority: p.priority,
      maxTokens: p.maxTokens,
      timeoutSeconds: p.timeoutSeconds,
      systemPrompt: "",
    });
  };

  const test = async (p: AiProviderRow) => {
    setTestResult({ id: p.id, ok: false, reply: "", error: "Tekshirilmoqda..." });
    try {
      const res = await apiPost<{ ok: boolean; reply: string; error: string }>("/admin/ai/providers/test", {
        providerId: p.id,
        baseUrl: p.baseUrl,
        apiKey: "",
        model: p.model,
        maxTokens: 64,
      });
      setTestResult({ id: p.id, ok: res.ok, reply: res.reply, error: res.error });
    } catch (e) {
      setTestResult({ id: p.id, ok: false, reply: "", error: e instanceof Error ? e.message : "Xatolik" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg">AI provayderlar</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Sayt AI yordamchisi va MCP uchun provayder kalitlari. Faqat bitta provayder faol bo‘lishi kerak.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ ...EMPTY });
            setEditingId(null);
          }}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg-2 transition-colors hover:text-fg"
        >
          <Plus className="h-4 w-4" /> Yangi
        </button>
      </div>

      {notice && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{notice}</div>
      )}

      <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <KeyRound className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-fg">{editingId ? `Tahrirlash #${editingId}` : "Yangi provayder"}</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs text-fg-2">Nomi</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="DeepSeek"
              className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs text-fg-2">Base URL</span>
            <input
              value={form.baseUrl}
              onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
              placeholder="https://api.deepseek.com/v1"
              className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs text-fg-2">API kalit</span>
            <input
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              placeholder={editingId ? "Yangi kalit (bo‘sh qoldirilsa saqlanadi)" : "sk-..."}
              type="password"
              className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs text-fg-2">Model</span>
            <input
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="deepseek-chat"
              className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs text-fg-2">Prioritet (kichik = birinchi)</span>
            <input
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value === "" ? 0 : Math.max(1, Number(e.target.value)) })}
              type="number"
              className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-fg focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs text-fg-2">Max tokens</span>
            <input
              value={form.maxTokens}
              onChange={(e) => setForm({ ...form, maxTokens: e.target.value === "" ? 0 : Math.max(64, Number(e.target.value)) })}
              type="number"
              className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-fg focus:border-primary focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              className="h-4 w-4 accent-[#ff9900]"
            />
            Faol (AI shu provayder orqali ishlaydi)
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs text-fg-2">Sistema prompti (ixtiyoriy)</span>
            <textarea
              value={form.systemPrompt}
              onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
              placeholder="AI xatti-harakati bo‘yicha maxsus ko‘rsatma"
            />
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={save}
            disabled={busy || !form.name || !form.baseUrl || !form.model || (!editingId && !form.apiKey)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            <Check className="h-4 w-4" /> {editingId ? "Saqlash" : "Qo‘shish"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm({ ...EMPTY });
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm text-fg-2 transition-colors hover:text-fg"
            >
              Bekor qilish
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {providers.map((p) => (
          <div key={p.id} className="rounded-card border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-fg">{p.name}</p>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    p.enabled ? "border-success/30 bg-success/10 text-success" : "border-border bg-surface-2 text-fg-muted"
                  }`}
                >
                  {p.enabled ? "Faol" : "O‘chiq"}
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => edit(p)} title="Tahrirlash" className="rounded-lg border border-border p-2 text-fg-2 hover:text-fg">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => remove(p.id)} title="O‘chirish" className="rounded-lg border border-border p-2 text-fg-2 hover:text-danger">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-2 break-all font-mono text-xs text-fg-muted">{p.baseUrl}</p>
            <p className="mt-1 text-xs text-fg-2">
              {p.model} · prio {p.priority} · {p.hasKey ? (p.keyMasked ?? "kalit bor") : "kalit yo‘q"}
            </p>
            <button
              onClick={() => test(p)}
              className="mt-3 flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-fg-2 transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plug className="h-3.5 w-3.5" /> Ulanishni tekshirish
            </button>
            {testResult?.id === p.id && (
              <p className={`mt-2 text-xs ${testResult.ok ? "text-success" : "text-warning"}`}>
                {testResult.ok ? `OK: ${testResult.reply}` : testResult.error}
              </p>
            )}
          </div>
        ))}
      </div>

      <section className="rounded-card border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <Plug className="h-4 w-4 text-info" />
          <h2 className="text-sm font-semibold text-fg">Qo‘llanma: kalitlarni qayerdan olish</h2>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-fg-2">
          <li>• OpenAI: platform.openai.com — gpt-4o-mini / gpt-4o</li>
          <li>• DeepSeek: platform.deepseek.com — deepseek-chat (juda arzon)</li>
          <li>• Groq: console.groq.com — llama-3.3-70b-versatile (bepul limit)</li>
          <li>• OpenRouter: openrouter.ai — har qanday model</li>
          <li>• Ollama (mahalliy): http://localhost:11434/v1 — model nomi: llama3.1</li>
          <li>• Har qanday OpenAI-compatible API ishlaydi</li>
        </ul>
      </section>
    </div>
  );
}