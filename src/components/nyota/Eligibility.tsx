import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Sparkles, X, TrendingUp, Award,
  ShieldCheck, Zap, Clock, Star, ArrowRight, Lock,
} from "lucide-react";

const PERKS = [
  { icon: Zap,         label: "Instant decision in seconds"       },
  { icon: ShieldCheck, label: "Soft check — no impact on credit"  },
  { icon: Lock,        label: "100% secure & confidential"        },
  { icon: Clock,       label: "Funds disbursed within 10 minutes" },
];

const STATS = [
  { value: "50K+",  label: "Loans Approved" },
  { value: "92%",   label: "Approval Rate"  },
  { value: "5 min", label: "Avg Disbursal"  },
];

export function Eligibility() {
  const [isMounted, setIsMounted]     = useState(false);
  const [form, setForm]             = useState({ name: "", id: "", phone: "", income: "", employmentStatus: "Employed" });
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<{score: number, tier: string, min_limit: number, max_limit: number, packageId: string} | null>(null);
  const [errorMsg, setErrorMsg]     = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.id || !form.phone || !form.income) return;
    
    setLoading(true);
    setErrorMsg("");
    setShowResult(false);
    
    try {
      const { apiUrl } = await import("@/lib/api-url");
      const res = await fetch(apiUrl("/api/eligibility"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          nationalId: form.id,
          phone: form.phone,
          income: Number(form.income),
          employmentStatus: form.employmentStatus
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Eligibility check failed");
      }
      
      setResult(data);
      setShowResult(true);

      // Track Eligibility Check Success
      window.ttq?.track("SubmitForm", {
        content_name: "Eligibility Check",
        content_category: "Lead Generation",
      });
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="eligibility"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a1f10 0%, #0f2d18 40%, #1a4a25 70%, #0d2414 100%)" }}
    >
      {/* decorative blobs */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-20 blur-3xl pointer-events-none"
           style={{ background: "radial-gradient(circle, #22c55e, transparent)" }} />
      <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full opacity-15 blur-3xl pointer-events-none"
           style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-center max-w-6xl mx-auto">

          {/* ── LEFT ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6"
                 style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: "#f59e0b" }} />
              Intelligent Eligibility Check
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-white">
              Discover how much<br />
              you qualify for in{" "}
              <span style={{ background: "linear-gradient(90deg,#f59e0b,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                seconds
              </span>
            </h2>

            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.72)" }}>
              Our advanced scoring engine analyzes your profile in real-time. No credit pull. No hidden fees. Get an instant pre-approval tailored just for you.
            </p>

            {/* perks */}
            <ul className="mt-8 space-y-4">
              {PERKS.map(({ icon: Icon, label }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span
                    className="h-9 w-9 rounded-xl grid place-items-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}
                  >
                    <Icon className="h-4 w-4" style={{ color: "#4ade80" }} />
                  </span>
                  <span className="text-sm font-medium text-white">{label}</span>
                </motion.li>
              ))}
            </ul>

            {/* stats */}
            <div className="mt-10 flex flex-wrap gap-3">
              {STATS.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="rounded-2xl px-5 py-3 text-center"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <div className="text-xl font-bold font-display"
                       style={{ background: "linear-gradient(90deg,#f59e0b,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {value}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: form card ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            {isMounted ? (
              <form
                onSubmit={handleSubmit}
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: "#fff",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                {/* accent strip */}
                <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#16a34a,#22c55e,#86efac)" }} />

                <div className="p-7 md:p-9" suppressHydrationWarning>
                  {/* header */}
                  <div className="flex items-start gap-4 mb-7">
                    <div className="h-12 w-12 rounded-2xl grid place-items-center flex-shrink-0"
                         style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 4px 20px rgba(22,163,74,0.35)" }}>
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">Check Your Eligibility</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Fill in your details — it takes under a minute</p>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2">
                      <X className="h-4 w-4" /> {errorMsg}
                    </div>
                  )}

                  {/* fields */}
                  <div className="space-y-4" suppressHydrationWarning>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#374151" }}>
                          Full Name
                        </label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Brian Otieno"
                          className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition"
                          style={{ border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#111827" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.15)"; }}
                          onBlur={(e)  => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#374151" }}>
                          ID Number
                        </label>
                        <input
                          required
                          type="text"
                          value={form.id}
                          onChange={(e) => setForm({ ...form, id: e.target.value })}
                          placeholder="e.g. 32145678"
                          className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition"
                          style={{ border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#111827" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.15)"; }}
                          onBlur={(e)  => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#374151" }}>
                          Phone Number
                        </label>
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="0712 345 678"
                          className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition"
                          style={{ border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#111827" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.15)"; }}
                          onBlur={(e)  => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#374151" }}>
                          Monthly Income (KSh)
                        </label>
                        <input
                          required
                          type="number"
                          value={form.income}
                          onChange={(e) => setForm({ ...form, income: e.target.value })}
                          placeholder="50000"
                          className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition"
                          style={{ border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#111827" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.15)"; }}
                          onBlur={(e)  => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#374151" }}>
                        Employment Status
                      </label>
                      <select
                        required
                        value={form.employmentStatus}
                        onChange={(e) => setForm({ ...form, employmentStatus: e.target.value })}
                        className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition appearance-none"
                        style={{ border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#111827" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.15)"; }}
                        onBlur={(e)  => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <option value="Employed">Employed</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Unemployed">Unemployed</option>
                      </select>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full group inline-flex items-center justify-center gap-2 rounded-xl text-white px-5 py-4 font-semibold text-base transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                    style={{ background: "linear-gradient(135deg,#15803d,#16a34a,#22c55e)", boxShadow: "0 8px 24px rgba(22,163,74,0.4)" }}
                  >
                    {loading ? (
                      <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Check My Eligibility
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  {/* trust row */}
                  <div className="mt-5 flex items-center justify-center flex-wrap gap-3 text-[11px]" style={{ color: "#6b7280" }}>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" style={{ color: "#16a34a" }} /> 256-bit SSL
                    </span>
                    <span className="h-3 w-px bg-gray-200" />
                    <span className="flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" style={{ color: "#16a34a" }} /> No credit impact
                    </span>
                    <span className="h-3 w-px bg-gray-200" />
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" style={{ color: "#f59e0b", fill: "#f59e0b" }} /> 4.9 rating
                    </span>
                  </div>

                  <p className="mt-3 text-[10px] text-center" style={{ color: "#9ca3af" }}>
                    By submitting, you agree to our Terms &amp; Privacy Policy.
                  </p>
                </div>
              </form>
            ) : (
              <div
                className="relative rounded-3xl overflow-hidden bg-white p-7 md:p-9 space-y-6 animate-pulse"
                style={{
                  boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)",
                  height: "472px"
                }}
              >
                {/* top bar */}
                <div className="h-1.5 w-full absolute top-0 left-0" style={{ background: "linear-gradient(90deg,#16a34a,#22c55e,#86efac)" }} />
                
                {/* header skeleton */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="h-12 w-12 rounded-2xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>

                {/* input fields skeleton */}
                <div className="space-y-4 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                      <div className="h-12 bg-gray-100 rounded-xl" />
                    </div>
                  ))}
                </div>

                {/* CTA skeleton */}
                <div className="h-14 bg-gray-200 rounded-xl mt-4" />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Result modal ── */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center backdrop-blur-md p-4"
            style={{ background: "rgba(0,0,0,0.65)" }}
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1,    y: 0,  opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.4)" }}
            >
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#16a34a,#22c55e,#86efac)" }} />
              <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full blur-3xl pointer-events-none"
                   style={{ background: "rgba(22,163,74,0.15)" }} />

              <div className="p-8">
                <button
                  onClick={() => setShowResult(false)}
                  className="absolute top-5 right-5 h-9 w-9 rounded-full grid place-items-center transition hover:bg-gray-100"
                  style={{ color: "#6b7280" }}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="mx-auto h-20 w-20 rounded-full grid place-items-center"
                    style={{ background: "linear-gradient(135deg,#15803d,#22c55e)", boxShadow: "0 8px 32px rgba(22,163,74,0.45)" }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </motion.div>

                  <h3 className="mt-5 text-2xl font-bold text-gray-900">
                    Congratulations{form.name ? `, ${form.name.split(" ")[0]}!` : "!"}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-500">You qualify for a loan limit of</p>
                  <div className="mt-2 text-3xl font-bold font-display"
                       style={{ background: "linear-gradient(90deg,#15803d,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    KSh {result.min_limit.toLocaleString()} – {result.max_limit.toLocaleString()}
                  </div>

                  {/* score bar */}
                  <div className="mt-6 text-left">
                    <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: "#374151" }}>
                      <span>Loan Score</span>
                      <span style={{ color: "#16a34a" }}>{result.score}% · {result.score >= 75 ? "Excellent" : result.score >= 50 ? "Good" : "Fair"}</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: "#e5e7eb" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                        className="h-full rounded-full relative"
                        style={{ background: "linear-gradient(90deg,#15803d,#22c55e)" }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      </motion.div>
                    </div>
                  </div>

                  {/* mini stats */}
                  <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                    <div className="rounded-2xl p-4" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide" style={{ color: "#6b7280" }}>
                        <TrendingUp className="h-3.5 w-3.5" style={{ color: "#16a34a" }} /> Approval
                      </div>
                      <div className="font-bold text-gray-900 text-lg mt-1">{result.score}%</div>
                    </div>
                    <div className="rounded-2xl p-4" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide" style={{ color: "#6b7280" }}>
                        <Award className="h-3.5 w-3.5" style={{ color: "#16a34a" }} /> Tier
                      </div>
                      <div className="font-bold text-gray-900 text-lg mt-1">{result.tier} ⭐</div>
                    </div>
                  </div>

                  <p className="mt-5 text-sm italic border-l-2 pl-3 text-left" style={{ color: "#6b7280", borderColor: "#22c55e" }}>
                    "Your financial freedom starts today. Keep dreaming — we've got the funding."
                  </p>

                  <a
                    href={`/apply?package=${result.packageId}`}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl text-white px-5 py-4 font-semibold transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg,#15803d,#22c55e)", boxShadow: "0 8px 24px rgba(22,163,74,0.4)" }}
                  >
                    Continue Application <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}