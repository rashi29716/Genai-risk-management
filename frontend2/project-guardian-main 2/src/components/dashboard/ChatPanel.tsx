import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import type { Project } from "@/components/dashboard/dashboard-data";
import { getHighestRiskProject } from "@/components/dashboard/dashboard-data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  projects: Project[];
}

function buildSummary(projects: Project[]) {
  const highest = getHighestRiskProject(projects);
  return highest
    ? `I'm tracking **${projects.length} projects**. The highest risk project is **${highest.name}** with a score of **${highest.score}** and **${highest.risk}** severity.`
    : "No projects are loaded yet.";
}

function getResponse(input: string, projects: Project[]) {
  const lower = input.toLowerCase();
  const match = projects.find(
    (project) => lower.includes(project.name.toLowerCase()) || lower.includes(project.id.toLowerCase()),
  );

  if (match) {
    return [
      `**${match.name} (${match.id})**`,
      `- Delay: **${match.delay}**`,
      `- Payment: **${match.payment}**`,
      `- Resources: **${match.resources}**`,
      `- Risk score: **${match.score}**`,
      `- Risk level: **${match.risk}**`,
    ].join("\n");
  }

  if (lower.includes("risk") || lower.includes("highest") || lower.includes("critical")) {
    const risky = [...projects].sort((a, b) => b.score - a.score).slice(0, 3);
    return [
      `Top live risks right now:`,
      ...risky.map((project) => `- **${project.name}** — score **${project.score}**, payment **${project.payment}**, resources **${project.resources}**`),
    ].join("\n\n");
  }

  return `${buildSummary(projects)}\n\nAsk about any project in the table for details.`;
}

export function ChatPanel({ projects }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I can answer based on the current live project list and your latest inputs." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = () => {
    if (!input.trim()) return;

    const currentInput = input;
    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getResponse(currentInput, projects) }]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex h-full flex-col rounded-lg border border-border bg-card"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-primary">AI Analyst</h2>
          <p className="text-[10px] text-muted-foreground">Synced with live project input</p>
        </div>
        <div className="ml-auto h-2 w-2 animate-pulse-glow rounded-full bg-success" />
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${msg.role === "assistant" ? "bg-primary/10" : "bg-secondary"}`}>
                {msg.role === "assistant" ? <Bot className="h-3.5 w-3.5 text-primary" /> : <User className="h-3.5 w-3.5 text-secondary-foreground" />}
              </div>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${msg.role === "assistant" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}>
                <div className="prose prose-sm max-w-none break-words text-inherit prose-p:my-1 prose-strong:text-inherit prose-ul:my-1 prose-li:my-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-2">
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-2">
        {["Which project is highest risk?", "Project summary", "Tell me about PRJ-001"].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="shrink-0 rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <form onSubmit={(event) => { event.preventDefault(); send(); }} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about any listed project..."
            className="flex-1 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
