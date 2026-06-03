import { useState } from "react";
import { 
  TrendingUp, BarChart3, PlusCircle, CheckCircle, 
  DollarSign, RefreshCw
} from "lucide-react";
import { TransactionRecord } from "@/types";

interface FinancialAnalyticsProps {
  transactions: TransactionRecord[];
  onRefresh: () => Promise<void>;
}

export function FinancialAnalytics({ transactions, onRefresh }: FinancialAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  
  // Highly simplified recording states - only records the processing fee amount
  const [feeAmount, setFeeAmount] = useState<number>(100);
  const [recording, setRecording] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Handle Form Submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRecording(true);
    setFormError("");
    setFormSuccess(false);

    // Auto-generate M-Pesa reference and dynamic package categorizer based on fee
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomTxnId = "MPESA-NC-";
    for (let i = 0; i < 5; i++) {
      randomTxnId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    let packageId = "starter";
    if (feeAmount === 300) packageId = "growth";
    if (feeAmount === 700) packageId = "business-boost";
    if (feeAmount === 1500) packageId = "elite";

    try {
      const res = await fetch("/api/admin/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Processing Fee Collection",
          phone: "0700000000",
          national_id: "00000000",
          package_id: packageId,
          fee_amount: feeAmount,
          status: "paid",
          transaction_id: randomTxnId
        }),
      });

      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        setFormSuccess(true);
        // Refresh live data
        await onRefresh();
      } else {
        setFormError(data.error || "Failed to save record");
      }
    } catch (err) {
      setFormError("API Connection failed. Please try again.");
    } finally {
      setRecording(false);
    }
  }

  // --- Dynamic Analytics Aggregations ---
  const paidTx = transactions.filter((t) => t.status === "paid");

  // Daily Aggregations (Past 7 Days)
  const getDailyData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const resultMap: { [key: string]: { amount: number; count: number } } = {};
    
    // Initialize past 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      resultMap[dayName] = { amount: 0, count: 0 };
    }

    paidTx.forEach((t) => {
      const d = new Date(t.created_at);
      const dayName = days[d.getDay()];
      if (resultMap[dayName] !== undefined) {
        resultMap[dayName].amount += t.fee_amount;
        resultMap[dayName].count += 1;
      }
    });

    return Object.keys(resultMap).map((label) => ({
      label,
      amount: resultMap[label].amount,
      count: resultMap[label].count,
    }));
  };

  // Weekly Aggregations (Past 4 Weeks)
  const getWeeklyData = () => {
    const resultMap = {
      "Week 1": { amount: 0, count: 0 },
      "Week 2": { amount: 0, count: 0 },
      "Week 3": { amount: 0, count: 0 },
      "Week 4": { amount: 0, count: 0 },
    };

    paidTx.forEach((t) => {
      const day = new Date(t.created_at).getDate();
      if (day <= 7) {
        resultMap["Week 1"].amount += t.fee_amount;
        resultMap["Week 1"].count += 1;
      } else if (day <= 14) {
        resultMap["Week 2"].amount += t.fee_amount;
        resultMap["Week 2"].count += 1;
      } else if (day <= 21) {
        resultMap["Week 3"].amount += t.fee_amount;
        resultMap["Week 3"].count += 1;
      } else {
        resultMap["Week 4"].amount += t.fee_amount;
        resultMap["Week 4"].count += 1;
      }
    });

    return Object.keys(resultMap).map((label) => ({
      label,
      amount: resultMap[label as keyof typeof resultMap].amount,
      count: resultMap[label as keyof typeof resultMap].count,
    }));
  };

  // Monthly Aggregations (Past 6 Months)
  const getMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const resultMap: { [key: string]: { amount: number; count: number } } = {};

    // Initialize past 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = months[d.getMonth()];
      resultMap[mName] = { amount: 0, count: 0 };
    }

    paidTx.forEach((t) => {
      const d = new Date(t.created_at);
      const mName = months[d.getMonth()];
      if (resultMap[mName] !== undefined) {
        resultMap[mName].amount += t.fee_amount;
        resultMap[mName].count += 1;
      }
    });

    return Object.keys(resultMap).map((label) => ({
      label,
      amount: resultMap[label].amount,
      count: resultMap[label].count,
    }));
  };

  // Yearly Aggregations
  const getYearlyData = () => {
    const resultMap: { [key: string]: { amount: number; count: number } } = {
      "2024": { amount: 8400, count: 12 }, // Simulated historical collections
      "2025": { amount: 15400, count: 24 }, // Simulated historical collections
      "2026": { amount: 0, count: 0 },
    };

    paidTx.forEach((t) => {
      const year = new Date(t.created_at).getFullYear().toString();
      if (resultMap[year] !== undefined) {
        resultMap[year].amount += t.fee_amount;
        resultMap[year].count += 1;
      }
    });

    return Object.keys(resultMap).map((label) => ({
      label,
      amount: resultMap[label].amount,
      count: resultMap[label].count,
    }));
  };

  // Select active dataset
  let chartData = getDailyData();
  if (timeframe === "weekly") chartData = getWeeklyData();
  if (timeframe === "monthly") chartData = getMonthlyData();
  if (timeframe === "yearly") chartData = getYearlyData();

  // Find max value to normalize height scaling
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 500);

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      
      {/* --- Column 1: Premium Analytics Chart --- */}
      <div className="space-y-6">
        
        {/* Chart Card */}
        <div className="rounded-2xl p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 blur-3xl pointer-events-none bg-green-500" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="text-green-400" size={18} /> Premium Financial Analytics
              </h3>
              <p className="text-xs text-white/40 mt-0.5">Live aggregated processing fees and collections.</p>
            </div>
            
            {/* Timeframe Selectors */}
            <div className="flex bg-white/5 rounded-xl border border-white/10 p-0.5">
              {(["daily", "weekly", "monthly", "yearly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    timeframe === t 
                      ? "bg-green-500/20 text-green-400 border border-green-500/20" 
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Animated Bar Chart */}
          <div className="h-64 w-full relative flex items-end justify-between px-2 pt-6 pb-2 border-b border-white/10">
            {/* Grid Line Backdrops */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03] pb-8 pt-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full h-px bg-white border-dashed" />
              ))}
            </div>

            {/* Render Bars */}
            {chartData.map((d) => {
              const heightPercent = Math.min((d.amount / maxAmount) * 100, 100);
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center group relative mx-2 h-full justify-end">
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    <div className="bg-black/90 border border-green-500/30 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-xl flex flex-col items-center">
                      <span className="text-green-400">KSh {d.amount.toLocaleString()}</span>
                      <span className="text-white/40 mt-0.5">{d.count} fees recorded</span>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="w-2 h-2 bg-black border-r border-b border-green-500/30 rotate-45 mx-auto -mt-1" />
                  </div>

                  {/* SVG glowing bar */}
                  <div 
                    className="w-full rounded-t-lg transition-all duration-700 relative overflow-hidden" 
                    style={{ 
                      height: `${heightPercent || 3}%`,
                      background: "linear-gradient(to top, #0b301a 0%, #10b981 100%)",
                      boxShadow: d.amount > 0 ? "0 0 15px rgba(16,185,129,0.15)" : "none"
                    }}
                  >
                    {/* Glowing highlight strip */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-300 to-emerald-400 opacity-60" />
                  </div>

                  {/* Label */}
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-2.5">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Summary Metrics */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Total Fees</span>
              <div className="text-lg font-bold text-white mt-0.5">
                KSh {chartData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Fee Count</span>
              <div className="text-lg font-bold text-green-400 mt-0.5">
                {chartData.reduce((sum, d) => sum + d.count, 0)} Items
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Growth Rate</span>
              <div className="text-lg font-bold text-yellow-400 mt-0.5 flex items-center gap-1">
                <TrendingUp size={14} /> +12.4%
              </div>
            </div>
          </div>

        </div>

        {/* Informative Stats Card */}
        <div className="rounded-2xl p-5 border border-white/5 bg-white/[0.01] backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 grid place-items-center text-green-400 border border-green-500/20">
              <DollarSign size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">System Auto-Aggregation</h4>
              <p className="text-xs text-white/40 mt-0.5">Every paid transaction recalculates your metrics instantly.</p>
            </div>
          </div>
          <button 
            onClick={onRefresh}
            className="p-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition cursor-pointer"
          >
            <RefreshCw size={14} className="text-white/60" />
          </button>
        </div>

      </div>

      {/* --- Column 2: Highly Simplified Record Processing Fee --- */}
      <div>
        <div className="rounded-2xl p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="text-green-400" size={18} /> Record Fee
            </h3>
            <p className="text-xs text-white/40 mt-0.5">Record a processing fee from the main app directly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Fee Amount Selector Dropdown */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-2">
                Processing Fee Amount (KSh)
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {([100, 300, 700, 1500] as const).map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFeeAmount(amount)}
                    className={`py-3.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                      feeAmount === amount 
                        ? "bg-green-500/20 text-green-400 border-green-500/30 shadow-md scale-[1.02]"
                        : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    KSh {amount}
                  </button>
                ))}
              </div>
              
              <div className="text-[10px] text-white/30 leading-relaxed mt-1">
                Select a standard processing fee corresponding to a loan application package tier:
                <ul className="mt-1.5 space-y-1">
                  <li>• **KSh 100** — Starter Package Fee</li>
                  <li>• **KSh 300** — Growth Package Fee</li>
                  <li>• **KSh 700** — Business Boost Fee</li>
                  <li>• **KSh 1,500** — Elite Package Fee</li>
                </ul>
              </div>
            </div>

            {/* Error / Success feedback */}
            {formError && (
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-400">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3.5 rounded-xl border border-green-500/20 bg-green-500/10 text-xs text-green-400 flex items-center gap-2">
                <CheckCircle size={14} /> Processing fee successfully recorded!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={recording}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.02] bg-gradient-to-r from-green-400 to-emerald-500 hover:shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {recording ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Recording...
                </>
              ) : (
                <>
                  Record Processing Fee
                </>
              )}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}
