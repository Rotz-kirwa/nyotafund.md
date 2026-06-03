import { TrendingUp, Award, ShieldCheck, Layers, Clock } from "lucide-react";

interface StatsCardsProps {
  totalFeesCollected: number;
  totalLoanPayoutsValue: number;
  successRate: number;
  totalTransactions: number;
}

export function StatsCards({
  totalFeesCollected,
  totalLoanPayoutsValue,
  successRate,
  totalTransactions,
}: StatsCardsProps) {
  const cards = [
    { label: "Total Processing Fees", value: `KSh ${(totalFeesCollected).toLocaleString()}`, desc: "Paid gateway fees", icon: TrendingUp, color: "#10b981" },
    { label: "Loan Disbursements", value: `KSh ${(totalLoanPayoutsValue).toLocaleString()}`, desc: "Approved capital value", icon: Award, color: "#fbbf24" },
    { label: "Reconciliation Rate", value: `${successRate}%`, desc: "Total success index", icon: ShieldCheck, color: "#3b82f6" },
    { label: "Audited Accounts", value: `${totalTransactions}`, desc: "Registered applications", icon: Layers, color: "#ec4899" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl p-5 border border-white/5 bg-white/[0.02] relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 blur-2xl pointer-events-none" style={{ background: c.color }} />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">{c.label}</span>
            <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
              <c.icon size={16} style={{ color: c.color }} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-white">{c.value}</div>
          <div className="text-[11px] text-white/30 mt-1.5 flex items-center gap-1">
            <Clock size={10} /> {c.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
