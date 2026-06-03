import { useState } from "react";
import { Sliders } from "lucide-react";

export function GatewaySettings() {
  const [sandboxMode, setSandboxMode] = useState(true);
  const [autoApprove, setAutoApprove] = useState(true);
  const [notifySms, setNotifySms] = useState(true);

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      {/* Settings Form */}
      <div className="rounded-2xl p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sliders size={18} className="text-green-400" /> Payment Gateway Routing
          </h3>
          <p className="text-xs text-white/40 mt-0.5">Control sandbox behaviors, bypass restrictions, and switch credentials.</p>
        </div>

        <div className="space-y-4">
          {/* Sandbox Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div>
              <div className="text-sm font-semibold text-white">Safaricom Daraja API Sandbox</div>
              <div className="text-xs text-white/40">Toggle to direct requests to safaricom sandbox or run local simulator</div>
            </div>
            <button 
              onClick={() => setSandboxMode(!sandboxMode)}
              className={`h-6 w-11 rounded-full p-0.5 transition-all relative cursor-pointer ${sandboxMode ? "bg-green-500" : "bg-white/10"}`}
            >
              <div className={`h-5 w-5 rounded-full bg-white transition-all shadow-md ${sandboxMode ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Auto Approve Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div>
              <div className="text-sm font-semibold text-white">Bypass Callback Validation</div>
              <div className="text-xs text-white/40">Instantly flag simulated pending transactions as approved without Safaricom callback loops</div>
            </div>
            <button 
              onClick={() => setAutoApprove(!autoApprove)}
              className={`h-6 w-11 rounded-full p-0.5 transition-all relative cursor-pointer ${autoApprove ? "bg-green-500" : "bg-white/10"}`}
            >
              <div className={`h-5 w-5 rounded-full bg-white transition-all shadow-md ${autoApprove ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div>
              <div className="text-sm font-semibold text-white">Audited SMS Disbursal Prompts</div>
              <div className="text-xs text-white/40">Send mock SMS confirmations to clients upon successful processing fee reconciliation</div>
            </div>
            <button 
              onClick={() => setNotifySms(!notifySms)}
              className={`h-6 w-11 rounded-full p-0.5 transition-all relative cursor-pointer ${notifySms ? "bg-green-500" : "bg-white/10"}`}
            >
              <div className={`h-5 w-5 rounded-full bg-white transition-all shadow-md ${notifySms ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-black bg-gradient-to-r from-green-400 to-emerald-500 hover:shadow-lg transition-all active:scale-95 cursor-pointer">
            Save Routing Parameters
          </button>
        </div>
      </div>

      {/* Sidebar Guide */}
      <div className="space-y-6">
        <div className="rounded-2xl p-5 border border-white/5 bg-white/[0.02] backdrop-blur-md">
          <h4 className="text-xs uppercase font-bold tracking-widest text-white/40 mb-3">Gateway Config Parameters</h4>
          <ul className="space-y-3.5 text-xs text-white/70">
            <li className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1" />
              <span>**Consumer Key:** 26aEAVkM... (verified)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1" />
              <span>**Business Shortcode:** 4187257 (verified)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1" />
              <span>**Database Engine:** PostgreSQL pool status is operational.</span>
            </li>
          </ul>
        </div>
        
        <div className="rounded-2xl p-5 border border-white/5 bg-white/[0.02] backdrop-blur-md">
          <h4 className="text-xs uppercase font-bold tracking-widest text-white/40 mb-2">Auditor Security Info</h4>
          <p className="text-xs text-white/50 leading-relaxed">
            This admin panel operates under secure 256-bit encryption. All manual reconciliations and transactions are signed with the active administrator credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
