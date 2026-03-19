import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import type { Project, RiskLevel } from "@/components/dashboard/dashboard-data";

const riskConfig: Record<RiskLevel, { icon: typeof AlertTriangle; className: string }> = {
  critical: { icon: ShieldAlert, className: "border-destructive/30 bg-destructive/10 text-destructive" },
  high: { icon: AlertTriangle, className: "border-warning/30 bg-warning/10 text-warning" },
  medium: { icon: Clock, className: "border-primary/30 bg-primary/10 text-primary" },
  low: { icon: CheckCircle2, className: "border-success/30 bg-success/10 text-success" },
};

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg border border-border bg-card"
    >
      <div className="border-b border-border p-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
          Project List
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">New analyzed projects are inserted instantly.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              {["Project", "Delay", "Payment", "Resources", "Risk", "Score"].map((heading) => (
                <th key={heading} className="px-6 py-3 font-display text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  {heading}
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
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{project.name}</p>
                      <p className="font-display text-[11px] text-muted-foreground">{project.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-display text-sm text-secondary-foreground">{project.delay}</td>
                  <td className="px-6 py-4 font-display text-xs uppercase text-muted-foreground">{project.payment}</td>
                  <td className="px-6 py-4 font-display text-sm text-muted-foreground">{project.resources}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`gap-1 ${config.className}`}>
                      <Icon className="h-3 w-3" />
                      {project.risk}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-display text-sm font-semibold ${
                      project.score >= 80 ? "text-destructive" :
                      project.score >= 60 ? "text-warning" :
                      project.score >= 35 ? "text-primary" : "text-success"
                    }`}>
                      {project.score}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
