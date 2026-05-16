import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Toaster } from "sonner";
import { CreateProvider, useCreate, type EntityKind } from "@/components/CreateDialog";
import {
  LayoutDashboard, Building2, Users, Briefcase, UserSearch, Send,
  CalendarClock, Trophy, CheckSquare, BarChart3, Settings,
  Search, Plus, Bell, Menu, LogOut,
} from "lucide-react";
import logo from "@/assets/aptivon-logo.png";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };

const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/candidates", label: "Candidates", icon: UserSearch },
  { to: "/submissions", label: "Submissions", icon: Send },
  { to: "/interviews", label: "Interviews", icon: CalendarClock },
  { to: "/placements", label: "Placements", icon: Trophy },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <CreateProvider>
      <div className="min-h-screen bg-background text-foreground">
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
          <SidebarContent currentPath={location.pathname} />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-sidebar text-sidebar-foreground">
              <SidebarContent currentPath={location.pathname} onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        <div className="lg:pl-64">
          <TopBar onMenuClick={() => setMobileOpen(true)} />
          <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
            <Outlet />
          </main>
          <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-border bg-card lg:hidden">
            {nav.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
              return (
                <Link key={item.to} to={item.to} className={cn("flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium", active ? "text-accent" : "text-muted-foreground")}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </CreateProvider>
  );
}

function SidebarContent({ currentPath, onNavigate }: { currentPath: string; onNavigate?: () => void }) {
  const { profile, user, signOut, isAdmin } = useAuth();
  return (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <img src={logo} alt="Aptivon" className="h-7 w-auto brightness-0 invert" />
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? currentPath === item.to : currentPath.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to} onClick={onNavigate}
              className={cn("group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-sidebar-accent text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground")}>
              <Icon className={cn("h-4 w-4", active ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            {profile?.initials || (user?.email?.[0] ?? "U").toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <div className="truncate text-sm font-medium">{profile?.full_name || user?.email}</div>
              {isAdmin && (
                <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  Admin
                </span>
              )}
            </div>
            <div className="truncate text-xs text-sidebar-foreground/60">{profile?.role_label || "Member"}</div>
          </div>
          <button type="button" onClick={() => signOut()} className="ml-auto rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground" aria-label="Sign out" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

const QUICK_ITEMS: { kind: EntityKind; label: string }[] = [
  { kind: "job", label: "Job order" },
  { kind: "candidate", label: "Candidate" },
  { kind: "company", label: "Company" },
  { kind: "contact", label: "Contact" },
  { kind: "submission", label: "Submission" },
  { kind: "interview", label: "Interview" },
  { kind: "placement", label: "Placement" },
  { kind: "task", label: "Task" },
];

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { open } = useCreate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button type="button" onClick={onMenuClick} className="-ml-2 rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>
      <div className="relative flex flex-1 items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input type="search" placeholder="Search candidates, companies, jobs…" className="h-10 w-full max-w-xl rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30" />
      </div>
      <div className="relative">
        <button type="button" onClick={() => setMenuOpen((o) => !o)} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground shadow-sm hover:opacity-90">
          <Plus className="h-4 w-4" /><span className="hidden sm:inline">Quick create</span>
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-40 mt-1 w-48 rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md">
              {QUICK_ITEMS.map((it) => (
                <button key={it.kind} onClick={() => { setMenuOpen(false); open(it.kind); }} className="block w-full px-3 py-1.5 text-left text-sm hover:bg-muted">
                  {it.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <button type="button" className="relative rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="Notifications">
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
      </button>
    </header>
  );
}
