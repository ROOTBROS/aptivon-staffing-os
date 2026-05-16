import { supabase } from "@/integrations/supabase/client";

export async function seedSampleData(userId: string) {
  // Bail if already seeded
  const { count } = await supabase.from("companies").select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) return { skipped: true as const };

  const companies = [
    { name: "Northwind Logistics", industry: "Logistics", size: "1,200", status: "Active client", tier: "Strategic", location: "Chicago, IL", website: "northwind.example" },
    { name: "Helios Health Systems", industry: "Healthcare", size: "5,400", status: "Active client", tier: "Strategic", location: "Boston, MA", website: "helios.example" },
    { name: "Quantica Robotics", industry: "Manufacturing", size: "320", status: "Prospect", tier: "Growth", location: "Austin, TX", website: "quantica.example" },
    { name: "Beacon Financial", industry: "Finance", size: "880", status: "Active client", tier: "Strategic", location: "New York, NY", website: "beacon.example" },
    { name: "Verdant Energy", industry: "Energy", size: "2,100", status: "Target account", tier: "Growth", location: "Denver, CO", website: "verdant.example" },
  ].map((c) => ({ ...c, owner_id: userId, created_by: userId, last_contact_at: new Date().toISOString() }));
  const { data: companyRows, error: cErr } = await supabase.from("companies").insert(companies).select();
  if (cErr) throw cErr;
  const co = Object.fromEntries(companyRows!.map((c) => [c.name, c.id]));

  const contacts = [
    { name: "Elena Marsh", title: "VP Engineering", company_id: co["Northwind Logistics"], email: "elena@northwind.example", phone: "(312) 555-0142", role: "Decision maker" },
    { name: "David Okafor", title: "Head of Talent", company_id: co["Helios Health Systems"], email: "david@helios.example", phone: "(617) 555-0193", role: "Decision maker" },
    { name: "Mei Tanaka", title: "Director of Ops", company_id: co["Quantica Robotics"], email: "mei@quantica.example", phone: "(512) 555-0188", role: "Influencer" },
    { name: "Robert Chen", title: "CTO", company_id: co["Beacon Financial"], email: "rchen@beacon.example", phone: "(212) 555-0166", role: "Decision maker" },
    { name: "Tom Bradley", title: "VP Operations", company_id: co["Verdant Energy"], email: "tom@verdant.example", phone: "(303) 555-0117", role: "Decision maker" },
  ].map((c) => ({ ...c, status: "Active", owner_id: userId, created_by: userId }));
  const { data: contactRows, error: ctErr } = await supabase.from("contacts").insert(contacts).select();
  if (ctErr) throw ctErr;
  const ct = Object.fromEntries(contactRows!.map((c) => [c.name, c.id]));

  const jobs = [
    { title: "Senior Backend Engineer", company_id: co["Northwind Logistics"], contact_id: ct["Elena Marsh"], location: "Chicago, IL (Hybrid)", type: "Full-time", workplace: "Hybrid", openings: 2, pay_rate: "$72/hr", bill_rate: "$118/hr", priority: "High", status: "Sourcing", start_date: "2026-06-15" },
    { title: "RN — ICU Night Shift", company_id: co["Helios Health Systems"], contact_id: ct["David Okafor"], location: "Boston, MA", type: "Contract", workplace: "On-site", openings: 5, pay_rate: "$58/hr", bill_rate: "$94/hr", priority: "Urgent", status: "Interviewing", start_date: "2026-06-01" },
    { title: "Robotics Controls Engineer", company_id: co["Quantica Robotics"], contact_id: ct["Mei Tanaka"], location: "Austin, TX", type: "Full-time", workplace: "On-site", openings: 1, priority: "Medium", status: "Open", start_date: "2026-07-01" },
    { title: "Quantitative Analyst", company_id: co["Beacon Financial"], contact_id: ct["Robert Chen"], location: "New York, NY (Hybrid)", type: "Full-time", workplace: "Hybrid", openings: 1, priority: "High", status: "Offer", start_date: "2026-06-22" },
    { title: "Field Service Technician", company_id: co["Verdant Energy"], contact_id: ct["Tom Bradley"], location: "Denver, CO", type: "Contract-to-hire", workplace: "On-site", openings: 3, pay_rate: "$42/hr", bill_rate: "$71/hr", priority: "Medium", status: "Sourcing", start_date: "2026-06-10" },
    { title: "Data Platform Lead", company_id: co["Beacon Financial"], contact_id: ct["Robert Chen"], location: "Remote", type: "Full-time", workplace: "Remote", openings: 1, priority: "High", status: "Open", start_date: "2026-07-08" },
  ].map((j) => ({ ...j, owner_id: userId, recruiter_id: userId, created_by: userId }));
  const { data: jobRows, error: jErr } = await supabase.from("jobs").insert(jobs).select();
  if (jErr) throw jErr;
  const jo = Object.fromEntries(jobRows!.map((j) => [j.title, j.id]));

  const candidates = [
    { name: "Aaron Webb", title: "Senior Go Engineer", location: "Chicago, IL", availability: "2 weeks", desired_pay: "$140k", status: "Available", source: "Referral", years: 8, skills: ["Go","Kubernetes","AWS","PostgreSQL"] },
    { name: "Brianna Wells, RN", title: "ICU Registered Nurse", location: "Boston, MA", availability: "Immediate", desired_pay: "$62/hr", status: "Interviewing", source: "Job board", years: 6, skills: ["ICU","ACLS","BLS","Epic"] },
    { name: "Carlos Mendes", title: "Robotics Engineer", location: "Austin, TX", availability: "30 days", desired_pay: "$155k", status: "Active", source: "Sourced", years: 7, skills: ["ROS","C++","Python"] },
    { name: "Devika Rao", title: "Quant Researcher", location: "New York, NY", availability: "Immediate", desired_pay: "$210k", status: "Interviewing", source: "Inbound", years: 9, skills: ["Python","C++","Statistics"] },
    { name: "Evan Brooks", title: "Field Service Tech", location: "Denver, CO", availability: "Immediate", desired_pay: "$44/hr", status: "Available", source: "Referral", years: 5, skills: ["HVAC","Solar","Electrical"] },
    { name: "Fatima Yusuf", title: "Backend Engineer", location: "Remote", availability: "2 weeks", desired_pay: "$135k", status: "Active", source: "LinkedIn", years: 6, skills: ["Node.js","TypeScript","AWS"] },
    { name: "Iris Patel", title: "Staff Engineer", location: "Chicago, IL", availability: "2 weeks", desired_pay: "$185k", status: "Active", source: "Referral", years: 11, skills: ["Go","Distributed systems"] },
    { name: "Jamal Reed", title: "Senior RN", location: "Boston, MA", availability: "30 days", desired_pay: "$60/hr", status: "Placed", source: "Referral", years: 9, skills: ["ICU","ER","ACLS"] },
  ].map((k) => ({ ...k, owner_id: userId, created_by: userId, last_contact_at: new Date().toISOString() }));
  const { data: candRows, error: kErr } = await supabase.from("candidates").insert(candidates).select();
  if (kErr) throw kErr;
  const ca = Object.fromEntries(candRows!.map((c) => [c.name, c.id]));

  const today = new Date().toISOString().slice(0, 10);
  const submissions = [
    { candidate_id: ca["Aaron Webb"], job_id: jo["Senior Backend Engineer"], rate: "$72/hr", status: "Client reviewed", feedback: "Strong infra background." },
    { candidate_id: ca["Iris Patel"], job_id: jo["Senior Backend Engineer"], status: "Submitted" },
    { candidate_id: ca["Brianna Wells, RN"], job_id: jo["RN — ICU Night Shift"], rate: "$62/hr", status: "Interview requested", feedback: "Wants onsite Friday." },
    { candidate_id: ca["Devika Rao"], job_id: jo["Quantitative Analyst"], status: "Offer pending", feedback: "Top choice." },
    { candidate_id: ca["Evan Brooks"], job_id: jo["Field Service Technician"], rate: "$44/hr", status: "Submitted" },
    { candidate_id: ca["Fatima Yusuf"], job_id: jo["Data Platform Lead"], status: "Submitted" },
  ].map((s) => ({ ...s, submitted_at: today, submitted_by: userId, created_by: userId }));
  await supabase.from("submissions").insert(submissions);

  const interviews = [
    { candidate_id: ca["Brianna Wells, RN"], job_id: jo["RN — ICU Night Shift"], contact_id: ct["David Okafor"], scheduled_at: new Date(Date.now() + 86400000).toISOString(), format: "Onsite", status: "Scheduled" },
    { candidate_id: ca["Devika Rao"], job_id: jo["Quantitative Analyst"], contact_id: ct["Robert Chen"], scheduled_at: new Date(Date.now() - 86400000).toISOString(), format: "Video", status: "Completed", outcome: "Advance to final" },
    { candidate_id: ca["Aaron Webb"], job_id: jo["Senior Backend Engineer"], contact_id: ct["Elena Marsh"], scheduled_at: new Date(Date.now() + 2 * 86400000).toISOString(), format: "Video", status: "Scheduled" },
  ].map((i) => ({ ...i, created_by: userId }));
  await supabase.from("interviews").insert(interviews);

  await supabase.from("placements").insert([
    { candidate_id: ca["Jamal Reed"], job_id: jo["RN — ICU Night Shift"], type: "Contract", start_date: "2026-05-20", end_date: "2026-11-20", pay_rate: "$60/hr", bill_rate: "$96/hr", margin: "$36/hr", status: "Pending start", owner_id: userId, created_by: userId },
  ]);

  const tasks = [
    { title: "Call Elena Marsh re: backend role intake", related_label: "Northwind Logistics", due_at: today, priority: "High", status: "Open" },
    { title: "Send shortlist for ICU Night Shift", related_label: "RN — ICU Night Shift", due_at: today, priority: "High", status: "In progress" },
    { title: "Schedule onsite for Brianna Wells", related_label: "Brianna Wells, RN", due_at: today, priority: "Medium", status: "Open" },
    { title: "Follow up on Devika Rao offer", related_label: "Devika Rao", due_at: new Date(Date.now() - 86400000).toISOString().slice(0, 10), priority: "High", status: "Overdue" },
  ].map((t) => ({ ...t, owner_id: userId, created_by: userId }));
  await supabase.from("tasks").insert(tasks);

  await supabase.from("activities").insert([
    { type: "Submission", subject: "Aaron Webb → Senior Backend Engineer", actor_id: userId, created_by: userId },
    { type: "Interview", subject: "Devika Rao final round scheduled", actor_id: userId, created_by: userId },
    { type: "Placement", subject: "Jamal Reed placement created", actor_id: userId, created_by: userId },
  ]);

  return { skipped: false as const };
}