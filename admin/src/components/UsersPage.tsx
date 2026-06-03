import { useState } from "react";
import {
  Search, RefreshCw, AlertCircle, Calendar,
  Lock, CheckCircle2, XCircle, Download, Eye,
  Phone, CreditCard, Package, DollarSign, Hash,
} from "lucide-react";
import { TransactionRecord } from "@/types";

interface UsersPageProps {
  transactions: TransactionRecord[];
  loading: boolean;
  onReconcile: (transactionId: string, status: "paid" | "failed") => Promise<void>;
  reconcilingId: string | null;
}

const PKG_COLOR: Record<string, string> = {
  starter: "#10b981",
  growth: "#3b82f6",
  "business-boost": "#f59e0b",
  elite: "#a855f7",
};

const PKG_LOAN: Record<string, string> = {
  starter: "KSh 10k–20k",
  growth: "KSh 50k–100k",
  "business-boost": "KSh 150k–300k",
  elite: "KSh 350k–500k",
};

export function UsersPage({ transactions, loading, onReconcile, reconcilingId }: UsersPageProps) {
  const [search, setSearch]           = useState("");
  const [pkgFilter, setPkgFilter]     = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected]       = useState<TransactionRecord | null>(null);

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.name.toLowerCase().includes(q) ||
      t.phone.includes(q) ||
      t.national_id.includes(q) ||
      t.transaction_id.toLowerCase().includes(q);
    return matchSearch &&
      (pkgFilter === "all" || t.package_id === pkgFilter) &&
      (statusFilter === "all" || t.status === statusFilter);
  });

  function downloadCSV() {
    const headers = ["ID", "Name", "Phone", "National ID", "Package", "Loan Range", "Fee Paid (KSh)", "Transaction ID", "Status", "Date"];
    const rows = filtered.map((t) => [
      t.id, t.name, t.phone, t.national_id,
      t.package_id.toUpperCase(), PKG_LOAN[t.package_id] ?? "-",
      t.fee_amount, t.transaction_id, t.status.toUpperCase(),
      new Date(t.created_at).toLocaleString(),
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = `NyotaCredit_Users_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Users</h2>
          <p className="text-sm text-white/40 mt-0.5">{filtered.length} of {transactions.length} registered applicants</p>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-green-400 to-emerald-500 hover:shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Total",   val: transactions.length,                            color: "#fff"     },
          { label: "Paid",    val: transactions.filter(t => t.status==="paid").length,    color: "#10b981" },
          { label: "Pending", val: transactions.filter(t => t.status==="pending").length, color: "#f59e0b" },
          { label: "Failed",  val: transactions.filter(t => t.status==="failed").length,  color: "#ef4444" },
        ].map((p) => (
          <div key={p.label} className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-white/8 text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.03)", color: p.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
            {p.label}: {p.val}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input
            type="text"
            placeholder="Search by name, phone, national ID, txn ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 outline-none focus:border-green-500/40 text-white placeholder-white/30 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={pkgFilter}
            onChange={(e) => setPkgFilter(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-xs font-semibold bg-white/5 border border-white/10 text-white outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#050f08]">All Packages</option>
            <option value="starter" className="bg-[#050f08]">Starter</option>
            <option value="growth" className="bg-[#050f08]">Growth</option>
            <option value="business-boost" className="bg-[#050f08]">Business Boost</option>
            <option value="elite" className="bg-[#050f08]">Elite</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-xs font-semibold bg-white/5 border border-white/10 text-white outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#050f08]">All Status</option>
            <option value="paid" className="bg-[#050f08]">Paid</option>
            <option value="pending" className="bg-[#050f08]">Pending</option>
            <option value="failed" className="bg-[#050f08]">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-white/30" style={{ background: "rgba(255,255,255,0.015)" }}>
                <th className="px-4 py-3.5"><Hash size={10} className="inline mr-1" />ID</th>
                <th className="px-4 py-3.5"><CreditCard size={10} className="inline mr-1" />Full Name</th>
                <th className="px-4 py-3.5"><Phone size={10} className="inline mr-1" />Phone</th>
                <th className="px-4 py-3.5"><CreditCard size={10} className="inline mr-1" />National ID</th>
                <th className="px-4 py-3.5"><Package size={10} className="inline mr-1" />Package</th>
                <th className="px-4 py-3.5">Loan Range</th>
                <th className="px-4 py-3.5"><DollarSign size={10} className="inline mr-1" />Fee Paid</th>
                <th className="px-4 py-3.5">Txn ID</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5"><Calendar size={10} className="inline mr-1" />Applied</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-white/40">
                    <RefreshCw size={22} className="animate-spin mx-auto text-green-400 mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-white/40">
                    <AlertCircle size={22} className="mx-auto text-yellow-500 mb-2" />
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const color = PKG_COLOR[t.package_id] ?? "#10b981";
                  return (
                    <tr key={t.id} className="hover:bg-white/[0.025] transition-colors">
                      {/* ID */}
                      <td className="px-4 py-3.5 text-white/40 font-mono text-xs">#{t.id}</td>

                      {/* Name + avatar */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full grid place-items-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                            {t.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-white whitespace-nowrap">{t.name}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5 text-white/70 font-mono text-xs whitespace-nowrap">{t.phone}</td>

                      {/* National ID */}
                      <td className="px-4 py-3.5 text-white/70 font-mono text-xs">{t.national_id}</td>

                      {/* Package */}
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase whitespace-nowrap"
                          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                          {t.package_id.replace("-", " ")}
                        </span>
                      </td>

                      {/* Loan Range */}
                      <td className="px-4 py-3.5 text-xs text-white/50 whitespace-nowrap">{PKG_LOAN[t.package_id] ?? "—"}</td>

                      {/* Fee Paid */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-white">KSh {t.fee_amount.toLocaleString()}</span>
                      </td>

                      {/* Txn ID */}
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-mono text-white/50 bg-white/5 rounded px-2 py-0.5 border border-white/5 whitespace-nowrap">
                          {t.transaction_id}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {t.status === "paid" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Paid
                          </span>
                        )}
                        {t.status === "pending" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" /> Pending
                          </span>
                        )}
                        {t.status === "failed" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Failed
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-[10px] text-white/30 whitespace-nowrap">
                        {new Date(t.created_at).toLocaleDateString()}<br />
                        <span className="text-white/20">{new Date(t.created_at).toLocaleTimeString()}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelected(t)}
                            className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={13} />
                          </button>
                          {t.status === "pending" && (
                            <>
                              <button
                                onClick={() => onReconcile(t.transaction_id, "paid")}
                                disabled={reconcilingId === t.transaction_id}
                                className="p-1.5 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition disabled:opacity-50 cursor-pointer"
                                title="Approve"
                              >
                                <CheckCircle2 size={13} />
                              </button>
                              <button
                                onClick={() => onReconcile(t.transaction_id, "failed")}
                                disabled={reconcilingId === t.transaction_id}
                                className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50 cursor-pointer"
                                title="Reject"
                              >
                                <XCircle size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/5 flex justify-between items-center text-[10px] text-white/30">
          <span>Showing {filtered.length} of {transactions.length} users</span>
          <span className="flex items-center gap-1"><Lock size={9} className="text-green-500" /> Live DB Sync</span>
        </div>
      </div>

      {/* User Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelected(null)}>
          <div className="rounded-2xl p-6 w-full max-w-md border border-white/10 relative"
            style={{ background: "#050e07" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-full grid place-items-center text-lg font-bold text-white"
                style={{ background: `${PKG_COLOR[selected.package_id] ?? "#10b981"}22`, border: `1px solid ${PKG_COLOR[selected.package_id] ?? "#10b981"}44` }}>
                {selected.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-white text-lg">{selected.name}</div>
                <div className="text-xs text-white/40">Applicant · #{selected.id}</div>
              </div>
              <button onClick={() => setSelected(null)} className="ml-auto text-white/40 hover:text-white cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Phone",          v: selected.phone },
                { l: "National ID",    v: selected.national_id },
                { l: "Package",        v: selected.package_id.replace("-", " ") },
                { l: "Loan Range",     v: PKG_LOAN[selected.package_id] ?? "—" },
                { l: "Fee Paid",       v: `KSh ${selected.fee_amount}` },
                { l: "Status",         v: selected.status },
                { l: "Transaction ID", v: selected.transaction_id },
                { l: "Applied At",     v: new Date(selected.created_at).toLocaleString() },
              ].map(({ l, v }) => (
                <div key={l} className="rounded-xl p-3 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[10px] text-white/30 mb-0.5">{l}</div>
                  <div className="text-xs font-semibold text-white break-all">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
