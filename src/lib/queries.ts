import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// =================== Types ===================
export type Profile = { id: string; full_name: string; initials: string; role_label: string };

export type CompanyRow = {
  id: string;
  name: string;
  industry: string | null;
  size: string | null;
  status: string;
  tier: string | null;
  location: string | null;
  website: string | null;
  last_contact_at: string | null;
  owner_id: string | null;
  owner_name: string;
  active_jobs: number;
  open_subs: number;
};

export type ContactRow = {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  status: string;
  company_id: string | null;
  company_name: string;
  owner_name: string;
};

export type JobRow = {
  id: string;
  title: string;
  location: string | null;
  type: string | null;
  workplace: string | null;
  openings: number;
  pay_rate: string | null;
  bill_rate: string | null;
  priority: string;
  status: string;
  start_date: string | null;
  created_at: string;
  company_id: string | null;
  company_name: string;
  contact_name: string;
  recruiter_name: string;
  submitted: number;
  interviewing: number;
  offers: number;
  age: number;
};

export type CandidateRow = {
  id: string;
  name: string;
  title: string | null;
  location: string | null;
  availability: string | null;
  desired_pay: string | null;
  status: string;
  source: string | null;
  years: number | null;
  skills: string[];
  owner_name: string;
  last_contact_at: string | null;
};

export type SubmissionRow = {
  id: string;
  candidate_id: string;
  candidate_name: string;
  job_id: string;
  job_title: string;
  company_name: string;
  submitted_at: string;
  rate: string | null;
  status: string;
  feedback: string | null;
  submitted_by_name: string;
};

export type InterviewRow = {
  id: string;
  candidate_name: string;
  job_title: string;
  company_name: string;
  contact_name: string;
  scheduled_at: string;
  format: string;
  status: string;
  outcome: string | null;
};

export type PlacementRow = {
  id: string;
  candidate_name: string;
  job_title: string;
  company_name: string;
  type: string;
  start_date: string;
  end_date: string | null;
  pay_rate: string | null;
  bill_rate: string | null;
  margin: string | null;
  status: string;
  owner_name: string;
};

export type TaskRow = {
  id: string;
  title: string;
  owner_id: string | null;
  owner_name: string;
  related_label: string | null;
  due_at: string | null;
  priority: string;
  status: string;
};

// =================== Helpers ===================
function fmtDate(d: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
}
function fmtRelative(d: string | null): string {
  if (!d) return "—";
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return fmtDate(d);
}
export const dateUtils = { fmtDate, fmtRelative };

async function fetchProfileMap(): Promise<Record<string, string>> {
  const { data } = await supabase.from("profiles").select("id, full_name");
  const map: Record<string, string> = {};
  (data ?? []).forEach((p) => (map[p.id] = p.full_name));
  return map;
}

