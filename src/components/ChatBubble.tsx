import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, Sparkles, RotateCcw, ChevronDown, ChevronRight, Wrench } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What jobs are urgent right now?",
  "Who's interviewing this week?",
  "Show me my overdue tasks",
  "Draft a candidate outreach email for a React role",
];

const transport = new DefaultChatTransport({
  api: "/api/chat",
  headers: async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

export function ChatBubble() {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    id: chatId,
    transport,
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open, messages.length, status]);

  if (!session) return null;

  function submit(text?: string) {
    const value = (text ?? input).trim();
    if (!value || status === "submitted" || status === "streaming") return;
    setInput("");
    void sendMessage({ text: value });
  }

  function reset() {
    setMessages([]);
    setChatId(crypto.randomUUID());
  }

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105"
          aria-label="Open AI assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[600px] max-h-[calc(100vh-3rem)] w-[400px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 text-sidebar-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Aptivon Assistant</div>
                <div className="text-[11px] text-sidebar-foreground/60">AI-powered · reads your data</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                className="rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                aria-label="New conversation"
                title="New conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ask about your pipeline, draft outreach, or get a quick summary.
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="rounded-md border border-border bg-background px-3 py-2 text-left text-xs text-foreground hover:bg-muted"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <MessageBlock key={m.id} message={m} />
            ))}

            {status === "submitted" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                Thinking…
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error.message || "Something went wrong."}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="border-t border-border bg-background p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder="Ask anything about your pipeline…"
                className="max-h-32 min-h-[40px] flex-1 resize-none rounded-md border border-input bg-card px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

type AnyMessage = ReturnType<typeof useChat>["messages"][number];

function MessageBlock({ message }: { message: AnyMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] space-y-2 text-sm",
          isUser
            ? "rounded-2xl rounded-br-sm bg-accent px-3 py-2 text-accent-foreground"
            : "text-foreground",
        )}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <div key={i} className="markdown-body break-words text-sm leading-relaxed [&_p]:my-1 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[12px] [&_a]:underline">
                <ReactMarkdown>{part.text}</ReactMarkdown>
              </div>
            );
          }
          if (part.type?.startsWith("tool-")) {
            return <ToolPart key={i} part={part as ToolPartShape} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}

type ToolPartShape = {
  type: string;
  state?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

function ToolPart({ part }: { part: ToolPartShape }) {
  const [openDetails, setOpenDetails] = useState(false);
  const name = part.type.replace(/^tool-/, "");
  const state = part.state ?? "input-streaming";
  const isDone = state === "output-available";
  const isError = state === "output-error";
  const label =
    isError ? "Error" : isDone ? "Done" : state === "input-available" ? "Running…" : "Preparing…";
  return (
    <div className="rounded-md border border-border bg-muted/40 text-xs">
      <button
        type="button"
        onClick={() => setOpenDetails((o) => !o)}
        className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left"
      >
        {openDetails ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <Wrench className="h-3 w-3 text-muted-foreground" />
        <span className="font-medium text-foreground">{name}</span>
        <span className={cn("ml-auto text-[10px] uppercase tracking-wide", isError ? "text-destructive" : "text-muted-foreground")}>
          {label}
        </span>
      </button>
      {openDetails && (
        <div className="space-y-2 border-t border-border px-2.5 py-2">
          {part.input != null && (
            <div>
              <div className="mb-0.5 text-[10px] font-semibold uppercase text-muted-foreground">Input</div>
              <pre className="max-h-40 overflow-auto rounded bg-background p-2 text-[11px]">{JSON.stringify(part.input, null, 2)}</pre>
            </div>
          )}
          {part.output != null && (
            <div>
              <div className="mb-0.5 text-[10px] font-semibold uppercase text-muted-foreground">Result</div>
              <pre className="max-h-40 overflow-auto rounded bg-background p-2 text-[11px]">{JSON.stringify(part.output, null, 2)}</pre>
            </div>
          )}
          {part.errorText && (
            <div className="text-destructive">{part.errorText}</div>
          )}
        </div>
      )}
    </div>
  );
}