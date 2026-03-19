import { motion } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import type { Project } from "@/components/dashboard/dashboard-data";

interface StatsBarProps {
  projects: Project[];
}

export function StatsBar({ projects }: StatsBarProps) {
  const criticalCount = projects.filter((project) => project.risk === "critical").length;
  const lowRiskCount = projects.filter((project) => project.risk === "low").length;
  const averageRisk = Math.round(projects.reduce((sum, project) => sum + project.score, 0) / projects.length);
  const pendingPayments = projects.filter((project) => project.payment === "pending" || project.payment === "blocked").length;

  const stats = [
    { label: "Total Projects", value: String(projects.length), icon: Activity, trend: "Live portfolio count", color: "text-primary" },
    { label: "Critical Risks", value: String(criticalCount), icon: AlertTriangle, trend: "Highest severity projects", color: "text-destructive" },
    { label: "Avg Risk Score", value: String(averageRisk), icon: TrendingUp, trend: "Calculated from current inputs", color: "text-warning" },
    { label: "Payment Watch", value: String(pendingPayments), icon: CheckCircle2, trend: `${lowRiskCount} projects currently low risk`, color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className={`mt-2 font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{stat.trend}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
