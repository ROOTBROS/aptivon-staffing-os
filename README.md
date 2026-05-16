# Aptivon

Aptivon is a staffing-native ATS + CRM. It connects clients, contacts, jobs, candidates, submissions, interviews, and placements as first-class objects so recruiters can run their day from one workspace and leadership can see the full revenue pipeline.

Built with TanStack Start (React 19 + Vite), Tailwind CSS v4, TanStack Query, and Supabase (Postgres + Auth + RLS).

---

## Quick start (with your own Supabase project)

### 1. Prerequisites

- [Bun](https://bun.sh) (or Node 20+ with npm)
- A free [Supabase](https://supabase.com) project

### 2. Clone and install

```bash
git clone <this-repo>
cd aptivon
bun install
```

### 3. Provision the database

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase dashboard.
3. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) and run it.

This creates all 11 tables (`profiles`, `user_roles`, `companies`, `contacts`, `jobs`, `candidates`, `submissions`, `interviews`, `placements`, `tasks`, `activities`), enables Row Level Security on every one, installs all policies, the `app_role` enum, the `has_role()` helper, the `set_updated_at` trigger, and a `handle_new_user` trigger that auto-creates a profile + default `recruiter` role whenever someone signs up.

### 4. Configure auth

In the Supabase dashboard:

- **Authentication → Providers → Email**: make sure Email is enabled.
- For fast local testing you can also disable "Confirm email" so signups log in immediately. Leave it on for production.
- (Optional) Add Google or any other providers you want.

### 5. Wire up environment variables

Copy the example file and fill in the values from **Project Settings → API** in Supabase:

```bash
cp .env.example .env
```

| Variable                          | Where to find it                              |
| --------------------------------- | --------------------------------------------- |
| `VITE_SUPABASE_URL`               | Settings → API → Project URL                  |
| `VITE_SUPABASE_PUBLISHABLE_KEY`   | Settings → API → `anon` / `publishable` key   |
| `VITE_SUPABASE_PROJECT_ID`        | The ref in the URL (`<ref>.supabase.co`)      |
| `SUPABASE_URL`                    | Same as `VITE_SUPABASE_URL`                   |
| `SUPABASE_PUBLISHABLE_KEY`        | Same as `VITE_SUPABASE_PUBLISHABLE_KEY`       |
| `SUPABASE_SERVICE_ROLE_KEY`       | Settings → API → `service_role` key (secret!) |

The `VITE_` keys ship to the browser. The plain `SUPABASE_*` keys are used by TanStack server functions and must never appear in client code. Never commit `.env`.

### 6. Run it

```bash
bun run dev
```

Open <http://localhost:3000>, click **Sign up**, and you're in.

### 7. (Optional) Promote yourself to admin

New users are created with the `recruiter` role. To make yourself an admin (can edit and delete records created by anyone), run this once in the Supabase SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'you@example.com'
ON CONFLICT DO NOTHING;
```

---

## First-time workflow

The data model is built around the submission record. A typical flow:

1. **Companies** → add your client account.
2. **Contacts** → add the hiring manager at that company.
3. **Jobs** → open a job order tied to the company and contact.
4. **Candidates** → add a candidate to your pipeline.
5. **Submissions** → submit the candidate to the job (this is the unit of activity).
6. **Interviews** → schedule from a submission.
7. **Placements** → close the loop when the candidate starts.

Use **Quick create** in the top bar to create any of these from anywhere in the app.

---

## Security model

- All business tables have RLS enabled.
- `SELECT` is open to any authenticated user (a shared workspace view).
- `INSERT` requires `auth.uid() = created_by`.
- `UPDATE` / `DELETE` are restricted to the row's creator or any user with the `admin` role (`has_role(auth.uid(), 'admin')`).
- Roles live in a dedicated `user_roles` table (never on `profiles`) and are checked via a `SECURITY DEFINER` function to avoid RLS recursion.

If you need stricter per-user data isolation (e.g. recruiters can only see their own candidates), tighten the `SELECT` policies in `supabase/schema.sql` before deploying.

---

## Deploying

Aptivon is a TanStack Start app and builds to a Cloudflare Worker by default. Any TanStack Start–compatible host works. Set the same environment variables in your host's project settings, then build:

```bash
bun run build
```

---

## Tech stack

- **Frontend**: React 19, TanStack Router, TanStack Query, Tailwind CSS v4
- **Backend**: TanStack Start server functions (`createServerFn`) over Supabase
- **Database**: Postgres on Supabase with Row Level Security
- **Auth**: Supabase Auth (email/password; add Google or others in the dashboard)

---

## Project layout

```
src/
  routes/          # File-based routes (TanStack Router)
  components/      # UI + shared layout (AppLayout, CreateDialog, DataTable, ...)
  hooks/           # use-auth and friends
  lib/             # queries.ts (TanStack Query hooks), status.ts, utils
  integrations/
    supabase/      # auto-generated client + types (do not edit by hand)
supabase/
  schema.sql       # full schema — run this once to set up your project
  migrations/      # timestamped Supabase CLI migrations (same content)
```
