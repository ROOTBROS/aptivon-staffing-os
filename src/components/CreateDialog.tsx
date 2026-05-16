import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type EntityKind =
  | "company" | "contact" | "job" | "candidate"
  | "submission" | "interview" | "placement" | "task";

type Ctx = { open: (kind: EntityKind) => void };
const CreateCtx = createContext<Ctx | null>(null);
export const useCreate = () => {
  const c = useContext(CreateCtx);
  if (!c) throw new Error("CreateProvider missing");
  return c;
};

const TITLES: Record<EntityKind, string> = {
  company: "New company", contact: "New contact", job: "New job order",
  candidate: "New candidate", submission: "New submission", interview: "Schedule interview",
  placement: "New placement", task: "New task",
};

type Option = { id: string; label: string };

export function CreateProvider({ children }: { children: ReactNode }) {
  const [kind, setKind] = useState<EntityKind | null>(null);
  return (
    <CreateCtx.Provider value={{ open: setKind }}>
      {children}
      <Dialog open={!!kind} onOpenChange={(o) => !o && setKind(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{kind ? TITLES[kind] : ""}</DialogTitle></DialogHeader>
          {kind && <CreateForm kind={kind} onDone={() => setKind(null)} />}
        </DialogContent>
      </Dialog>
    </CreateCtx.Provider>
  );
}

function useOptions(table: "companies" | "contacts" | "jobs" | "candidates", labelCol = "name") {
  const [opts, setOpts] = useState<Option[]>([]);
  useEffect(() => {
    const col = table === "jobs" ? "title" : labelCol;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from(table).select(`id, ${col}`).order(col) as any).then(({ data }: { data: Array<Record<string, unknown>> | null }) => {
      setOpts((data ?? []).map((r) => ({ id: r.id as string, label: (r[col] as string) ?? "—" })));
    });
  }, [table, labelCol]);
  return opts;
}

function CreateForm({ kind, onDone }: { kind: EntityKind; onDone: () => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState<Record<string, string>>({});
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const companies = useOptions("companies");
  const contacts = useOptions("contacts");
  const jobs = useOptions("jobs", "title");
  const candidates = useOptions("candidates");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const base = { created_by: user.id };
      let payload: Record<string, unknown> = { ...base };
      let table = "";
      const opt = (s?: string) => (s && s.trim() ? s.trim() : null);
      const num = (s?: string) => (s && s.trim() ? Number(s) : null);

      if (kind === "company") {
        table = "companies";
        payload = { ...payload, name: f.name, industry: opt(f.industry), location: opt(f.location), tier: opt(f.tier), status: f.status || "Prospect", owner_id: user.id };
      } else if (kind === "contact") {
        table = "contacts";
        payload = { ...payload, name: f.name, title: opt(f.title), email: opt(f.email), phone: opt(f.phone), company_id: opt(f.company_id), role: opt(f.role), status: f.status || "Active", owner_id: user.id };
      } else if (kind === "job") {
        table = "jobs";
        payload = { ...payload, title: f.title, company_id: opt(f.company_id), contact_id: opt(f.contact_id), location: opt(f.location), type: opt(f.type), workplace: opt(f.workplace), openings: num(f.openings) ?? 1, pay_rate: opt(f.pay_rate), bill_rate: opt(f.bill_rate), priority: f.priority || "Medium", status: f.status || "Open", recruiter_id: user.id, owner_id: user.id };
      } else if (kind === "candidate") {
        table = "candidates";
        payload = { ...payload, name: f.name, title: opt(f.title), location: opt(f.location), email: opt(f.email), phone: opt(f.phone), status: f.status || "Active", availability: opt(f.availability), desired_pay: opt(f.desired_pay), source: opt(f.source), years: num(f.years), skills: (f.skills ?? "").split(",").map((s) => s.trim()).filter(Boolean), owner_id: user.id };
      } else if (kind === "submission") {
        table = "submissions";
        payload = { ...payload, candidate_id: f.candidate_id, job_id: f.job_id, rate: opt(f.rate), status: f.status || "Submitted", feedback: opt(f.feedback), submitted_by: user.id };
      } else if (kind === "interview") {
        table = "interviews";
        payload = { ...payload, candidate_id: f.candidate_id, job_id: f.job_id, contact_id: opt(f.contact_id), scheduled_at: new Date(f.scheduled_at).toISOString(), format: f.format || "Video", status: f.status || "Scheduled" };
      } else if (kind === "placement") {
        table = "placements";
        payload = { ...payload, candidate_id: f.candidate_id, job_id: f.job_id, start_date: f.start_date, end_date: opt(f.end_date), type: f.type || "Contract", pay_rate: opt(f.pay_rate), bill_rate: opt(f.bill_rate), margin: opt(f.margin), status: f.status || "Pending start", owner_id: user.id };
      } else if (kind === "task") {
        table = "tasks";
        payload = { ...payload, title: f.title, due_at: opt(f.due_at), priority: f.priority || "Medium", status: f.status || "Open", related_label: opt(f.related_label), owner_id: user.id };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from(table as any).insert(payload as any));
      if (error) throw error;
      toast.success(`${TITLES[kind]} created`);
      qc.invalidateQueries();
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {kind === "company" && (<>
        <Input req label="Name" v={f.name} onChange={set("name")} />
        <Row><Input label="Industry" v={f.industry} onChange={set("industry")} /><Input label="Location" v={f.location} onChange={set("location")} /></Row>
        <Row><Input label="Tier" v={f.tier} onChange={set("tier")} placeholder="A / B / C" /><Select label="Status" v={f.status} onChange={set("status")} options={["Prospect","Active","Inactive"]} /></Row>
      </>)}
      {kind === "contact" && (<>
        <Input req label="Name" v={f.name} onChange={set("name")} />
        <Row><Input label="Title" v={f.title} onChange={set("title")} /><Pick label="Company" v={f.company_id} onChange={set("company_id")} opts={companies} /></Row>
        <Row><Input label="Email" v={f.email} onChange={set("email")} type="email" /><Input label="Phone" v={f.phone} onChange={set("phone")} /></Row>
        <Row><Input label="Role" v={f.role} onChange={set("role")} placeholder="Decision maker" /><Select label="Status" v={f.status} onChange={set("status")} options={["Active","Inactive"]} /></Row>
      </>)}
      {kind === "job" && (<>
        <Input req label="Title" v={f.title} onChange={set("title")} />
        <Row><Pick label="Company" v={f.company_id} onChange={set("company_id")} opts={companies} /><Pick label="Hiring contact" v={f.contact_id} onChange={set("contact_id")} opts={contacts} /></Row>
        <Row><Input label="Location" v={f.location} onChange={set("location")} /><Input label="Type" v={f.type} onChange={set("type")} placeholder="Contract" /></Row>
        <Row><Input label="Pay rate" v={f.pay_rate} onChange={set("pay_rate")} placeholder="$75/hr" /><Input label="Bill rate" v={f.bill_rate} onChange={set("bill_rate")} placeholder="$110/hr" /></Row>
        <Row><Input label="Openings" v={f.openings} onChange={set("openings")} type="number" /><Select label="Priority" v={f.priority} onChange={set("priority")} options={["Low","Medium","High","Urgent"]} /></Row>
        <Select label="Status" v={f.status} onChange={set("status")} options={["Open","Sourcing","Interviewing","Offer","Placed","Closed"]} />
      </>)}
      {kind === "candidate" && (<>
        <Input req label="Name" v={f.name} onChange={set("name")} />
        <Row><Input label="Title" v={f.title} onChange={set("title")} /><Input label="Location" v={f.location} onChange={set("location")} /></Row>
        <Row><Input label="Email" v={f.email} onChange={set("email")} type="email" /><Input label="Phone" v={f.phone} onChange={set("phone")} /></Row>
        <Row><Input label="Years" v={f.years} onChange={set("years")} type="number" /><Input label="Desired pay" v={f.desired_pay} onChange={set("desired_pay")} /></Row>
        <Row><Input label="Availability" v={f.availability} onChange={set("availability")} placeholder="2 weeks" /><Input label="Source" v={f.source} onChange={set("source")} /></Row>
        <Input label="Skills (comma separated)" v={f.skills} onChange={set("skills")} placeholder="React, TypeScript, AWS" />
        <Select label="Status" v={f.status} onChange={set("status")} options={["Active","Passive","Placed","Unavailable"]} />
      </>)}
      {kind === "submission" && (<>
        <Pick req label="Candidate" v={f.candidate_id} onChange={set("candidate_id")} opts={candidates} />
        <Pick req label="Job" v={f.job_id} onChange={set("job_id")} opts={jobs} />
        <Row><Input label="Rate" v={f.rate} onChange={set("rate")} placeholder="$95/hr" /><Select label="Status" v={f.status} onChange={set("status")} options={["Draft","Submitted","Client reviewed","Interview requested","Offer pending","Placed","Rejected"]} /></Row>
        <TextArea label="Notes / feedback" v={f.feedback} onChange={set("feedback")} />
      </>)}
      {kind === "interview" && (<>
        <Pick req label="Candidate" v={f.candidate_id} onChange={set("candidate_id")} opts={candidates} />
        <Pick req label="Job" v={f.job_id} onChange={set("job_id")} opts={jobs} />
        <Pick label="Interviewer" v={f.contact_id} onChange={set("contact_id")} opts={contacts} />
        <Row><Input req label="When" v={f.scheduled_at} onChange={set("scheduled_at")} type="datetime-local" /><Select label="Format" v={f.format} onChange={set("format")} options={["Video","Phone","Onsite"]} /></Row>
        <Select label="Status" v={f.status} onChange={set("status")} options={["Scheduled","Completed","Cancelled","No-show"]} />
      </>)}
      {kind === "placement" && (<>
        <Pick req label="Candidate" v={f.candidate_id} onChange={set("candidate_id")} opts={candidates} />
        <Pick req label="Job" v={f.job_id} onChange={set("job_id")} opts={jobs} />
        <Row><Input req label="Start date" v={f.start_date} onChange={set("start_date")} type="date" /><Input label="End date" v={f.end_date} onChange={set("end_date")} type="date" /></Row>
        <Row><Input label="Pay rate" v={f.pay_rate} onChange={set("pay_rate")} placeholder="$75/hr" /><Input label="Bill rate" v={f.bill_rate} onChange={set("bill_rate")} placeholder="$110/hr" /></Row>
        <Row><Input label="Margin" v={f.margin} onChange={set("margin")} placeholder="$35/hr" /><Select label="Type" v={f.type} onChange={set("type")} options={["Contract","Contract-to-hire","Direct hire"]} /></Row>
        <Select label="Status" v={f.status} onChange={set("status")} options={["Pending start","Active","Ended","Cancelled"]} />
      </>)}
      {kind === "task" && (<>
        <Input req label="Title" v={f.title} onChange={set("title")} />
        <Row><Input label="Due" v={f.due_at} onChange={set("due_at")} type="date" /><Select label="Priority" v={f.priority} onChange={set("priority")} options={["Low","Medium","High","Urgent"]} /></Row>
        <Input label="Related to" v={f.related_label} onChange={set("related_label")} placeholder="Acme — Sr Engineer" />
        <Select label="Status" v={f.status} onChange={set("status")} options={["Open","In progress","Completed"]} />
      </>)}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onDone} className="h-9 rounded-md border border-border px-3 text-sm">Cancel</button>
        <button type="submit" disabled={busy} className="h-9 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground disabled:opacity-60">{busy ? "Saving…" : "Create"}</button>
      </div>
    </form>
  );
}

