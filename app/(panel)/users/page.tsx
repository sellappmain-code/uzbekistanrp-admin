"use client";

import { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { apiGet, apiPatch } from "@/lib/api";
import type { UserDto } from "@/lib/types";
import { format } from "date-fns";

const ROLES = ["PLAYER", "MODERATOR", "EDITOR", "ADMIN", "SUPER_ADMIN"];

const ROLE_BADGE: Record<string, string> = {
  SUPER_ADMIN: "bg-danger/15 text-danger border-danger/30",
  ADMIN: "bg-warning/15 text-warning border-warning/30",
  MODERATOR: "bg-info/15 text-info border-info/30",
  EDITOR: "bg-primary/15 text-primary border-primary/30",
  PLAYER: "bg-border/40 text-fg-2 border-border",
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setUsers(await apiGet<UserDto[]>("/admin/users"));
      } catch {
        /* ignore */
      }
      try {
        setRoles((await apiGet<{ roles: string[] }>("/admin/roles")).roles);
      } catch {
        /* ignore */
      }
      setLoading(false);
    })();
  }, []);

  async function changeRole(user: UserDto, role: string) {
    setSavingId(user.id);
    try {
      const updated = await apiPatch<UserDto>(`/admin/users/${user.id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    } catch {
      /* ignore */
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Foydalanuvchilar</h1>
        <p className="mt-1 text-sm text-fg-muted">Jami {users.length} ta akkaunt</p>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-fg-muted">Yuklanmoqda...</p>
      ) : (
        <div className="overflow-hidden rounded-card border border-border bg-surface shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-fg-muted">
                <th className="px-5 py-3 font-medium">Foydalanuvchi</th>
                <th className="px-5 py-3 font-medium">Daraja</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 font-medium">Tasdiqlangan</th>
                <th className="px-5 py-3 font-medium">Ro'yxatdan o'tgan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-surface-2">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-fg"
                        style={{ backgroundColor: u.avatarColor }}
                      >
                        {u.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-fg">{u.username}</p>
                        <p className="truncate text-xs text-fg-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-fg-2">
                      Lv {u.level} · {u.xp.toLocaleString()} XP
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u, e.target.value)}
                        disabled={savingId === u.id}
                        className={`rounded-lg border bg-canvas px-2 py-1 text-xs font-medium outline-none focus:border-primary disabled:opacity-50 ${
                          (ROLE_BADGE[u.role] ?? ROLE_BADGE.PLAYER).split(" ").slice(0, 2).join(" ")
                        }`}
                      >
                        {(roles.length ? roles : ROLES).map((r) => (
                          <option key={r} value={r} className="bg-surface text-fg">
                            {r}
                          </option>
                        ))}
                      </select>
                      {savingId === u.id && <Loader2 className="h-3.5 w-3.5 animate-spin text-fg-muted" />}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {u.verified ? (
                      <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                        Ha
                      </span>
                    ) : (
                      <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">
                        Yo'q
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-fg-muted">
                    {format(new Date(u.joinedAt), "dd.MM.yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-fg-muted">
        <Users className="h-4 w-4" />
        Rol o'zgarishi darhol kuchga kiradi
      </div>
    </div>
  );
}