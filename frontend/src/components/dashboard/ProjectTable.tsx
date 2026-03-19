import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert } from "lucide-react";

type RiskLevel = "critical" | "high" | "medium" | "low";

interface Project {
  id: string;
  name: string;
  lead: string;
  risk: RiskLevel;
  score: number;
  progress: number;
  issues: number;
  deadline: string;
}

const projects: Project[] = [
  { id: "PRJ-001", name: "Neural Engine v3", lead: "Sarah Chen", risk: "critical", score: 92, progress: 34, issues: 12, deadline: "Mar 15" },
  { id: "PRJ-002", name: "Data Pipeline Refactor", lead: "James Ko", risk: "high", score: 76, progress: 58, issues: 7, deadline: "Apr 02" },
  { id: "PRJ-003", name: "Auth Service Migration", lead: "Priya Sharma", risk: "medium", score: 48, progress: 72, issues: 3, deadline: "Mar 28" },
  { id: "PRJ-004", name: "ML Model Optimization", lead: "Alex Rivera", risk: "low", score: 21, progress: 89, issues: 1, deadline: "Apr 10" },
  { id: "PRJ-005", name: "Cloud Infra Scaling", lead: "Mia Zhang", risk: "high", score: 71, progress: 45, issues: 9, deadline: "Mar 22" },
  { id: "PRJ-006", name: "API Gateway Redesign", lead: "Tom Bakker", risk: "medium", score: 55, progress: 61, issues: 4, deadline: "Apr 18" },
];

const riskConfig: Record<RiskLevel, { icon: typeof AlertTriangle; className: string }> = {
  critical: { icon: ShieldAlert, className: "border-destructive/30 bg-destructive/10 text-destructive" },
  high: { icon: AlertTriangle, className: "border-warning/30 bg-warning/10 text-warning" },
  medium: { icon: Clock, className: "border-primary/30 bg-primary/10 text-primary" },
  low: { icon: CheckCircle2, className: "border-success/30 bg-success/10 text-success" },
};

export function ProjectTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg border border-border bg-card"
    >
      <div className="border-b border-border p-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
          Active Projects
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">{projects.length} projects being monitored</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              {["Project", "Lead", "Risk", "Score", "Progress", "Issues", "Deadline"].map((h) => (
                <th key={h} className="px-6 py-3 font-display text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) => {
              const config = riskConfig[project.risk];
              const Icon = config.icon;
              return (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{project.name}</p>
                      <p className="font-display text-[11px] text-muted-foreground">{project.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-foreground">{project.lead}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`gap-1 ${config.className}`}>
                      <Icon className="h-3 w-3" />
                      {project.risk}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-display text-sm font-semibold ${
                      project.score >= 75 ? "text-destructive" :
                      project.score >= 50 ? "text-warning" : "text-success"
                    }`}>
                      {project.score}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="h-1.5 w-20" />
                      <span className="font-display text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-display text-sm text-muted-foreground">{project.issues}</td>
                  <td className="px-6 py-4 font-display text-xs text-muted-foreground">{project.deadline}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
