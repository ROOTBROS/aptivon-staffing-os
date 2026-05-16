export type Status = string;

export const users = [
  { id: "u1", name: "Jordan Reyes", role: "Recruiter", initials: "JR" },
  { id: "u2", name: "Priya Shah", role: "Account Manager", initials: "PS" },
  { id: "u3", name: "Marcus Cole", role: "BDR", initials: "MC" },
  { id: "u4", name: "Sasha Lin", role: "Admin", initials: "SL" },
];

export const companies = [
  { id: "c1", name: "Northwind Logistics", industry: "Logistics", size: "1,200", status: "Active client", owner: "Priya Shah", location: "Chicago, IL", website: "northwind.example", activeJobs: 4, openSubs: 7, lastContact: "2d ago", tier: "Strategic" },
  { id: "c2", name: "Helios Health Systems", industry: "Healthcare", size: "5,400", status: "Active client", owner: "Priya Shah", location: "Boston, MA", website: "helios.example", activeJobs: 6, openSubs: 11, lastContact: "1d ago", tier: "Strategic" },
  { id: "c3", name: "Quantica Robotics", industry: "Manufacturing", size: "320", status: "Prospect", owner: "Marcus Cole", location: "Austin, TX", website: "quantica.example", activeJobs: 0, openSubs: 0, lastContact: "5d ago", tier: "Growth" },
  { id: "c4", name: "Beacon Financial", industry: "Finance", size: "880", status: "Active client", owner: "Jordan Reyes", location: "New York, NY", website: "beacon.example", activeJobs: 3, openSubs: 5, lastContact: "Today", tier: "Strategic" },
  { id: "c5", name: "Verdant Energy", industry: "Energy", size: "2,100", status: "Target account", owner: "Marcus Cole", location: "Denver, CO", website: "verdant.example", activeJobs: 1, openSubs: 2, lastContact: "1w ago", tier: "Growth" },
  { id: "c6", name: "Cobalt Studios", industry: "Media", size: "140", status: "Inactive client", owner: "Priya Shah", location: "Los Angeles, CA", website: "cobalt.example", activeJobs: 0, openSubs: 0, lastContact: "3w ago", tier: "Maintain" },
];

export const contacts = [
  { id: "ct1", name: "Elena Marsh", title: "VP Engineering", company: "Northwind Logistics", companyId: "c1", email: "elena@northwind.example", phone: "(312) 555-0142", role: "Decision maker", status: "Active", owner: "Priya Shah" },
  { id: "ct2", name: "David Okafor", title: "Head of Talent", company: "Helios Health Systems", companyId: "c2", email: "david@helios.example", phone: "(617) 555-0193", role: "Decision maker", status: "Active", owner: "Priya Shah" },
  { id: "ct3", name: "Mei Tanaka", title: "Director of Ops", company: "Quantica Robotics", companyId: "c3", email: "mei@quantica.example", phone: "(512) 555-0188", role: "Influencer", status: "Active", owner: "Marcus Cole" },
  { id: "ct4", name: "Robert Chen", title: "CTO", company: "Beacon Financial", companyId: "c4", email: "rchen@beacon.example", phone: "(212) 555-0166", role: "Decision maker", status: "Active", owner: "Jordan Reyes" },
  { id: "ct5", name: "Aisha Patel", title: "Recruiting Manager", company: "Helios Health Systems", companyId: "c2", email: "aisha@helios.example", phone: "(617) 555-0124", role: "Influencer", status: "Active", owner: "Priya Shah" },
  { id: "ct6", name: "Tom Bradley", title: "VP Operations", company: "Verdant Energy", companyId: "c5", email: "tom@verdant.example", phone: "(303) 555-0117", role: "Decision maker", status: "Active", owner: "Marcus Cole" },
];

