## AI Chat Feature — Floating Bubble

### UX
- Floating chat button (bottom-right) inside `AppLayout`, visible on all authenticated pages.
- Click opens a chat panel (~400px wide, ~600px tall) with AI Elements primitives.
- Single rolling conversation, no persistence — clears on refresh. A "Clear" button resets in-session.
- Empty state with suggested prompts ("What jobs are urgent?", "Who's interviewing this week?", "Draft an outreach email").

### Backend
- TanStack server route `src/routes/api/chat.ts` using AI SDK + Lovable AI Gateway (`google/gemini-3-flash-preview`).
- Protected via `requireSupabaseAuth` middleware so tool calls run scoped to the user's RLS.
- Tools (read-only) defined with `tool()` + Zod:
  - `listJobs` — filter by status/priority
  - `listCandidates` — filter by name/status
  - `listSubmissions` — recent submissions
  - `listInterviews` — upcoming
  - `listTasks` — open/overdue
  - `listCompanies` / `listContacts`
- `stopWhen: stepCountIs(50)`. System prompt frames it as the Aptivon recruiting assistant.

### Frontend
- Install AI Elements: `conversation`, `message`, `prompt-input`, `shimmer`, `tool`.
- New `src/components/ChatBubble.tsx`:
  - Uses `useChat` with `DefaultChatTransport({ api: "/api/chat" })`.
  - Renders `message.parts` (text + tool parts with collapsed accordion).
  - Custom agent logo (small icon — not Sparkles) — reuse existing brand mark.
  - Textarea auto-focus on open / after send.
- Mount `<ChatBubble />` in `AppLayout` (authenticated shell only).

### Secrets
- `LOVABLE_API_KEY` already present — no action needed.

### Files
- Create: `src/lib/ai-gateway.ts`, `src/routes/api/chat.ts`, `src/components/ChatBubble.tsx`, `src/components/ai-elements/*` (via CLI).
- Edit: `src/components/AppLayout.tsx` (mount bubble), `src/start.ts` (verify `attachSupabaseAuth` registered).