// =================== Queries ===================
export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, initials, role_label")
        .order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export type TeamMember = Profile & { role: "admin" | "manager" | "recruiter" | null };

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: async (): Promise<TeamMember[]> => {
      const [{ data: profiles, error }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, initials, role_label").order("full_name"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (error) throw error;
      const roleMap: Record<string, TeamMember["role"]> = {};
      (roles ?? []).forEach((r) => {
        const cur = roleMap[r.user_id];
        const incoming = r.role as TeamMember["role"];
        // admin > manager > recruiter
        const rank = (x: TeamMember["role"]) => (x === "admin" ? 3 : x === "manager" ? 2 : x === "recruiter" ? 1 : 0);
        if (!cur || rank(incoming) > rank(cur)) roleMap[r.user_id] = incoming;
      });
      return (profiles ?? []).map((p) => ({ ...p, role: roleMap[p.id] ?? null }));
    },
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async (): Promise<CompanyRow[]> => {
      const [companiesRes, jobsRes, subsRes, profiles] = await Promise.all([
        supabase.from("companies").select("*").order("name"),
        supabase.from("jobs").select("id, company_id, status"),
        supabase.from("submissions").select("id, status, job_id"),
        fetchProfileMap(),
      ]);
      if (companiesRes.error) throw companiesRes.error;
      const jobs = jobsRes.data ?? [];
      const subs = subsRes.data ?? [];
      const jobsByCompany = jobs.reduce<Record<string, number>>((acc, j) => {
        if (!j.company_id) return acc;
        if (["Open", "Sourcing", "Interviewing", "Offer"].includes(j.status))
          acc[j.company_id] = (acc[j.company_id] ?? 0) + 1;
        return acc;
      }, {});
      const jobIdToCompany: Record<string, string> = {};
      jobs.forEach((j) => { if (j.company_id) jobIdToCompany[j.id] = j.company_id; });
      const subsByCompany: Record<string, number> = {};
      subs.forEach((s) => {
        if (["Rejected", "Placed", "Closed"].includes(s.status)) return;
        const cid = jobIdToCompany[s.job_id];
        if (cid) subsByCompany[cid] = (subsByCompany[cid] ?? 0) + 1;
      });
      return (companiesRes.data ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        industry: c.industry,
        size: c.size,
        status: c.status,
        tier: c.tier,
        location: c.location,
        website: c.website,
        last_contact_at: c.last_contact_at,
        owner_id: c.owner_id,
        owner_name: c.owner_id ? profiles[c.owner_id] ?? "—" : "—",
        active_jobs: jobsByCompany[c.id] ?? 0,
        open_subs: subsByCompany[c.id] ?? 0,
      }));
    },
  });
}

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async (): Promise<ContactRow[]> => {
      const [{ data: contacts, error }, { data: companies }, profiles] = await Promise.all([
        supabase.from("contacts").select("*").order("name"),
        supabase.from("companies").select("id, name"),
        fetchProfileMap(),
      ]);
      if (error) throw error;
      const cMap = Object.fromEntries((companies ?? []).map((c) => [c.id, c.name]));
      return (contacts ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        title: c.title,
        email: c.email,
        phone: c.phone,
        role: c.role,
        status: c.status,
        company_id: c.company_id,
        company_name: c.company_id ? cMap[c.company_id] ?? "—" : "—",
        owner_name: c.owner_id ? profiles[c.owner_id] ?? "—" : "—",
      }));
    },
  });
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async (): Promise<JobRow[]> => {
      const [{ data: jobs, error }, { data: companies }, { data: contacts }, { data: subs }, profiles] = await Promise.all([
        supabase.from("jobs").select("*").order("created_at", { ascending: false }),
        supabase.from("companies").select("id, name"),
        supabase.from("contacts").select("id, name"),
        supabase.from("submissions").select("id, job_id, status"),
        fetchProfileMap(),
      ]);
      if (error) throw error;
      const cMap = Object.fromEntries((companies ?? []).map((c) => [c.id, c.name]));
      const ctMap = Object.fromEntries((contacts ?? []).map((c) => [c.id, c.name]));
      const submittedByJob: Record<string, number> = {};
      const intByJob: Record<string, number> = {};
      const offByJob: Record<string, number> = {};
      (subs ?? []).forEach((s) => {
        submittedByJob[s.job_id] = (submittedByJob[s.job_id] ?? 0) + 1;
        if (["Interview requested", "Interviewing"].includes(s.status)) intByJob[s.job_id] = (intByJob[s.job_id] ?? 0) + 1;
        if (s.status === "Offer pending") offByJob[s.job_id] = (offByJob[s.job_id] ?? 0) + 1;
      });
      return (jobs ?? []).map((j) => ({
        id: j.id,
        title: j.title,
        location: j.location,
        type: j.type,
        workplace: j.workplace,
        openings: j.openings,
        pay_rate: j.pay_rate,
        bill_rate: j.bill_rate,
        priority: j.priority,
        status: j.status,
        start_date: j.start_date,
        created_at: j.created_at,
        company_id: j.company_id,
        company_name: j.company_id ? cMap[j.company_id] ?? "—" : "—",
        contact_name: j.contact_id ? ctMap[j.contact_id] ?? "—" : "—",
        recruiter_name: j.recruiter_id ? profiles[j.recruiter_id] ?? "—" : "—",
        submitted: submittedByJob[j.id] ?? 0,
        interviewing: intByJob[j.id] ?? 0,
        offers: offByJob[j.id] ?? 0,
        age: Math.max(0, Math.floor((Date.now() - new Date(j.created_at).getTime()) / 86400000)),
      }));
    },
  });
}

