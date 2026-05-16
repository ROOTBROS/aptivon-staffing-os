## Goal
Replace the in-memory `sample-data.ts` with a real backend (Lovable Cloud / Postgres) so Aptivon persists records, supports multiple users, and is ready for daily staffing use.

## 1. Enable Lovable Cloud
Provision the backend (Postgres + Auth + Storage + server functions). This is a one-click step — no external accounts.

## 2. Auth
- Email + password sign-in (no Google by default; can add later).
- `/login` and `/signup` routes.
- `_authenticated` layout route that gates the whole app (Dashboard, Jobs, Candidates, etc.) and redirects to `/login` when no session.
- `profiles` table auto-populated on signup (full_name, avatar, role label).
- `user_roles` table + `app_role` enum (`admin`, `manager`, `recruiter`) using the security-definer `has_role()` pattern. No roles on the profile.

## 3. Database schema
All tables get RLS enabled. Default policy: authenticated users in the workspace can read; owner or admin can write. `created_by` / `owner_id` tracked on every record.

Tables:
- `profiles` (id, full_name, initials, role_label, avatar_url)
- `user_roles` (user_id, role)
- `companies` (name, industry, size, status, tier, location, website, owner_id, last_contact_at)
- `contacts` (name, title, company_id, email, phone, role, status, owner_id)
- `jobs` (title, company_id, contact_id, location, type, workplace, openings, pay_rate, bill_rate, priority, status, owner_id, recruiter_id, start_date)
- `candidates` (name, title, location, availability, desired_pay, status, source, owner_id, years, skills text[], last_contact_at)
- `submissions` (candidate_id, job_id, submitted_by, submitted_at, rate, status, feedback) — first-class pipeline record
- `interviews` (submission_id, datetime, format, status, outcome)
- `placements` (candidate_id, job_id, type, start_date, end_date, pay_rate, bill_rate, margin, status, owner_id)
- `tasks` (title, owner_id, related_type, related_id, due_at, priority, status)
- `activities` (type, subject, actor_id, related_type, related_id, created_at) — audit/feed

Indexes on foreign keys + status fields. Computed counts (active jobs, submission funnel) done via queries, not denormalized columns.

## 4. Data access layer
Replace `src/lib/sample-data.ts` with `src/lib/*.functions.ts` server functions per entity:
- `listCompanies`, `getCompany`, `createCompany`, `updateCompany`
- Same shape for contacts, jobs, candidates, submissions, interviews, placements, tasks
- `getDashboardMetrics` — aggregates KPIs (active jobs, projected revenue, submission funnel, weekly placements) in a single query

All protected with `requireSupabaseAuth`. Client attaches bearer via `attachSupabaseAuth` middleware (verify present in `src/start.ts`).

## 5. Component wiring
- Use TanStack Query (`useSuspenseQuery` + `ensureQueryData` in loaders under `_authenticated`).
- Update each route (`jobs`, `candidates`, `submissions`, `placements`, `companies`, `contacts`, `interviews`, `tasks`, `reports`, `index` dashboard) to fetch from server functions.
- "Quick Create" modals wired to `createX` mutations + `queryClient.invalidateQueries`.
- Status badges keep working (drive off the same status strings).

## 6. Seed data (optional, on by default)
After signup, offer a "Load sample data" button on the empty dashboard that inserts the current mock records under the new user — so the app stays demo-ready without hardcoded data.

## 7. Cleanup
- Delete `src/lib/sample-data.ts`.
- Keep `statusTone` map but move it to `src/lib/status.ts`.

## Out of scope (future)
- Resume parsing / AI matching
- Email + calendar sync
- Reporting/BI exports beyond the dashboard KPIs
- Granular per-team permissions beyond admin/manager/recruiter
