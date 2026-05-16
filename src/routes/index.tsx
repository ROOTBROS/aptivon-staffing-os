import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/aptivon-logo.png";
import {
  Briefcase, UserSearch, Send, CalendarClock, Trophy,
  CheckSquare, BarChart3, ShieldCheck, Github, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aptivon — Open source ATS for staffing teams" },
      { name: "description", content: "Aptivon is a free, open source applicant tracking system and CRM built for staffing agencies. Track jobs, candidates, submissions, and placements in one place." },
      { property: "og:title", content: "Aptivon — Open source ATS for staffing teams" },
      { property: "og:description", content: "Free, open source ATS + CRM for staffing teams. Jobs, candidates, submissions, placements — in one place." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BackgroundFx />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Aptivon" className="h-9 w-auto" />
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#why" className="hover:text-foreground">Why Aptivon</a>
          <a href="#open-source" className="hover:text-foreground">Open source</a>
        </nav>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Github className="h-4 w-4" /> Star on GitHub
        </a>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-16">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Open source · MIT licensed
          </div>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            The ATS staffing teams<br />
            <span className="bg-gradient-to-r from-[oklch(0.55_0.18_240)] to-[oklch(0.7_0.18_200)] bg-clip-text text-transparent">
              actually want to use.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Jobs, candidates, submissions, interviews, and placements — in one fast,
            keyboard-friendly workspace. Free forever. Self-host or run it in the cloud.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#auth" className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm hover:opacity-90">
              Get started free <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#features" className="inline-flex h-11 items-center rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground hover:bg-muted">
              See features
            </a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Row-level security</span>
            <span>·</span>
            <span>No credit card required</span>
          </div>
        </div>

        <div id="auth" className="lg:pl-4">
          <AuthCard />
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">Everything a recruiter needs.</h2>
          <p className="mt-2 text-muted-foreground">Built ground-up for agency staffing — not bolted on top of a generic CRM.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.label} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold text-foreground">{f.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.title}>
              <div className="text-3xl font-semibold tracking-tight text-foreground">{w.stat}</div>
              <div className="mt-2 text-sm font-semibold text-foreground">{w.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{w.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="open-source" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[oklch(0.22_0.07_255)] to-[oklch(0.3_0.1_240)] p-10 text-white">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/60">Open source</div>
              <h3 className="mt-2 text-2xl font-semibold">Own your data. Fork the code.</h3>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                MIT licensed. Self-host on your own infrastructure or run it managed. No vendor lock-in.
              </p>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-[oklch(0.22_0.07_255)] hover:bg-white/90"
            >
              <Github className="h-4 w-4" /> View on GitHub
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-5 w-auto opacity-80" />
            <span>© {new Date().getFullYear()} Aptivon. MIT licensed.</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#open-source" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: Briefcase, label: "Job orders", desc: "Track every open req with priority, openings, and pipeline status." },
  { icon: UserSearch, label: "Candidates", desc: "A searchable talent pool with notes, tags, and full history." },
  { icon: Send, label: "Submissions", desc: "From submitted to placed — see exactly where every candidate stands." },
  { icon: CalendarClock, label: "Interviews", desc: "Schedule, track outcomes, and never lose a follow-up again." },
  { icon: Trophy, label: "Placements", desc: "Record offers, start dates, and revenue — automatically." },
  { icon: CheckSquare, label: "Tasks", desc: "Daily work tied to jobs, candidates, and clients. No more sticky notes." },
  { icon: BarChart3, label: "Reports", desc: "Pipeline, funnel, client performance, and revenue at a glance." },
  { icon: ShieldCheck, label: "Secure by default", desc: "Row-level security, role-based access, and audited auth." },
];

const WHY = [
  { stat: "1 workspace", title: "Replace 4 tools", body: "ATS, CRM, scheduler, and reporting — unified." },
  { stat: "100% open", title: "Yours to fork", body: "MIT license. Inspect every line. Self-host anywhere." },
  { stat: "0 lock-in", title: "Your data, always", body: "Standard Postgres. Export anytime. No black boxes." },
];

function AuthCard() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard" });
  }, [session, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name || email.split("@")[0] } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-[oklch(0.7_0.18_240)]/20 via-transparent to-[oklch(0.22_0.07_255)]/10 blur-2xl" />
      <div className="rounded-2xl border border-border bg-card p-7 shadow-xl shadow-[oklch(0.22_0.07_255)]/5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h2>
          <div className="inline-flex rounded-md border border-border bg-muted/40 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(null); }}
              className={`rounded px-2.5 py-1 font-medium ${mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >Sign in</button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(null); }}
              className={`rounded px-2.5 py-1 font-medium ${mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >Sign up</button>
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "Welcome back to your workspace." : "Free forever. No credit card."}
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          {mode === "signup" && (
            <Field label="Full name">
              <input value={name} onChange={(e) => setName(e.target.value)} className="lp-input" placeholder="Jordan Reyes" autoComplete="name" />
            </Field>
          )}
          <Field label="Work email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="lp-input" placeholder="you@company.com" autoComplete="email" />
          </Field>
          <Field label="Password">
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="lp-input" placeholder="••••••••" autoComplete={mode === "signin" ? "current-password" : "new-password"} />
          </Field>
          {error && (
            <div className="rounded-md bg-[oklch(0.96_0.06_25)] px-3 py-2 text-sm text-[oklch(0.42_0.18_25)]">{error}</div>
          )}
          <button type="submit" disabled={loading}
            className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[oklch(0.55_0.18_240)] to-[oklch(0.7_0.18_240)] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60">
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          By continuing you agree to the terms of the MIT license.
        </div>
      </div>
      <style>{`.lp-input { display:block; width:100%; height:42px; border-radius:0.5rem; border:1px solid var(--border); background:var(--background); padding:0 0.75rem; font-size:0.875rem; outline:none; transition:border-color .15s, box-shadow .15s; }
      .lp-input:focus { border-color:oklch(0.55 0.18 240); box-shadow:0 0 0 3px oklch(0.55 0.18 240 / 0.15); }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function BackgroundFx() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] overflow-hidden">
        <div className="absolute left-1/2 top-[-200px] h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[oklch(0.7_0.18_240)]/20 blur-3xl" />
        <div className="absolute left-1/4 top-[100px] h-[300px] w-[500px] rounded-full bg-[oklch(0.78_0.14_85)]/10 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(oklch(0.92_0.012_250)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
    </>
  );
}