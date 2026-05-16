import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  full_name: string;
  initials: string;
  role_label: string;
};

type AppRole = "admin" | "manager" | "recruiter";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: AppRole | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  profile: null,
  role: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => loadProfileAndRole(s.user.id), 0);
      } else {
        setProfile(null);
        setRole(null);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadProfileAndRole(data.session.user.id);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfileAndRole(uid: string) {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, initials, role_label").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    if (p) setProfile(p);
    const roles = (r ?? []).map((x) => x.role as AppRole);
    setRole(roles.includes("admin") ? "admin" : roles.includes("manager") ? "manager" : roles.includes("recruiter") ? "recruiter" : null);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, profile, role, isAdmin: role === "admin", loading, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}