export const jobs = [
  { id: "j1", title: "Senior Backend Engineer", company: "Northwind Logistics", companyId: "c1", contact: "Elena Marsh", location: "Chicago, IL (Hybrid)", type: "Full-time", workplace: "Hybrid", openings: 2, payRate: "$72/hr", billRate: "$118/hr", priority: "High", status: "Sourcing", owner: "Jordan Reyes", recruiter: "Jordan Reyes", startDate: "2026-06-15", submitted: 4, interviewing: 2, offers: 0, age: 6 },
  { id: "j2", title: "RN — ICU Night Shift", company: "Helios Health Systems", companyId: "c2", contact: "David Okafor", location: "Boston, MA", type: "Contract", workplace: "On-site", openings: 5, payRate: "$58/hr", billRate: "$94/hr", priority: "Urgent", status: "Interviewing", owner: "Priya Shah", recruiter: "Priya Shah", startDate: "2026-06-01", submitted: 11, interviewing: 4, offers: 2, age: 12 },
  { id: "j3", title: "Robotics Controls Engineer", company: "Quantica Robotics", companyId: "c3", contact: "Mei Tanaka", location: "Austin, TX", type: "Full-time", workplace: "On-site", openings: 1, payRate: "—", billRate: "—", priority: "Medium", status: "Open", owner: "Marcus Cole", recruiter: "Jordan Reyes", startDate: "2026-07-01", submitted: 0, interviewing: 0, offers: 0, age: 2 },
  { id: "j4", title: "Quantitative Analyst", company: "Beacon Financial", companyId: "c4", contact: "Robert Chen", location: "New York, NY (Hybrid)", type: "Full-time", workplace: "Hybrid", openings: 1, payRate: "—", billRate: "—", priority: "High", status: "Offer", owner: "Jordan Reyes", recruiter: "Jordan Reyes", startDate: "2026-06-22", submitted: 6, interviewing: 3, offers: 1, age: 18 },
  { id: "j5", title: "Field Service Technician", company: "Verdant Energy", companyId: "c5", contact: "Tom Bradley", location: "Denver, CO", type: "Contract-to-hire", workplace: "On-site", openings: 3, payRate: "$42/hr", billRate: "$71/hr", priority: "Medium", status: "Sourcing", owner: "Priya Shah", recruiter: "Priya Shah", startDate: "2026-06-10", submitted: 2, interviewing: 1, offers: 0, age: 4 },
  { id: "j6", title: "Data Platform Lead", company: "Beacon Financial", companyId: "c4", contact: "Robert Chen", location: "Remote", type: "Full-time", workplace: "Remote", openings: 1, payRate: "—", billRate: "—", priority: "High", status: "Open", owner: "Jordan Reyes", recruiter: "Jordan Reyes", startDate: "2026-07-08", submitted: 3, interviewing: 0, offers: 0, age: 1 },
  { id: "j7", title: "Pharmacy Tech", company: "Helios Health Systems", companyId: "c2", contact: "Aisha Patel", location: "Boston, MA", type: "Contract", workplace: "On-site", openings: 4, payRate: "$28/hr", billRate: "$48/hr", priority: "Medium", status: "Open", owner: "Priya Shah", recruiter: "Priya Shah", startDate: "2026-06-05", submitted: 1, interviewing: 0, offers: 0, age: 3 },
];

export const candidates = [
  { id: "k1", name: "Aaron Webb", title: "Senior Go Engineer", location: "Chicago, IL", availability: "2 weeks", desiredPay: "$140k", status: "Available", source: "Referral", owner: "Jordan Reyes", skills: ["Go", "Kubernetes", "AWS", "PostgreSQL"], years: 8, lastContact: "Today" },
  { id: "k2", name: "Brianna Wells, RN", title: "ICU Registered Nurse", location: "Boston, MA", availability: "Immediate", desiredPay: "$62/hr", status: "Interviewing", source: "Job board", owner: "Priya Shah", skills: ["ICU", "ACLS", "BLS", "Epic"], years: 6, lastContact: "1d ago" },
  { id: "k3", name: "Carlos Mendes", title: "Robotics Engineer", location: "Austin, TX", availability: "30 days", desiredPay: "$155k", status: "Active", source: "Sourced", owner: "Jordan Reyes", skills: ["ROS", "C++", "Python", "Motion planning"], years: 7, lastContact: "3d ago" },
  { id: "k4", name: "Devika Rao", title: "Quant Researcher", location: "New York, NY", availability: "Immediate", desiredPay: "$210k", status: "Interviewing", source: "Inbound", owner: "Jordan Reyes", skills: ["Python", "C++", "Statistics", "Kdb+"], years: 9, lastContact: "Today" },
  { id: "k5", name: "Evan Brooks", title: "Field Service Tech", location: "Denver, CO", availability: "Immediate", desiredPay: "$44/hr", status: "Available", source: "Referral", owner: "Priya Shah", skills: ["HVAC", "Solar", "Electrical", "Diagnostics"], years: 5, lastContact: "2d ago" },
  { id: "k6", name: "Fatima Yusuf", title: "Backend Engineer", location: "Remote", availability: "2 weeks", desiredPay: "$135k", status: "Active", source: "LinkedIn", owner: "Jordan Reyes", skills: ["Node.js", "TypeScript", "AWS", "GraphQL"], years: 6, lastContact: "4d ago" },
  { id: "k7", name: "Greg Halverson", title: "Data Engineer", location: "Remote", availability: "1 month", desiredPay: "$160k", status: "Passive", source: "Sourced", owner: "Jordan Reyes", skills: ["Spark", "Snowflake", "dbt", "Python"], years: 10, lastContact: "1w ago" },
  { id: "k8", name: "Hana Okafor", title: "Pharmacy Tech", location: "Boston, MA", availability: "Immediate", desiredPay: "$30/hr", status: "Available", source: "Job board", owner: "Priya Shah", skills: ["Retail Rx", "Compounding", "PTCB"], years: 4, lastContact: "Today" },
  { id: "k9", name: "Iris Patel", title: "Staff Engineer", location: "Chicago, IL", availability: "2 weeks", desiredPay: "$185k", status: "Active", source: "Referral", owner: "Jordan Reyes", skills: ["Go", "Distributed systems", "AWS"], years: 11, lastContact: "Yesterday" },
  { id: "k10", name: "Jamal Reed", title: "Senior RN", location: "Boston, MA", availability: "30 days", desiredPay: "$60/hr", status: "Placed", source: "Referral", owner: "Priya Shah", skills: ["ICU", "ER", "ACLS"], years: 9, lastContact: "1w ago" },
];

