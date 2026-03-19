import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  default: "I'm monitoring **6 active projects**. The highest risk is **Neural Engine v3** (PRJ-001) with a critical risk score of 92. Want me to drill into a specific project?",
  risk: "Currently, **2 projects** are at high risk or above:\n\n- **Neural Engine v3** — Score: 92 (Critical), 12 open issues\n- **Cloud Infra Scaling** — Score: 71 (High), 9 open issues\n\nI recommend prioritizing resource allocation to these immediately.",
  neural: "**Neural Engine v3 (PRJ-001)**\n\n- Risk Score: 92/100 (Critical)\n- Progress: 34%\n- Lead: Sarah Chen\n- Open Issues: 12\n- Deadline: Mar 15\n\n⚠️ This project is significantly behind schedule with a high number of unresolved issues. Key concerns include dependency conflicts and compute resource constraints.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("neural") || lower.includes("prj-001")) return MOCK_RESPONSES.neural;
  if (lower.includes("risk") || lower.includes("critical") || lower.includes("high")) return MOCK_RESPONSES.risk;
  return MOCK_RESPONSES.default;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI Risk Analyst. Ask me about project risks, trends, or specific projects." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getResponse(input) }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex h-full flex-col rounded-lg border border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-primary">AI Analyst</h2>
          <p className="text-[10px] text-muted-foreground">Online</p>
        </div>
        <div className="ml-auto h-2 w-2 animate-pulse-glow rounded-full bg-success" />
      </div>

      {/* Messages */}
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
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                msg.role === "assistant" ? "bg-primary/10" : "bg-secondary"
              }`}>
                {msg.role === "assistant" ? <Bot className="h-3.5 w-3.5 text-primary" /> : <User className="h-3.5 w-3.5 text-secondary-foreground" />}
              </div>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground"
              }`}>
                {msg.content.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1" : ""}>
                    {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={k} className="font-semibold">{part.slice(2, -2)}</strong>
                      ) : part
                    )}
                  </p>
                ))}
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
              {[0, 1, 2].map((d) => (
                <motion.div
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-2">
        {["What are the highest risks?", "Tell me about Neural Engine", "Project summary"].map((s) => (
          <button
            key={s}
            onClick={() => { setInput(s); }}
            className="shrink-0 rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about project risks..."
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
