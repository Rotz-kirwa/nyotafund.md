import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { apiUrl } from "@/lib/api-url";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json() as { success?: boolean; token?: string; error?: string };

      if (res.ok && data.success && data.token) {
        sessionStorage.setItem("nyota_admin_auth", "1");
        sessionStorage.setItem("nyota_admin_token", data.token);
        onLogin(data.token);
      } else {
        setError(data.error ?? "Incorrect password. Please try again.");
        setPassword("");
      }
    } catch {
      setError("Connection error. Is the main server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#040d07 0%,#06180c 50%,#050f08 100%)" }}
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] rounded-full opacity-10 blur-[120px] pointer-events-none" style={{ background: "#22c55e" }} />
      <div className="absolute bottom-0 right-0 w-[25rem] h-[25rem] rounded-full opacity-5 blur-[100px] pointer-events-none" style={{ background: "#f59e0b" }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Card */}
        <div
          className="rounded-3xl p-8 border border-white/8"
          style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}
        >
          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <Logo dark size={40} />
            <h1 className="text-xl font-bold text-white mt-4">Admin Access</h1>
            <p className="text-xs text-white/40 mt-1">NyotaCredit Control Panel</p>
          </div>

          {/* Lock icon ring */}
          <div className="flex justify-center mb-6">
            <div
              className="h-14 w-14 rounded-2xl grid place-items-center"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              <Lock size={22} className="text-green-400" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl px-4 py-3.5 pr-11 text-sm text-white outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 rounded-xl px-3 py-2.5 border border-red-500/20" style={{ background: "rgba(239,68,68,0.08)" }}>
                <Lock size={12} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: loading ? "none" : "0 8px 30px rgba(34,197,94,0.3)" }}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-[10px] text-white/20 mt-6">
            Restricted access · NyotaCredit Operations
          </p>
        </div>
      </div>
    </div>
  );
}