const inputCls = "h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";
function Row({ children }: { children: ReactNode }) { return <div className="grid grid-cols-2 gap-2">{children}</div>; }
function Label({ label, req }: { label: string; req?: boolean }) { return <span className="mb-1 block text-xs font-medium text-foreground">{label}{req && <span className="text-destructive"> *</span>}</span>; }
function Input({ label, req, ...p }: { label: string; req?: boolean; v?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value">) {
  return <label className="block"><Label label={label} req={req} /><input className={inputCls} required={req} value={p.v ?? ""} {...p} /></label>;
}
function TextArea({ label, ...p }: { label: string; v?: string } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value">) {
  return <label className="block"><Label label={label} /><textarea className={inputCls + " h-20 py-1.5"} value={p.v ?? ""} {...p} /></label>;
}
function Select({ label, options, ...p }: { label: string; options: string[]; v?: string } & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value">) {
  return <label className="block"><Label label={label} /><select className={inputCls} value={p.v ?? ""} {...p}><option value="">Select…</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>;
}
function Pick({ label, opts, req, ...p }: { label: string; opts: Option[]; req?: boolean; v?: string } & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value">) {
  return <label className="block"><Label label={label} req={req} /><select className={inputCls} required={req} value={p.v ?? ""} {...p}><option value="">Select…</option>{opts.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></label>;
}
