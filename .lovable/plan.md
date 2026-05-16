## Goal

Make Aptivon ready for real users to set up against their own Supabase project, with the database schema committed to the repo and clear README setup instructions. Remove all sample/seed data paths.

## Changes

### 1. Remove sample data entirely
- Delete `src/lib/sample-data.ts`
- Delete `src/lib/seed.ts`
- Remove the "Load sample data" button and its handler from `src/components/AppLayout.tsx`
- Verify no other imports reference these files (search confirms only `AppLayout.tsx` and `seed.ts` use them)

### 2. Commit schema to repo
Migrations already exist under `supabase/migrations/` (two files). Add a consolidated, human-readable schema dump at `supabase/schema.sql` containing:
- `app_role` enum + `user_roles` table + `has_role()` function
- All 11 tables (profiles, companies, contacts, jobs, candidates, submissions, interviews, placements, tasks, activities)
- RLS enablement + policies for each table
- `set_updated_at()` trigger function and per-table triggers
- `handle_new_user()` trigger on `auth.users` to auto-create profile + default role

This single file lets a new user run it in the Supabase SQL editor in one shot, instead of stitching together two timestamped migrations.

### 3. README setup instructions
Rewrite `README.md` with:
- **What Aptivon is** (1 short paragraph)
- **Prerequisites**: Node/Bun, a Supabase project
- **Step-by-step setup**:
  1. Clone repo, `bun install`
  2. Create a Supabase project at supabase.com
  3. Run `supabase/schema.sql` in the SQL Editor (creates tables, RLS, triggers, roles)
  4. Copy Project URL + publishable (anon) key from Supabase → Settings → API
  5. Create `.env` from `.env.example` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, plus server-side `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  6. In Supabase Auth settings, enable Email provider (and optionally disable email confirmation for fast testing, or keep on for production)
  7. `bun run dev`
  8. Sign up — first user becomes a recruiter; promote yourself to admin by inserting into `user_roles` via SQL editor (snippet provided)
- **First-time use**: create your first company → contact → job → candidate → submission flow
- **Deploying**: short note pointing to TanStack Start / Cloudflare Worker deploy
- **Tech stack** summary

Add `.env.example` with the variable names (no values).

### 4. Verify production readiness
- Confirm Quick Create dialogs still work without seed data
- Confirm empty states render cleanly on each list page (Jobs, Candidates, etc.) since a fresh user will see zero rows

## Files

**Delete**: `src/lib/sample-data.ts`, `src/lib/seed.ts`
**Edit**: `src/components/AppLayout.tsx`, `README.md`
**Create**: `supabase/schema.sql`, `.env.example`

## Out of scope
- No new features, no UI redesign, no auth provider changes
- Email confirmation policy stays whatever it currently is (documented in README)
