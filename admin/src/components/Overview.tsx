import { TrendingUp, Users, CheckCircle2, Clock, Wallet, ArrowUpRight } from "lucide-react";
import { TransactionRecord } from "@/types";
import { SettlementChart } from "./SettlementChart";

interface OverviewProps {
  transactions: TransactionRecord[];
}

const PKG_LOAN: Record<string, number> = {
  starter: 15000,
  growth: 75000,
  "business-boost": 225000,
  elite: 425000,
};

export function Overview({ transactions }: OverviewProps) {
  const paid    = transactions.filter((t) => t.status === "paid");
  const pending = transactions.filter((t) => t.status === "pending");
  const failed  = transactions.filter((t) => t.status === "failed");

  const totalFees    = paid.reduce((s, t) => s + t.fee_amount, 0);
  const totalLoans   = paid.reduce((s, t) => s + (PKG_LOAN[t.package_id] ?? 10000), 0);
  const successRate  = transactions.length > 0 ? Math.round((paid.length / transactions.length) * 100) : 100;

  const stats = [
    { label: "Total Fees Collected", value: `KSh ${totalFees.toLocaleString()}`,  sub: `${paid.length} paid txns`,          icon: Wallet,       color: "#10b981" },
    { label: "Loan Disbursements",   value: `KSh ${totalLoans.toLocaleString()}`, sub: "Est. capital value",                  icon: TrendingUp,   color: "#f59e0b" },
    { label: "Total Users",          value: `${transactions.length}`,             sub: `${pending.length} pending`,           icon: Users,        color: "#3b82f6" },
    { label: "Success Rate",         value: `${successRate}%`,                   sub: `${failed.length} failed`,             icon: CheckCircle2, color: "#a855f7" },
  ];

  // Package breakdown
  const pkgCounts = transactions.reduce<Record<string, { count: number; fees: number }>>((acc, t) => {
    if (!acc[t.package_id]) acc[t.package_id] = { count: 0, fees: 0 };
    acc[t.package_id].count++;
    if (t.status === "paid") acc[t.package_id].fees += t.fee_amount;
    return acc;
  }, {});

  const PKG_COLOR: Record<string, string> = {
    starter: "#10b981",
    growth: "#3b82f6",
    "business-boost": "#f59e0b",
    elite: "#a855f7",
  };

  // Recent 5 transactions
  const recent = [...transactions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Overview</h2>
        <p className="text-sm text-white/40 mt-0.5">Real-time snapshot of NyotaCredit operations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-5 border border-white/5 bg-white/[0.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 blur-2xl pointer-events-none" style={{ background: s.color }} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{s.label}</span>
              <div className="h-7 w-7 rounded-lg grid place-items-center" style={{ background: `${s.color}18`, border: `1px solid ${s.color}25` }}>
                <s.icon size={14} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-[11px] text-white/30 mt-1 flex items-center gap-1">
              <Clock size={9} /> {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Settlement chart */}
      <SettlementChart />

      {/* Bottom row: Package breakdown + Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Package Breakdown */}
        <div className="rounded-2xl p-5 border border-white/5 bg-white/[0.02]">
          <h3 className="text-sm font-bold text-white mb-4">Package Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(pkgCounts).map(([pkg, data]) => {
              const pct = transactions.length > 0 ? Math.round((data.count / transactions.length) * 100) : 0;
              const color = PKG_COLOR[pkg] ?? "#10b981";
              return (
                <div key={pkg}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-white capitalize">{pkg.replace("-", " ")}</span>
                    <span className="text-white/40">{data.count} users · KSh {data.fees.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl p-5 border border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Recent Activity</h3>
            <ArrowUpRight size={14} className="text-white/30" />
          </div>
          <div className="space-y-3">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full grid place-items-center flex-shrink-0 text-xs font-bold text-white"
                  style={{ background: t.status === "paid" ? "rgba(16,185,129,0.15)" : t.status === "pending" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)" }}>
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{t.name}</div>
                  <div className="text-[10px] text-white/40">{t.phone} · {t.package_id}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold" style={{ color: t.status === "paid" ? "#10b981" : t.status === "pending" ? "#f59e0b" : "#ef4444" }}>
                    KSh {t.fee_amount}
                  </div>
                  <div className="text-[10px] text-white/30">{t.status}</div>
                </div>
              </div>
            ))}
            {recent.length === 0 && <p className="text-xs text-white/30 text-center py-4">No transactions yet</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
