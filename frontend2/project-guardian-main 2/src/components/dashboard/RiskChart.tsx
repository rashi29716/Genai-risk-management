import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import type { Project, RiskLevel } from "@/components/dashboard/dashboard-data";
import { getProjectChartData } from "@/components/dashboard/dashboard-data";

interface RiskChartProps {
  projects: Project[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { fullName: string; risk: RiskLevel; id: string } }>;
}

const riskColors: Record<RiskLevel, string> = {
  critical: "hsl(var(--destructive))",
  high: "hsl(var(--warning))",
  medium: "hsl(var(--primary))",
  low: "hsl(var(--success))",
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  const value = payload[0].value;

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="font-display text-xs text-muted-foreground">{item.id}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{item.fullName}</p>
      <p className="mt-2 text-sm" style={{ color: riskColors[item.risk] }}>
        Risk score: <span className="font-display font-semibold">{value}</span>
      </p>
    </div>
  );
};

export function RiskChart({ projects }: RiskChartProps) {
  const data = getProjectChartData(projects);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-lg border border-border bg-card p-6"
    >
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
            Live Risk Graph
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Every new project input is analyzed and plotted instantly.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(riskColors).map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs capitalize text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} fontFamily="JetBrains Mono" />
          <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} fontFamily="JetBrains Mono" />
          <Tooltip cursor={{ fill: "hsl(var(--secondary) / 0.45)" }} content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.id} fill={riskColors[entry.risk]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