export function useCandidates() {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: async (): Promise<CandidateRow[]> => {
      const [{ data, error }, profiles] = await Promise.all([
        supabase.from("candidates").select("*").order("name"),
        fetchProfileMap(),
      ]);
      if (error) throw error;
      return (data ?? []).map((k) => ({
        id: k.id,
        name: k.name,
        title: k.title,
        location: k.location,
        availability: k.availability,
        desired_pay: k.desired_pay,
        status: k.status,
        source: k.source,
        years: k.years,
        skills: k.skills ?? [],
        owner_name: k.owner_id ? profiles[k.owner_id] ?? "—" : "—",
        last_contact_at: k.last_contact_at,
      }));
    },
  });
}

export function useSubmissions() {
  return useQuery({
    queryKey: ["submissions"],
    queryFn: async (): Promise<SubmissionRow[]> => {
      const [{ data: subs, error }, { data: cands }, { data: jobs }, { data: companies }, profiles] = await Promise.all([
        supabase.from("submissions").select("*").order("submitted_at", { ascending: false }),
        supabase.from("candidates").select("id, name"),
        supabase.from("jobs").select("id, title, company_id"),
        supabase.from("companies").select("id, name"),
        fetchProfileMap(),
      ]);
      if (error) throw error;
      const candMap = Object.fromEntries((cands ?? []).map((c) => [c.id, c.name]));
      const jobMap = Object.fromEntries((jobs ?? []).map((j) => [j.id, j]));
      const coMap = Object.fromEntries((companies ?? []).map((c) => [c.id, c.name]));
      return (subs ?? []).map((s) => {
        const job = jobMap[s.job_id];
        return {
          id: s.id,
          candidate_id: s.candidate_id,
          candidate_name: candMap[s.candidate_id] ?? "—",
          job_id: s.job_id,
          job_title: job?.title ?? "—",
          company_name: job?.company_id ? coMap[job.company_id] ?? "—" : "—",
          submitted_at: s.submitted_at,
          rate: s.rate,
          status: s.status,
          feedback: s.feedback,
          submitted_by_name: s.submitted_by ? profiles[s.submitted_by] ?? "—" : "—",
        };
      });
    },
  });
}

export function useInterviews() {
  return useQuery({
    queryKey: ["interviews"],
    queryFn: async (): Promise<InterviewRow[]> => {
      const [{ data: ints, error }, { data: cands }, { data: jobs }, { data: companies }, { data: contacts }] = await Promise.all([
        supabase.from("interviews").select("*").order("scheduled_at", { ascending: true }),
        supabase.from("candidates").select("id, name"),
        supabase.from("jobs").select("id, title, company_id"),
        supabase.from("companies").select("id, name"),
        supabase.from("contacts").select("id, name"),
      ]);
      if (error) throw error;
      const candMap = Object.fromEntries((cands ?? []).map((c) => [c.id, c.name]));
      const jobMap = Object.fromEntries((jobs ?? []).map((j) => [j.id, j]));
      const coMap = Object.fromEntries((companies ?? []).map((c) => [c.id, c.name]));
      const ctMap = Object.fromEntries((contacts ?? []).map((c) => [c.id, c.name]));
      return (ints ?? []).map((i) => {
        const job = jobMap[i.job_id];
        return {
          id: i.id,
          candidate_name: candMap[i.candidate_id] ?? "—",
          job_title: job?.title ?? "—",
          company_name: job?.company_id ? coMap[job.company_id] ?? "—" : "—",
          contact_name: i.contact_id ? ctMap[i.contact_id] ?? "—" : "—",
          scheduled_at: i.scheduled_at,
          format: i.format,
          status: i.status,
          outcome: i.outcome,
        };
      });
    },
  });
}

