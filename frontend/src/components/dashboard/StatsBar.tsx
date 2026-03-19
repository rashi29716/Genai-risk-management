import { motion } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Projects", value: "24", icon: Activity, trend: "+3 this month", color: "text-primary" },
  { label: "Critical Risks", value: "4", icon: AlertTriangle, trend: "↑ 2 from last week", color: "text-destructive" },
  { label: "Avg Risk Score", value: "58", icon: TrendingUp, trend: "↓ 5% improvement", color: "text-warning" },
  { label: "On Track", value: "16", icon: CheckCircle2, trend: "67% of portfolio", color: "text-success" },
];

export function StatsBar() {
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
