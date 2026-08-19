# Admin Panel — Uzbekistan RP Web Platform

## Umumiy ma'lumot

**Texnologiya:** Next.js 16.3.1 + TypeScript + Tailwind CSS v4

**Port:** 3001 (lokal), serverda 3001

**GitHub:** https://github.com/sellappmain-code/uzbekistanrp_web/tree/main/admin-panel

---

## Struktura

```
admin-panel/
├── app/
│   ├── login/                    # Admin kirish sahifasi
│   └── (panel)/                 # Admin panel asosiy qismi
│       ├── ai/                 # AI chat boshqaruv (model tanlash, etc.)
│       ├── complaints/          # Shikoyatlar boshqaruv
│       │   └── [id]/           # Shikoyat tafsilotlari
│       ├── events/             # Tadbirlar boshqaruv
│       ├── media/             # Media fayllar
│       ├── news/             # Yangiliklar CMS
│       ├── settings/        # Sozlamalar
│       ├── users/          # Foydalanuvchilar boshqaruv
│       └── wiki/          # Wiki boshqaruv
├── components/
│   └── ui/                  # UI kit (Button, Card, Input, Modal, etc.)
├── lib/
│   ├── api.ts              # API client (GET, POST, PATCH, DELETE, Upload)
│   ├── types.ts            # TypeScript tiplari
│   └── utils.ts           # Utility funksiyalar
└── package.json
```

---

## Sahifalar

| Route | Sahifa |
|-------|--------|
| `/login` | Admin kirish |
| `/` | Dashboard (redirect to /complaints) |
| `/ai` | AI chat boshqaruv |
| `/complaints` | Shikoyatlar ro'yxati |
| `/complaints/[id]` | Shikoyat tafsilotlari |
| `/events` | Tadbirlar |
| `/media` | Media fayllar |
| `/news` | Yangiliklar CMS |
| `/settings` | Sozlamalar |
| `/users` | Foydalanuvchilar |
| `/wiki` | Wiki boshqaruv |

---

## API Connection

Admin panel `lib/api.ts` orqali backend'ning `/api/v1/admin/**` endpoint'laridan foydalanadi.

```typescript
import { apiGet, apiPost, apiPatch, apiDelete, apiUpload } from "@/lib/api";

// GET
const users = await apiGet<User[]>("/admin/users");

// POST
await apiPost("/admin/news", { title: "...", content: "..." });

// PATCH
await apiPatch("/admin/complaints/123", { status: "Resolved" });

// DELETE
await apiDelete("/admin/users/456");

// File upload
const result = await apiUpload("/admin/media/upload", file);
```

**Base URL:** `NEXT_PUBLIC_API_URL` env variable yoki default `http://localhost:8080/api/v1`

**Auth:** Token `localStorage` da `admin_token` kaliti ostida saqlanadi. Har bir so'rov `Authorization: Bearer <token>` header'ida yuboriladi.

---

## Environment

```bash
# .env.local (admin-panel papkasida)
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1  # lokalda
NEXT_PUBLIC_API_URL=http://169.58.38.68:4000/api/v1  # serverda
```

---

## Auth Flow

1. `/login` sahifasida username/password yuboriladi
2. Backend `/api/v1/auth/login` dan token oladi
3. Token `localStorage` da `admin_token` ga saqlanadi
4. Har bir API so'rovda token yuboriladi
5. 401 xatosida (`auth:expired` event) — foydalanuvchi login sahifasiga yo'naltiriladi

---

## Build va Run

### Development

```bash
cd admin-panel
npm install
npm run dev
# http://localhost:3001 da ishlaydi
```

### Production build

```bash
cd admin-panel
npm run build
npm start
# yoki pm2 bilan
pm2 start npm --name "uzbekistanrp-admin" -- start
```

### Docker bilan

```bash
docker build -t uzbekistanrp-admin .
docker run -d -p 3001:3000 --name uzbekistanrp-admin uzbekistanrp-admin
```

---

## Qoidalar

1. **API URL** — `.env.local` da `NEXT_PUBLIC_API_URL` to'g'ri ekanligiga ishonch hosil qiling
2. **Auth** — Admin panel faqat `ROLE_ADMIN` yoki `ROLE_SUPER_ADMIN` user'lar uchun
3. **Tailwind v4** — `postcss.config.mjs` orqali sozlanadi
4. **Lucide Icons** — Icon uchun `lucide-react` ishlatiladi
5. **Separate from frontend** — Admin panel alohida Next.js loyiha, o'z portida ishlaydi

---

## Lint va Typecheck

```bash
npm run lint    # ESLint
npm run build   # TypeScript + Next.js build
```
