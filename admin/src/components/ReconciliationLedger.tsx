import { useState } from "react";
import {
  Search, RefreshCw, AlertCircle, Calendar,
  Lock, CheckCircle2, XCircle
} from "lucide-react";
import { TransactionRecord } from "@/types";

interface ReconciliationLedgerProps {
  transactions: TransactionRecord[];
  loading: boolean;
  onReconcile: (transactionId: string, status: "paid" | "failed") => Promise<void>;
  reconcilingId: string | null;
}

export function ReconciliationLedger({
  transactions,
  loading,
  onReconcile,
  reconcilingId,
}: ReconciliationLedgerProps) {
  const [search, setSearch] = useState("");
  const [pkgFilter, setPkgFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredList = transactions.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search) ||
      t.national_id.includes(search) ||
      t.transaction_id.toLowerCase().includes(search.toLowerCase());

    const matchesPkg = pkgFilter === "all" || t.package_id === pkgFilter;
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;

    return matchesSearch && matchesPkg && matchesStatus;
  });

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
      
      {/* Filters Row */}
      <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 h-4.5 w-4.5" />
          <input
            type="text"
            placeholder="Search Client Name, Phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 outline-none focus:border-green-500/40 text-white placeholder-white/30 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Package filter */}
          <div className="flex items-center gap-1.5 bg-white/5 rounded-xl border border-white/10 px-3 py-1.5">
            <span className="text-xs text-white/40">Tier:</span>
            <select 
              value={pkgFilter}
              onChange={(e) => setPkgFilter(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold outline-none border-none cursor-pointer"
            >
              <option value="all" className="bg-[#050f08]">All Tiers</option>
              <option value="starter" className="bg-[#050f08]">Starter</option>
              <option value="growth" className="bg-[#050f08]">Growth</option>
              <option value="business-boost" className="bg-[#050f08]">Business Boost</option>
              <option value="elite" className="bg-[#050f08]">Elite</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-white/5 rounded-xl border border-white/10 px-3 py-1.5">
            <span className="text-xs text-white/40">Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold outline-none border-none cursor-pointer"
            >
              <option value="all" className="bg-[#050f08]">All Status</option>
              <option value="paid" className="bg-[#050f08]">Paid</option>
              <option value="pending" className="bg-[#050f08]">Pending</option>
              <option value="failed" className="bg-[#050f08]">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-white/40" style={{ background: "rgba(255,255,255,0.01)" }}>
              <th className="px-6 py-4">Client Info</th>
              <th className="px-6 py-4">ID Details</th>
              <th className="px-6 py-4">Package</th>
              <th className="px-6 py-4">Gateway Fee</th>
              <th className="px-6 py-4">Reference / Txn ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                  <RefreshCw size={24} className="animate-spin mx-auto text-green-400 mb-2" />
                  Loading Ledger Database...
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                  <AlertCircle size={24} className="mx-auto text-yellow-500 mb-2" />
                  No transactions found matching the parameters.
                </td>
              </tr>
            ) : (
              filteredList.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-white/40 mt-0.5">{t.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white/80 font-mono text-xs">{t.national_id}</div>
                    <div className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5">
                      <Calendar size={10} /> {new Date(t.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md uppercase"
                          style={{
                            background: t.package_id === "elite" ? "rgba(217,119,6,0.15)" : "rgba(34,197,94,0.1)",
                            color: t.package_id === "elite" ? "#fbbf24" : "#4ade80",
                            border: t.package_id === "elite" ? "1px solid rgba(217,119,6,0.3)" : "1px solid rgba(34,197,94,0.2)"
                          }}>
                      {t.package_id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">KSh {t.fee_amount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-mono text-white/70 bg-white/5 rounded px-2 py-1 inline-block border border-white/5">
                      {t.transaction_id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {t.status === "paid" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Paid
                      </span>
                    )}
                    {t.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" /> Pending
                      </span>
                    )}
                    {t.status === "failed" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" /> Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {t.status === "pending" ? (
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => onReconcile(t.transaction_id, "paid")}
                          disabled={reconcilingId === t.transaction_id}
                          className="p-1.5 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition disabled:opacity-50 cursor-pointer"
                          title="Approve Settlement"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <button
                          onClick={() => onReconcile(t.transaction_id, "failed")}
                          disabled={reconcilingId === t.transaction_id}
                          className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50 cursor-pointer"
                          title="Fail Settlement"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-white/20 font-medium">Reconciled</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Count */}
      <div className="p-4 border-t border-white/5 text-xs text-white/40 flex justify-between items-center">
        <div>Showing {filteredList.length} of {transactions.length} auditing rows</div>
        <div className="flex items-center gap-1">
          <Lock size={10} className="text-green-500" /> Database Live Sync
        </div>
      </div>
    </div>
  );
}
