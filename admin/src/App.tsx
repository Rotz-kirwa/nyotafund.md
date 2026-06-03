import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { TransactionRecord } from "./types";
import { Sidebar, AdminPage } from "./components/Sidebar";
import { Overview } from "./components/Overview";
import { UsersPage } from "./components/UsersPage";
import { FinancialAnalytics } from "./components/FinancialAnalytics";
import { ReconciliationLedger } from "./components/ReconciliationLedger";
import { GatewaySettings } from "./components/GatewaySettings";

const PAGE_TITLES: Record<AdminPage, { title: string; sub: string }> = {
  overview:  { title: "Overview",   sub: "Platform-wide snapshot" },
  users:     { title: "Users",      sub: "All registered applicants & M-Pesa records" },
  analytics: { title: "Analytics",  sub: "Financial trends and fee aggregations" },
  records:   { title: "Records",    sub: "Reconciliation ledger and audit log" },
  settings:  { title: "Settings",   sub: "Gateway configuration and routing" },
};

export function App() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading]           = useState(true);
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);
  const [activePage, setActivePage]     = useState<AdminPage>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/transactions");
      const result = await res.json() as { success: boolean; data: TransactionRecord[] };
      if (result.success) setTransactions(result.data);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
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

  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } };

  return (
    <div className="flex min-h-screen text-white" style={{ background: "linear-gradient(135deg,#040d07 0%,#06180c 45%,#050f08 100%)" }}>

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        totalTransactions={transactions.length}
        pendingCount={pendingCount}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div>
            <h1 className="text-lg font-bold text-white">{PAGE_TITLES[activePage].title}</h1>
            <p className="text-xs text-white/40">{PAGE_TITLES[activePage].sub}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Live
            </div>
            <button
              onClick={fetchTransactions}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold border border-white/10 hover:border-white/20 bg-white/5 transition-all text-white/80 hover:text-white cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-green-400" : ""} />
              Refresh
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activePage === "overview" && (
              <motion.div key="overview" {...fade}>
                <Overview transactions={transactions} />
              </motion.div>
            )}

            {activePage === "users" && (
              <motion.div key="users" {...fade}>
                <UsersPage
                  transactions={transactions}
                  loading={loading}
                  onReconcile={handleReconcile}
                  reconcilingId={reconcilingId}
                />
              </motion.div>
            )}

            {activePage === "analytics" && (
              <motion.div key="analytics" {...fade}>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Analytics</h2>
                  <p className="text-sm text-white/40 mb-6">Financial trends, fee aggregations, and manual recording.</p>
                </div>
                <FinancialAnalytics transactions={transactions} onRefresh={fetchTransactions} />
              </motion.div>
            )}

            {activePage === "records" && (
              <motion.div key="records" {...fade}>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-white">Records</h2>
                  <p className="text-sm text-white/40 mt-0.5">Reconciliation ledger and full audit log.</p>
                </div>
                <ReconciliationLedger
                  transactions={transactions}
                  loading={loading}
                  onReconcile={handleReconcile}
                  reconcilingId={reconcilingId}
                />
              </motion.div>
            )}

            {activePage === "settings" && (
              <motion.div key="settings" {...fade}>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-white">Settings</h2>
                  <p className="text-sm text-white/40 mt-0.5">M-Pesa gateway configuration and routing.</p>
                </div>
                <GatewaySettings />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
