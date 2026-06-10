import { useState, useEffect } from "react";
import { RefreshCw, Menu } from "lucide-react";
import { TransactionRecord } from "./types";
import { Sidebar, AdminPage } from "./components/Sidebar";
import { Overview } from "./components/Overview";
import { UsersPage } from "./components/UsersPage";
import { FinancialAnalytics } from "./components/FinancialAnalytics";
import { ReconciliationLedger } from "./components/ReconciliationLedger";
import { GatewaySettings } from "./components/GatewaySettings";
import { LoginPage } from "./components/LoginPage";
import { apiUrl } from "./lib/api-url";

const PAGE_TITLES: Record<AdminPage, { title: string; sub: string }> = {
  overview:  { title: "Overview",   sub: "Platform-wide snapshot" },
  users:     { title: "Users",      sub: "All registered applicants & M-Pesa records" },
  analytics: { title: "Analytics",  sub: "Financial trends and fee aggregations" },
  records:   { title: "Records",    sub: "Reconciliation ledger and audit log" },
  settings:  { title: "Settings",   sub: "Gateway configuration and routing" },
};

/** Retrieve the admin token stored in sessionStorage after login */
function getToken(): string {
  return sessionStorage.getItem("nyota_admin_token") ?? "";
}

/** Authenticated fetch — attaches the x-admin-secret header */
async function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": getToken(),
      ...(options?.headers ?? {}),
    },
  });
}

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("nyota_admin_auth") === "1"
  );
  const [token, setToken] = useState(() => getToken());
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading]           = useState(true);
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);
  const [activePage, setActivePage]     = useState<AdminPage>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen]             = useState(false);

  function handleLogout() {
    sessionStorage.removeItem("nyota_admin_auth");
    sessionStorage.removeItem("nyota_admin_token");
    setIsAuthenticated(false);
    setToken("");
    setTransactions([]);
  }

  function handleLogin(newToken: string) {
    setToken(newToken);
    setIsAuthenticated(true);
  }

  async function fetchTransactions() {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await adminFetch(apiUrl("/api/admin/transactions"));
      if (res.status === 401) {
        // Token expired or invalid — force re-login
        handleLogout();
        return;
      }
      const result = await res.json() as { success: boolean; data: TransactionRecord[] };
      if (result.success) setTransactions(result.data);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  async function handleReconcile(transactionId: string, newStatus: "paid" | "failed") {
    setReconcilingId(transactionId);
    try {
      const res = await adminFetch(apiUrl("/api/admin/reconcile"), {
        method: "POST",
        body: JSON.stringify({ transactionId, status: newStatus }),
      });
      if (res.status === 401) { handleLogout(); return; }
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

  return (
    <div className="flex min-h-screen text-white" style={{ background: "linear-gradient(135deg,#040d07 0%,#06180c 45%,#050f08 100%)" }}>

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setMobileOpen(false); // Close mobile sidebar on navigation
        }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        totalTransactions={transactions.length}
        pendingCount={pendingCount}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              className="md:hidden p-1.5 -ml-1.5 text-white/70 hover:text-white cursor-pointer"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">{PAGE_TITLES[activePage].title}</h1>
              <p className="text-xs text-white/40 hidden sm:block">{PAGE_TITLES[activePage].sub}</p>
            </div>
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
          {activePage === "overview" && (
            <div key="overview">
              <Overview transactions={transactions} />
            </div>
          )}

          {activePage === "users" && (
            <div key="users">
              <UsersPage
                transactions={transactions}
                loading={loading}
                onReconcile={handleReconcile}
                reconcilingId={reconcilingId}
              />
            </div>
          )}

          {activePage === "analytics" && (
            <div key="analytics">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Analytics</h2>
                <p className="text-sm text-white/40 mb-6">Financial trends, fee aggregations, and manual recording.</p>
              </div>
              <FinancialAnalytics
                transactions={transactions}
                onRefresh={fetchTransactions}
                adminFetch={adminFetch}
              />
            </div>
          )}

          {activePage === "records" && (
            <div key="records">
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
            </div>
          )}

          {activePage === "settings" && (
            <div key="settings">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <p className="text-sm text-white/40 mt-0.5">M-Pesa gateway configuration and routing.</p>
              </div>
              <GatewaySettings />
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
