import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
  { month: "Jan", high: 4, medium: 8, low: 12 },
  { month: "Feb", high: 3, medium: 10, low: 14 },
  { month: "Mar", high: 6, medium: 9, low: 11 },
  { month: "Apr", high: 5, medium: 12, low: 10 },
  { month: "May", high: 8, medium: 7, low: 13 },
  { month: "Jun", high: 4, medium: 11, low: 15 },
  { month: "Jul", high: 7, medium: 9, low: 12 },
  { month: "Aug", high: 3, medium: 13, low: 16 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-2 font-display text-xs text-muted-foreground">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: <span className="font-display font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

export function RiskChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-lg border border-border bg-card p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
            Risk Trend
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">8-month overview across all projects</p>
        </div>
        <div className="flex gap-4">
          {[
            { label: "High", color: "bg-destructive" },
            { label: "Medium", color: "bg-warning" },
            { label: "Low", color: "bg-success" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(36, 90%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(36, 90%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(152, 60%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(152, 60%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
          <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} fontFamily="JetBrains Mono" />
          <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} fontFamily="JetBrains Mono" />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="high" name="High" stroke="hsl(0, 72%, 55%)" fill="url(#highGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="medium" name="Medium" stroke="hsl(36, 90%, 55%)" fill="url(#medGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="low" name="Low" stroke="hsl(152, 60%, 45%)" fill="url(#lowGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