export function usePlacements() {
  return useQuery({
    queryKey: ["placements"],
    queryFn: async (): Promise<PlacementRow[]> => {
      const [{ data: pls, error }, { data: cands }, { data: jobs }, { data: companies }, profiles] = await Promise.all([
        supabase.from("placements").select("*").order("start_date", { ascending: false }),
        supabase.from("candidates").select("id, name"),
        supabase.from("jobs").select("id, title, company_id"),
        supabase.from("companies").select("id, name"),
        fetchProfileMap(),
      ]);
      if (error) throw error;
      const candMap = Object.fromEntries((cands ?? []).map((c) => [c.id, c.name]));
      const jobMap = Object.fromEntries((jobs ?? []).map((j) => [j.id, j]));
      const coMap = Object.fromEntries((companies ?? []).map((c) => [c.id, c.name]));
      return (pls ?? []).map((p) => {
        const job = jobMap[p.job_id];
        return {
          id: p.id,
          candidate_name: candMap[p.candidate_id] ?? "—",
          job_title: job?.title ?? "—",
          company_name: job?.company_id ? coMap[job.company_id] ?? "—" : "—",
          type: p.type,
          start_date: p.start_date,
          end_date: p.end_date,
          pay_rate: p.pay_rate,
          bill_rate: p.bill_rate,
          margin: p.margin,
          status: p.status,
          owner_name: p.owner_id ? profiles[p.owner_id] ?? "—" : "—",
        };
      });
    },
  });
}

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async (): Promise<TaskRow[]> => {
      const [{ data, error }, profiles] = await Promise.all([
        supabase.from("tasks").select("*").order("due_at", { ascending: true, nullsFirst: false }),
        fetchProfileMap(),
      ]);
      if (error) throw error;
      return (data ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        owner_id: t.owner_id,
        owner_name: t.owner_id ? profiles[t.owner_id] ?? "—" : "—",
        related_label: t.related_label,
        due_at: t.due_at,
        priority: t.priority,
        status: t.status,
      }));
    },
  });
}

export type ActivityRow = {
  id: string;
  type: string;
  subject: string;
  actor_name: string;
  created_at: string;
};

export function useActivities(limit = 10) {
  return useQuery({
    queryKey: ["activities", limit],
    queryFn: async (): Promise<ActivityRow[]> => {
      const [{ data, error }, profiles] = await Promise.all([
        supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(limit),
        fetchProfileMap(),
      ]);
      if (error) throw error;
      return (data ?? []).map((a) => ({
        id: a.id,
        type: a.type,
        subject: a.subject,
        actor_name: a.actor_id ? profiles[a.actor_id] ?? "—" : "—",
        created_at: a.created_at,
      }));
    },
  });
}

// Aggregated dashboard KPIs
export type DashboardKpis = {
  activeJobs: number;
  newCandidates: number;
  submissions: number;
  upcomingInterviews: number;
  placementsThisMonth: number;
  overdueTasks: number;
};
export function useDashboardKpis() {
  return useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: async (): Promise<DashboardKpis> => {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
      const today = new Date().toISOString().slice(0, 10);
      const [aj, nc, su, ui, pm, ot] = await Promise.all([
        supabase.from("jobs").select("id", { count: "exact", head: true }).in("status", ["Open", "Sourcing", "Interviewing", "Offer"]),
        supabase.from("candidates").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
        supabase.from("submissions").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
        supabase.from("interviews").select("id", { count: "exact", head: true }).gte("scheduled_at", new Date().toISOString()).eq("status", "Scheduled"),
        supabase.from("placements").select("id", { count: "exact", head: true }).gte("start_date", monthStart),
        supabase.from("tasks").select("id", { count: "exact", head: true }).lt("due_at", today).neq("status", "Completed"),
      ]);
      return {
        activeJobs: aj.count ?? 0,
        newCandidates: nc.count ?? 0,
        submissions: su.count ?? 0,
        upcomingInterviews: ui.count ?? 0,
        placementsThisMonth: pm.count ?? 0,
        overdueTasks: ot.count ?? 0,
      };
    },
  });
}