export const submissions = [
  { id: "s1", candidate: "Aaron Webb", candidateId: "k1", job: "Senior Backend Engineer", jobId: "j1", company: "Northwind Logistics", submittedBy: "Jordan Reyes", submittedAt: "2026-05-12", rate: "$72/hr", status: "Client reviewed", feedback: "Strong infra background, schedule screen." },
  { id: "s2", candidate: "Iris Patel", candidateId: "k9", job: "Senior Backend Engineer", jobId: "j1", company: "Northwind Logistics", submittedBy: "Jordan Reyes", submittedAt: "2026-05-13", rate: "—", status: "Submitted", feedback: "" },
  { id: "s3", candidate: "Brianna Wells, RN", candidateId: "k2", job: "RN — ICU Night Shift", jobId: "j2", company: "Helios Health Systems", submittedBy: "Priya Shah", submittedAt: "2026-05-10", rate: "$62/hr", status: "Interview requested", feedback: "Wants onsite interview Friday." },
  { id: "s4", candidate: "Devika Rao", candidateId: "k4", job: "Quantitative Analyst", jobId: "j4", company: "Beacon Financial", submittedBy: "Jordan Reyes", submittedAt: "2026-05-08", rate: "—", status: "Offer pending", feedback: "Top choice, offer being prepared." },
  { id: "s5", candidate: "Evan Brooks", candidateId: "k5", job: "Field Service Technician", jobId: "j5", company: "Verdant Energy", submittedBy: "Priya Shah", submittedAt: "2026-05-14", rate: "$44/hr", status: "Submitted", feedback: "" },
  { id: "s6", candidate: "Fatima Yusuf", candidateId: "k6", job: "Data Platform Lead", jobId: "j6", company: "Beacon Financial", submittedBy: "Jordan Reyes", submittedAt: "2026-05-15", rate: "—", status: "Submitted", feedback: "" },
  { id: "s7", candidate: "Hana Okafor", candidateId: "k8", job: "Pharmacy Tech", jobId: "j7", company: "Helios Health Systems", submittedBy: "Priya Shah", submittedAt: "2026-05-15", rate: "$30/hr", status: "Submitted", feedback: "" },
  { id: "s8", candidate: "Carlos Mendes", candidateId: "k3", job: "Robotics Controls Engineer", jobId: "j3", company: "Quantica Robotics", submittedBy: "Jordan Reyes", submittedAt: "2026-05-14", rate: "—", status: "Draft", feedback: "" },
];

export const interviews = [
  { id: "i1", candidate: "Brianna Wells, RN", job: "RN — ICU Night Shift", company: "Helios Health Systems", contact: "David Okafor", datetime: "2026-05-17 10:00", format: "Onsite", status: "Scheduled", outcome: "" },
  { id: "i2", candidate: "Devika Rao", job: "Quantitative Analyst", company: "Beacon Financial", contact: "Robert Chen", datetime: "2026-05-16 14:00", format: "Video", status: "Completed", outcome: "Advance to final" },
  { id: "i3", candidate: "Aaron Webb", job: "Senior Backend Engineer", company: "Northwind Logistics", contact: "Elena Marsh", datetime: "2026-05-18 11:30", format: "Video", status: "Scheduled", outcome: "" },
  { id: "i4", candidate: "Iris Patel", job: "Senior Backend Engineer", company: "Northwind Logistics", contact: "Elena Marsh", datetime: "2026-05-19 09:00", format: "Phone", status: "Scheduled", outcome: "" },
  { id: "i5", candidate: "Jamal Reed", job: "RN — ICU Night Shift", company: "Helios Health Systems", contact: "David Okafor", datetime: "2026-05-09 13:00", format: "Onsite", status: "Completed", outcome: "Offer extended" },
];

