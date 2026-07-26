import { DashboardStat } from "@/data/admin";

export default function StatCard({ label, value, hint }: DashboardStat) {
  return (
    <div className="flex flex-col gap-3 border border-hairline p-6 transition-colors duration-300 hover:border-ink">
      <span className="label-tag">{label}</span>
      <p className="font-display text-4xl font-medium text-ink">{value}</p>
      <p className="text-xs text-charcoal/60">{hint}</p>
    </div>
  );
}
