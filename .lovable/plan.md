## Current state

The schema already has a 3-tier role hierarchy via `public.app_role` enum (`admin`, `manager`, `recruiter`) and a separate `user_roles` table checked by the `has_role()` security-definer function. RLS already uses it: any authenticated user can read; only the row's creator OR an `admin` can update/delete.

What's missing is purely UX: there's no way to see or change roles from inside the app, and the very first signup has no path to admin without dropping into SQL.

## Goal

Make the role hierarchy usable end-to-end without any SQL knowledge. Keep it dead simple: **two effective tiers** in the UI — Admin and Recruiter. (The `manager` enum value stays in the schema for future use but isn't surfaced now.)

Rules:
- **Admin** — can edit/delete anything anyone created; can promote/demote other users.
- **Recruiter** — default for new signups; can create anything, can only edit/delete their own records.
- **First signup auto-becomes Admin** so a brand-new workspace has an owner without needing SQL.

## Changes

### 1. Schema (one small migration)

Update `handle_new_user()` so that:
- If there are zero rows in `user_roles` with role `'admin'`, the new user gets `admin` and their `profiles.role_label` is set to `'Admin'`.
- Otherwise, behavior stays the same (`recruiter` + `'Recruiter'`).

Add an RPC `set_user_role(target_user uuid, new_role app_role)`:
- `SECURITY DEFINER`, callable by authenticated users.
- Body checks `has_role(auth.uid(), 'admin')`; if not, raises.
- Prevents an admin from demoting the last remaining admin.
- Replaces the target's row in `user_roles` and updates `profiles.role_label` to match.

Mirror these changes in `supabase/schema.sql` so a fresh setup gets the new behavior.

### 2. Auth context

Extend `src/hooks/use-auth.tsx`:
- After loading the profile, also fetch `user_roles` for the current user.
- Expose `role: 'admin' | 'recruiter' | null` and `isAdmin: boolean` on the `useAuth()` context.

### 3. Settings page — team management

Update `src/routes/settings.tsx` "Team members" card:
- Join `profiles` with `user_roles` to show each member's actual role (Admin / Recruiter), not just the cosmetic `role_label`.
- If the current user `isAdmin`, render a small role dropdown next to each other member that calls the `set_user_role` RPC and refreshes the list on success.
- Non-admins see the role as a read-only badge.
- Show a toast on success/failure (sonner is already mounted).

### 4. Tiny visual cue

In `AppLayout`'s sidebar footer, when `isAdmin` is true show a small "Admin" pill next to the user's name. No new gated routes — admin power is enforced by RLS at the row level, which is enough for v1.

### 5. README

Two-line update under "Promote yourself to admin": replace the SQL snippet with "The very first signup is automatically the workspace admin. After that, admins can promote teammates from Settings → Team members." Keep the SQL as a fallback note.

## Files

**Edit**: `src/hooks/use-auth.tsx`, `src/routes/settings.tsx`, `src/components/AppLayout.tsx`, `supabase/schema.sql`, `README.md`
**New migration**: updated `handle_new_user()` + new `set_user_role()` RPC

## Out of scope

- No `manager` tier in the UI yet (kept in schema for later).
- No new route guards (RLS handles enforcement; every authenticated user can still navigate everywhere — destructive actions just fail server-side for non-owners/non-admins, which is the existing behavior).
- No per-record permission badges in list pages.
