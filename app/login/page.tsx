"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2 } from "lucide-react";
import { apiPost, saveSession, type AdminUser } from "@/lib/api";

interface LoginResponse {
  token: string;
  user: AdminUser;
}

const STAFF_ROLES = ["MODERATOR", "EDITOR", "ADMIN", "SUPER_ADMIN"];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiPost<LoginResponse>("/auth/login", {
        usernameOrEmail: username,
        password,
      });
      if (!STAFF_ROLES.includes(res.user?.role)) {
        setError("Bu akkauntga admin panelga kirish huquqi yo'q");
        setLoading(false);
        return;
      }
      saveSession(res.token, res.user);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirishda xatolik yuz berdi");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm animate-slide-in-up">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-fg shadow-md">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-fg">Uzbekistan RP</h1>
            <p className="text-sm text-fg-muted">Admin paneliga kirish</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-card border border-border bg-surface p-6 shadow-md"
        >
          <label className="mb-1.5 block text-sm font-medium text-fg-2">Login</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
            placeholder="username"
            className="mb-4 w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-primary"
          />

          <label className="mb-1.5 block text-sm font-medium text-fg-2">Parol</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="mb-4 w-full rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-primary"
          />

          {error && (
            <p className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Kutilmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-fg-muted">
          <Link href={process.env.NEXT_PUBLIC_SITE_URL || "https://uzbekistanrp.uz"} className="underline decoration-border-strong underline-offset-2 hover:text-fg-2">
            Ommaviy saytga qaytish
          </Link>
        </p>
      </div>
    </div>
  );
}