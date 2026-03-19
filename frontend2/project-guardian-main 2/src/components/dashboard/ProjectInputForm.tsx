import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NewProjectInput, PaymentStatus } from "@/components/dashboard/dashboard-data";

const paymentOptions: PaymentStatus[] = ["paid", "partial", "pending", "blocked"];

const projectSchema = z.object({
  name: z.string().trim().min(2, "Project name is required").max(80, "Use 80 characters or less"),
  delay: z.coerce.number().min(0, "Delay must be 0 or more").max(100, "Keep delay within 100"),
  payment: z.enum(["paid", "partial", "pending", "blocked"]),
  resources: z.coerce.number().int("Use a whole number").min(1, "Minimum 1").max(10, "Maximum 10"),
});

type FormState = {
  name: string;
  delay: string;
  payment: PaymentStatus;
  resources: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  delay: "0",
  payment: "pending",
  resources: "5",
};

interface ProjectInputFormProps {
  onAddProject: (project: NewProjectInput) => void;
}

export function ProjectInputForm({ onAddProject }: ProjectInputFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = projectSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const project = projectSchema.parse(form) as NewProjectInput;
    onAddProject(project);
    setForm(initialState);
    setErrors({});
    toast.success("Project analyzed and added to the dashboard.");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-border bg-card p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
            Analyze New Project
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Uses the same backend-style inputs: project name, delay, payment status, and resources.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          <PlusCircle className="h-4 w-4 text-primary" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-xs text-muted-foreground">
            <span>Project name</span>
            <Input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Quantum Forecast"
            />
            {errors.name ? <p className="text-[11px] text-destructive">{errors.name}</p> : null}
          </label>

          <label className="space-y-2 text-xs text-muted-foreground">
            <span>Delay</span>
            <Input
              type="number"
              min={0}
              max={100}
              value={form.delay}
              onChange={(event) => updateField("delay", event.target.value)}
              placeholder="35"
            />
            {errors.delay ? <p className="text-[11px] text-destructive">{errors.delay}</p> : null}
          </label>

          <label className="space-y-2 text-xs text-muted-foreground">
            <span>Payment</span>
            <select
              value={form.payment}
              onChange={(event) => updateField("payment", event.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {paymentOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {errors.payment ? <p className="text-[11px] text-destructive">{errors.payment}</p> : null}
          </label>

          <label className="space-y-2 text-xs text-muted-foreground">
            <span>Resources</span>
            <Input
              type="number"
              min={1}
              max={10}
              value={form.resources}
              onChange={(event) => updateField("resources", event.target.value)}
              placeholder="5"
            />
            {errors.resources ? <p className="text-[11px] text-destructive">{errors.resources}</p> : null}
          </label>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            New input is scored instantly and pushed into both the table and chart.
          </p>
          <Button type="submit" className="md:min-w-40">
            Analyze & add
          </Button>
        </div>
      </form>
    </motion.section>
  );
}
