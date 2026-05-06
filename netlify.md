# Netlify Deployment Guide

This project is a **portfolio app** with two parts:
- **Frontend** — React + Vite (static site), deployed to Netlify CDN
- **API** — Express.js server, compiled into a single Netlify Serverless Function

File uploads are stored in **Supabase Storage**. Metadata is stored in **Supabase PostgreSQL**.

---

## Repository Structure

```
/
├── artifacts/
│   ├── portfolio/          # React + Vite frontend
│   │   └── src/lib/api.ts  # API client (calls /api/* which Netlify proxies)
│   └── api-server/         # Express.js backend
│       └── src/
│           ├── app.ts      # Express app
│           ├── routes/     # auth.ts, files.ts
│           └── lib/        # db.ts (pg), storage.ts (Supabase), auth.ts (JWT)
├── netlify/
│   ├── function-src/api.ts # Serverless function entry point (source)
│   ├── build-function.mjs  # esbuild script → bundles to netlify/functions/api.mjs
│   └── functions/          # Build output (auto-generated, do not edit)
├── netlify.toml            # Netlify build + routing config
└── netlify.md              # This file
```

---

## Build Process

The build command in `netlify.toml` runs three steps in order:

```
pnpm install && pnpm --filter @workspace/portfolio run build && node netlify/build-function.mjs
```

1. **`pnpm install`** — installs all dependencies (monorepo with pnpm workspaces)
2. **`pnpm --filter @workspace/portfolio run build`** — builds the React frontend → outputs to `artifacts/portfolio/dist/public`
3. **`node netlify/build-function.mjs`** — uses esbuild to bundle the Express app into a single ESM file → outputs to `netlify/functions/api.mjs`

**Publish directory:** `artifacts/portfolio/dist/public`
**Functions directory:** `netlify/functions`

---

## How Routing Works

All routing is defined in `netlify.toml`:

| Request        | Handled by                         |
|----------------|------------------------------------|
| `/api/*`       | Netlify Function (`api.mjs`)       |
| `/*` (all else)| `index.html` (React SPA fallback)  |

The Netlify Function uses `serverless-http` to wrap the Express app. It prepends `/api` back to the path (since Netlify strips it before calling the function) so Express routes match correctly.

---

## Required Environment Variables

Set all of these in **Netlify → Site Settings → Environment Variables**:

| Variable | Description | Where to get it |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Supabase → Settings → Database → **Transaction Pooler** URI (port **6543**) |
| `SUPABASE_URL` | Supabase project URL | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Supabase → Settings → API → `service_role` key |
| `ADMIN_USERNAME` | Admin login username | Set to your chosen username |
| `ADMIN_PASSWORD` | Admin login password | Set to your chosen password |
| `SESSION_SECRET` | Secret for signing JWT tokens | Generate with: `openssl rand -hex 64` |

> **Important:** Use the **Transaction Pooler** connection string from Supabase (port 6543, not 5432). Netlify Functions are serverless — they can't maintain persistent DB connections, so the pooler is required.

---

## Supabase Setup (One-Time)

### 1. Create the database table

Run this SQL in **Supabase → SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS portfolio_files (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'other',
  featured BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Create the storage bucket

- Go to **Supabase → Storage → New Bucket**
- Name: `portfolio-files`
- Enable **Public bucket** (files must be publicly readable)

### 3. Add storage policy for uploads

The API uses the `service_role` key, which bypasses Row Level Security (RLS) by default. No additional policies are needed for the service role to upload/delete files.

If you want extra safety, you can disable RLS on the bucket or add an explicit policy for `service_role`.

---

## How Storage Works

`artifacts/api-server/src/lib/storage.ts` automatically selects the storage backend:

- If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set → **Supabase Storage** (production)
- Otherwise → **local filesystem** fallback (development only)

Files uploaded through the admin panel are stored in the `portfolio-files` Supabase bucket. The public CDN URL returned by Supabase is saved in the `file_url` column of the `portfolio_files` table.

---

## Authentication

Login is handled by the API at `POST /api/auth/login`.

- Compares `username` + `password` against `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars
- Returns a signed JWT (24h expiry) using `SESSION_SECRET`
- The frontend stores the JWT in `localStorage` and sends it as `Authorization: Bearer <token>` on admin requests

---

## Common Issues and Fixes

### Build fails: `Cannot find package 'pnpm'`
Netlify needs pnpm. Add this to `netlify.toml` if missing:
```toml
[build.environment]
  NODE_VERSION = "20"
```
Netlify supports pnpm natively for Node 20+. The `pnpm install` command should work out of the box.

### API returns 404 for all `/api/*` routes
Check that the redirect in `netlify.toml` is present and that `netlify/functions/api.mjs` was generated during build. Look in the Netlify deploy log for the line:
```
✓ Netlify API function bundled → netlify/functions/api.mjs
```

### API returns 401 on login
- Make sure `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars are set in Netlify
- Redeploy after adding env vars (Netlify does not hot-reload env vars)

### Database error: `relation "portfolio_files" does not exist`
The table hasn't been created in Supabase yet. Run the SQL from the **Supabase Setup** section above.

### File uploads fail
- Confirm the `portfolio-files` bucket exists in Supabase Storage and is set to **public**
- Confirm `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set correctly
- Check the Netlify Function logs in **Netlify → Functions → api → Logs**

### SPA routes return 404 on refresh
The SPA fallback redirect in `netlify.toml` handles this. Make sure this block exists:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Local Development (Replit)

In development, `SUPABASE_URL` is not set, so the API falls back to storing files locally in `artifacts/api-server/uploads/`. The database still uses the Supabase PostgreSQL instance via `DATABASE_URL`.

To test with Supabase Storage locally, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the Replit Secrets panel.
