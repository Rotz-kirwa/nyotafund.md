import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, ArrowDownToLine, ArrowLeft,
} from "lucide-react";
import { Logo } from "./components/Logo";
import { TransactionRecord } from "./types";

// Import modular sub-components from local directory
import { StatsCards } from "./components/StatsCards";
import { SettlementChart } from "./components/SettlementChart";
import { ReconciliationLedger } from "./components/ReconciliationLedger";
import { GatewaySettings } from "./components/GatewaySettings";
import { FinancialAnalytics } from "./components/FinancialAnalytics";

export function App() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ledger" | "analytics" | "settings">("ledger");

  async function fetchTransactions() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/transactions");
      const result = await res.json() as { success: boolean; data: TransactionRecord[] };
      if (result.success) {
        setTransactions(result.data);
      }
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
    // Auto refresh ledger every 10 seconds for premium live operation feel
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  async function handleReconcile(transactionId: string, newStatus: "paid" | "failed") {
    setReconcilingId(transactionId);
    try {
      const res = await fetch("/api/admin/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, status: newStatus }),
      });
      const data = await res.json() as { success: boolean };
      if (data.success) {
        // Optimistic UI state update
        setTransactions((prev) =>
          prev.map((t) => (t.transaction_id === transactionId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReconcilingId(null);
    }
  }

  // Calculate Metrics based on live database state
  const totalTransactions = transactions.length;
  const paidTransactions = transactions.filter((t) => t.status === "paid");
  const totalFeesCollected = paidTransactions.reduce((sum, t) => sum + t.fee_amount, 0);
  const successRate = totalTransactions > 0 ? Math.round((paidTransactions.length / totalTransactions) * 100) : 100;
  
  // Total loan payouts approved estimate (based on package tiers)
  const totalLoanPayoutsValue = paidTransactions.reduce((sum, t) => {
    if (t.package_id === "starter") return sum + 15000;
    if (t.package_id === "growth") return sum + 75000;
    if (t.package_id === "business-boost") return sum + 225000;
    if (t.package_id === "elite") return sum + 425000;
    return sum + 10000;
  }, 0);

  // Exporter to CSV
  function downloadCSV() {
    const headers = ["ID", "Name", "Phone", "National ID", "Package", "Fee Amount (KSh)", "Status", "Transaction ID", "Created At"];
    const rows = transactions.map((t) => [
      t.id,
      t.name,
      t.phone,
      t.national_id,
      t.package_id.toUpperCase(),
      t.fee_amount,
      t.status.toUpperCase(),
      t.transaction_id,
      new Date(t.created_at).toLocaleString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NyotaCredit_Financial_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Build root homepage URL dynamic host resolver
  const mainSiteUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":8080" : "");

  const fade = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -15 } };

  return (
    <div className="min-h-screen relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg, #040d07 0%, #06180c 45%, #050f08 100%)" }}>
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full opacity-10 blur-[130px] pointer-events-none" style={{ background: "#22c55e" }} />
      <div className="absolute -bottom-40 -left-20 w-[35rem] h-[35rem] rounded-full opacity-5 blur-[120px] pointer-events-none" style={{ background: "#f59e0b" }} />
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <a href={mainSiteUrl} className="h-9 w-9 rounded-xl glass grid place-items-center text-white/60 hover:text-white transition-all cursor-pointer">
            <ArrowLeft size={16} />
          </a>
          <Logo dark size={30} />
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full border border-green-500/30 text-green-400 bg-green-500/10">
            System Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab("ledger")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === "ledger" ? "bg-green-500/10 text-green-400 border border-green-500/30" : "text-white/60 hover:text-white"}`}
          >
            Ledger
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === "analytics" ? "bg-green-500/10 text-green-400 border border-green-500/30" : "text-white/60 hover:text-white"}`}
          >
            Analytics & Recording
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === "settings" ? "bg-green-500/10 text-green-400 border border-green-500/30" : "text-white/60 hover:text-white"}`}
          >
            Gateway Settings
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              Financial Control <span style={{ background: "linear-gradient(90deg,#22c55e,#86efac)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dashboard</span>
            </h1>
            <p className="text-sm text-white/50 mt-1">Real-time M-Pesa transaction auditing, stats, and portal settings.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchTransactions}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border border-white/10 hover:border-white/20 bg-white/5 transition-all text-white/80 hover:text-white active:scale-95 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-green-400" : ""} /> Refresh
            </button>
            <button
              onClick={downloadCSV}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02] bg-gradient-to-r from-green-400 to-emerald-500 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <ArrowDownToLine size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* ── Stats Summary Cards ── */}
        <StatsCards
          totalFeesCollected={totalFeesCollected}
          totalLoanPayoutsValue={totalLoanPayoutsValue}
          successRate={successRate}
          totalTransactions={totalTransactions}
        />

        {/* ── Dynamic Tab Layouts ── */}
        <AnimatePresence mode="wait">
          {activeTab === "ledger" && (
            <motion.div key="ledger" {...fade}>
              
              {/* Custom Settlement Wave Chart */}
              <SettlementChart />

              {/* Transactions Ledger */}
              <ReconciliationLedger
                transactions={transactions}
                loading={loading}
                onReconcile={handleReconcile}
                reconcilingId={reconcilingId}
              />

            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div key="analytics" {...fade}>
              
              {/* Automated Aggregations, Neon Charts, and Manual Recording forms */}
              <FinancialAnalytics
                transactions={transactions}
                onRefresh={fetchTransactions}
              />

            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div key="settings" {...fade}>
              
              {/* Gateway Parameters Configuration */}
              <GatewaySettings />

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
