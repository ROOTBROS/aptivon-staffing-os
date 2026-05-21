import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, tool, type UIMessage } from "ai";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM = `You are Aptivon Assistant, an AI helper embedded in the Aptivon staffing ATS + CRM.
You help recruiters quickly understand their pipeline: jobs, candidates, submissions, interviews, tasks, companies, and contacts.
Use the provided tools to look up the user's actual data before answering questions about their pipeline.
Be concise, use markdown lists and bold sparingly, and never invent records that the tools did not return.
If a question is unrelated to staffing data, answer briefly from general knowledge.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!apiKey) return new Response("LOVABLE_API_KEY missing", { status: 500 });
        if (!supabaseUrl || !supabaseKey) return new Response("Supabase env missing", { status: 500 });

        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = authHeader.slice(7);
        const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
        if (claimsErr || !claims?.claims?.sub) {
          return new Response("Unauthorized", { status: 401 });
        }

        const body = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }

        const gateway = createLovableAiGatewayProvider(apiKey);
        const model = gateway("google/gemini-3-flash-preview");

        const tools = {
          listJobs: tool({
            description: "List jobs in the user's ATS. Filter by status (Open, On Hold, Closed) or priority (Urgent, High, Medium, Low).",
            inputSchema: z.object({
              status: z.string().optional(),
              priority: z.string().optional(),
              limit: z.number().min(1).max(50).default(20),
            }),
            execute: async ({ status, priority, limit }) => {
              let q = supabase.from("jobs").select("id,title,location,status,priority,openings,created_at,company_id").order("created_at", { ascending: false }).limit(limit);
              if (status) q = q.eq("status", status);
              if (priority) q = q.eq("priority", priority);
              const { data, error } = await q;
              if (error) return { error: error.message };
              return { jobs: data ?? [] };
            },
          }),
          listCandidates: tool({
            description: "List candidates. Optional name search and status filter.",
            inputSchema: z.object({
              search: z.string().optional(),
              status: z.string().optional(),
              limit: z.number().min(1).max(50).default(20),
            }),
            execute: async ({ search, status, limit }) => {
              let q = supabase.from("candidates").select("id,name,title,location,status,availability,skills").limit(limit);
              if (search) q = q.ilike("name", `%${search}%`);
              if (status) q = q.eq("status", status);
              const { data, error } = await q;
              if (error) return { error: error.message };
              return { candidates: data ?? [] };
            },
          }),
          listSubmissions: tool({
            description: "List recent submissions of candidates to jobs.",
            inputSchema: z.object({
              status: z.string().optional(),
              limit: z.number().min(1).max(50).default(20),
            }),
            execute: async ({ status, limit }) => {
              let q = supabase.from("submissions").select("id,candidate_id,job_id,status,submitted_at").order("submitted_at", { ascending: false }).limit(limit);
              if (status) q = q.eq("status", status);
              const { data, error } = await q;
              if (error) return { error: error.message };
              return { submissions: data ?? [] };
            },
          }),
          listInterviews: tool({
            description: "List upcoming or recent interviews.",
            inputSchema: z.object({
              upcomingOnly: z.boolean().default(true),
              limit: z.number().min(1).max(50).default(20),
            }),
            execute: async ({ upcomingOnly, limit }) => {
              let q = supabase.from("interviews").select("id,candidate_id,job_id,scheduled_at,format,status").order("scheduled_at", { ascending: true }).limit(limit);
              if (upcomingOnly) q = q.gte("scheduled_at", new Date().toISOString());
              const { data, error } = await q;
              if (error) return { error: error.message };
              return { interviews: data ?? [] };
            },
          }),
          listTasks: tool({
            description: "List open or overdue tasks for the user.",
            inputSchema: z.object({
              overdueOnly: z.boolean().default(false),
              limit: z.number().min(1).max(50).default(20),
            }),
            execute: async ({ overdueOnly, limit }) => {
              let q = supabase.from("tasks").select("id,title,priority,status,due_at").neq("status", "Completed").order("due_at", { ascending: true }).limit(limit);
              if (overdueOnly) q = q.lt("due_at", new Date().toISOString());
              const { data, error } = await q;
              if (error) return { error: error.message };
              return { tasks: data ?? [] };
            },
          }),
          listCompanies: tool({
            description: "List companies (clients) in the CRM.",
            inputSchema: z.object({
              search: z.string().optional(),
              limit: z.number().min(1).max(50).default(20),
            }),
            execute: async ({ search, limit }) => {
              let q = supabase.from("companies").select("id,name,industry,location,status,tier").limit(limit);
              if (search) q = q.ilike("name", `%${search}%`);
              const { data, error } = await q;
              if (error) return { error: error.message };
              return { companies: data ?? [] };
            },
          }),
          listContacts: tool({
            description: "List contacts at client companies.",
            inputSchema: z.object({
              search: z.string().optional(),
              limit: z.number().min(1).max(50).default(20),
            }),
            execute: async ({ search, limit }) => {
              let q = supabase.from("contacts").select("id,name,title,email,company_id,status").limit(limit);
              if (search) q = q.ilike("name", `%${search}%`);
              const { data, error } = await q;
              if (error) return { error: error.message };
              return { contacts: data ?? [] };
            },
          }),
        };

        const result = streamText({
          model,
          system: SYSTEM,
          tools,
          stopWhen: stepCountIs(50),
          messages: await convertToModelMessages(body.messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: body.messages });
      },
    },
  },
});