export const placements = [
  { id: "p1", candidate: "Jamal Reed", job: "RN — ICU Night Shift", company: "Helios Health Systems", type: "Contract", startDate: "2026-05-20", endDate: "2026-11-20", payRate: "$60/hr", billRate: "$96/hr", margin: "$36/hr", status: "Pending start", owner: "Priya Shah" },
  { id: "p2", candidate: "Liam Foster", job: "Sr. Data Engineer", company: "Beacon Financial", type: "Full-time", startDate: "2026-04-15", endDate: "—", payRate: "$172k", billRate: "25% fee", margin: "$43k fee", status: "Active", owner: "Jordan Reyes" },
  { id: "p3", candidate: "Maya Singh", job: "Warehouse Lead", company: "Northwind Logistics", type: "Contract-to-hire", startDate: "2026-03-10", endDate: "2026-09-10", payRate: "$34/hr", billRate: "$58/hr", margin: "$24/hr", status: "Active", owner: "Priya Shah" },
  { id: "p4", candidate: "Noah Adams", job: "DevOps Engineer", company: "Northwind Logistics", type: "Contract", startDate: "2026-02-01", endDate: "2026-06-01", payRate: "$78/hr", billRate: "$128/hr", margin: "$50/hr", status: "Active", owner: "Jordan Reyes" },
  { id: "p5", candidate: "Olivia Park", job: "Solar Tech II", company: "Verdant Energy", type: "Contract", startDate: "2026-01-05", endDate: "2026-04-30", payRate: "$40/hr", billRate: "$66/hr", margin: "$26/hr", status: "Completed", owner: "Priya Shah" },
];

export const tasks = [
  { id: "t1", title: "Call Elena Marsh re: backend role intake", owner: "Jordan Reyes", related: "Northwind Logistics", due: "Today", priority: "High", status: "Open" },
  { id: "t2", title: "Send shortlist for ICU Night Shift", owner: "Priya Shah", related: "RN — ICU Night Shift", due: "Today", priority: "High", status: "In progress" },
  { id: "t3", title: "Schedule onsite for Brianna Wells", owner: "Priya Shah", related: "Brianna Wells, RN", due: "Tomorrow", priority: "Medium", status: "Open" },
  { id: "t4", title: "Follow up on Devika Rao offer", owner: "Jordan Reyes", related: "Devika Rao", due: "Yesterday", priority: "High", status: "Overdue" },
  { id: "t5", title: "Prep submission packet for Aaron Webb", owner: "Jordan Reyes", related: "Aaron Webb", due: "Today", priority: "Medium", status: "Open" },
  { id: "t6", title: "Discovery call: Quantica Robotics", owner: "Marcus Cole", related: "Quantica Robotics", due: "This week", priority: "Medium", status: "Open" },
  { id: "t7", title: "Verify credentials — Jamal Reed", owner: "Sasha Lin", related: "Jamal Reed placement", due: "This week", priority: "High", status: "Open" },
  { id: "t8", title: "Weekly client check-in: Beacon Financial", owner: "Jordan Reyes", related: "Beacon Financial", due: "Friday", priority: "Low", status: "Open" },
];

export const activities = [
  { id: "a1", type: "Submission", subject: "Aaron Webb → Sr. Backend Engineer", who: "Jordan Reyes", when: "2h ago" },
  { id: "a2", type: "Note", subject: "Client wants 5 RN onsites this week", who: "Priya Shah", when: "3h ago" },
  { id: "a3", type: "Interview", subject: "Devika Rao final round scheduled", who: "Jordan Reyes", when: "5h ago" },
  { id: "a4", type: "Stage", subject: "Brianna Wells → Interview requested", who: "Priya Shah", when: "Yesterday" },
  { id: "a5", type: "Placement", subject: "Jamal Reed placement created", who: "Priya Shah", when: "Yesterday" },
  { id: "a6", type: "Call", subject: "Discovery — Quantica Robotics", who: "Marcus Cole", when: "2d ago" },
];

export const statusTone: Record<string, string> = {
  // jobs
  "Open": "info",
  "Sourcing": "info",
  "Interviewing": "warn",
  "Offer": "warn",
  "Filled": "success",
  "On hold": "muted",
  "Closed": "muted",
  // candidates
  "Available": "success",
  "Active": "info",
  "Passive": "muted",
  "Placed": "success",
  "Unavailable": "muted",
  // submissions
  "Draft": "muted",
  "Submitted": "info",
  "Client reviewed": "info",
  "Interview requested": "warn",
  "Rejected": "danger",
  "Offer pending": "warn",
  // companies
  "Active client": "success",
  "Prospect": "info",
  "Inactive client": "muted",
  "Target account": "warn",
  // tasks / interviews / placements
  "Open ": "info",
  "In progress": "warn",
  "Completed": "success",
  "Overdue": "danger",
  "Scheduled": "info",
  "Pending start": "warn",
  // priority
  "Urgent": "danger",
  "High": "warn",
  "Medium": "info",
  "Low": "muted",
};