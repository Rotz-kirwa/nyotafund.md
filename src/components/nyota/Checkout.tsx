import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Crown,
  Briefcase, TrendingUp, Sprout, Shield, Lock,
  Smartphone, RefreshCw, Star, Wallet, Sparkles,
} from "lucide-react";
import { Logo } from "@/components/nyota/Logo";
import { apiUrl } from "@/lib/api-url";

const PKGS = [
  { id: "starter",        name: "Starter",        Icon: Sprout,     range: "KSh 10,000 – 20,000",    fee: 100, feeLabel: "KSh 100", color: "#059669", benefits: ["Same-day disbursement", "No collateral", "3-month terms"] },
  { id: "growth",         name: "Growth",         Icon: TrendingUp, range: "KSh 50,000 – 100,000",   fee: 150, feeLabel: "KSh 150", color: "#10b981", popular: true, benefits: ["Priority approval", "Build credit score", "6-month repayment"] },
  { id: "business-boost", name: "Business Boost", Icon: Briefcase,  range: "KSh 150,000 – 300,000",  fee: 200, feeLabel: "KSh 200", color: "#0d9488", benefits: ["Dedicated advisor", "Working capital ready", "12-month repayment"] },
  { id: "elite",          name: "Elite",          Icon: Crown,      range: "KSh 350,000 – 500,000",  fee: 250, feeLabel: "KSh 250", color: "#d97706", benefits: ["VIP processing", "Lowest interest rates", "24-month repayment"] },
];

type Pkg = typeof PKGS[number];
type PStatus = "idle" | "sending" | "pending" | "success" | "failed";

export function CheckoutPage({ selectedPackage }: { selectedPackage?: string }) {
  const init = PKGS.find((p) => p.id === selectedPackage) ?? null;
  const [step, setStep] = useState(init ? 1 : 0);
  const [pkg, setPkg] = useState<Pkg | null>(init);
  const [form, setForm] = useState({ name: "", id: "", phone: "" });
  const [pStatus, setPStatus] = useState<PStatus>("idle");
  const [countdown, setCountdown] = useState(60);
  const [txnId, setTxnId] = useState("");
  const [checkoutId, setCheckoutId] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Countdown + real status polling while pending
  useEffect(() => {
    if (pStatus !== "pending" || !checkoutId) return;
    setCountdown(60);
    const tick = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);

    // Safaricom terminal failure codes:
    // 1032 = request cancelled by user
    // 1037 = STK push timed out / user unreachable
    // 2001 = wrong PIN entered
    // 1019 = transaction expired
    // ResultCode "0" = success
    // Anything else (including no ResultCode, ResultCode "1", or
    // "The transaction is still under processing") = still waiting → keep polling
    const TERMINAL_FAILURES = new Set(["1032", "1037", "2001", "1019"]);

    const poll = setInterval(async () => {
      try {
        const res = await fetch(apiUrl("/api/mpesa/status"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutRequestId: checkoutId }),
        });
        const data = await res.json() as { ResultCode?: string; ResultDesc?: string };

        if (data.ResultCode === "0") {
          // ✅ Payment confirmed
          clearInterval(tick);
          clearInterval(poll);
          setTxnId(checkoutId.slice(0, 14));
          setPStatus("success");
          setTimeout(() => setStep(3), 1200);
        } else if (data.ResultCode && TERMINAL_FAILURES.has(data.ResultCode)) {
          // ❌ Definitive failure — user cancelled, timed out, or wrong PIN
          clearInterval(tick);
          clearInterval(poll);
          setErrMsg(data.ResultDesc ?? "Payment failed. Please try again.");
          setPStatus("failed");
        }
        // All other cases (no ResultCode, "1", "still processing" etc.)
        // → transaction is still in flight, keep polling silently
      } catch {
        // network hiccup — keep polling
      }
    }, 3000);

    // If countdown hits 0, stop polling and show a gentle retry prompt
    const timeoutId = setTimeout(() => {
      clearInterval(tick);
      clearInterval(poll);
      if (pStatus === "pending") {
        setErrMsg("No response from M-Pesa within 60 seconds. Please try again.");
        setPStatus("failed");
      }
    }, 62000);

    return () => { clearInterval(tick); clearInterval(poll); clearTimeout(timeoutId); };
  }, [pStatus, checkoutId]);

  // TikTok Pixel tracking for Checkout stages
  useEffect(() => {
    if (step === 1 && pkg) {
      window.ttq?.track("InitiateCheckout", {
        content_name: pkg.name,
        content_category: "Loan Package",
        value: pkg.fee,
        currency: "KES",
      });
    } else if (step === 2 && pkg) {
      window.ttq?.track("AddPaymentInfo", {
        content_name: pkg.name,
        content_category: "Loan Package",
        value: pkg.fee,
        currency: "KES",
      });
    }
  }, [step, pkg]);

  useEffect(() => {
    if (pStatus === "success" && pkg && checkoutId) {
      window.ttq?.track("CompletePayment", {
        content_name: pkg.name,
        content_category: "Loan Package",
        value: pkg.fee,
        currency: "KES",
        event_id: checkoutId, // For deduplication with server events
      });
    }
  }, [pStatus, pkg, checkoutId]);

  const fade = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -18 } };

  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden bg-background">
      {/* Subtle light mesh blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] max-w-[30rem] max-h-[30rem] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)" }} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[90vw] h-[90vw] max-w-[35rem] max-h-[35rem] rounded-full opacity-5" style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/60 bg-white/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
          <ArrowLeft size={15} /> Back
        </Link>
        <div>
          <a href="/">
            <Logo size={32} />
          </a>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Lock size={11} /> Secure
        </div>
      </header>

      {/* Progress (steps 1-3) */}
      {step > 0 && step < 4 && (
        <div className="relative z-10 flex items-center justify-center gap-2 pt-8 pb-2">
          {["Package", "Details", "Payment", "Done"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-7 w-7 rounded-full grid place-items-center text-xs font-bold transition-all"
                  style={{
                    background: i < step ? "linear-gradient(135deg,#059669,#10b981)" : i === step ? "#f0fdf4" : "#f3f4f6",
                    color: i < step ? "white" : i === step ? "#15803d" : "#9ca3af",
                    border: i === step ? "2px solid #16a34a" : "none",
                  }}>
                  {i < step ? <Check size={11} /> : i + 1}
                </div>
                <span className="text-xs hidden sm:block font-medium" style={{ color: i <= step ? "#374151" : "#9ca3af" }}>{s}</span>
              </div>
              {i < 3 && <div className="w-6 h-px" style={{ background: i < step ? "#16a34a" : "#e5e7eb" }} />}
            </div>
          ))}
        </div>
      )}

      {/* Main */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Choose Package ── */}
          {step === 0 && (
            <motion.div key="s0" {...fade}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-5">
                  <Sparkles size={12} /> Choose your loan package
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
                  Apply for a{" "}
                  <span className="text-gradient-primary">Loan</span>
                </h1>
                <p className="text-muted-foreground text-base max-w-md mx-auto">
                  Select a package below, pay a one-time processing fee via M-Pesa, and receive funds in minutes.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {PKGS.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="group relative"
                  >
                    {p.popular && (
                      <div className="absolute -top-3 inset-x-0 flex justify-center z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div
                      className={`relative h-full rounded-3xl bg-card border p-6 shadow-card flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${
                        p.popular ? "ring-2 ring-primary/40 border-primary/30" : "border-border/60"
                      }`}
                    >
                      {/* glow on hover — pointer-events-none so it never blocks button clicks */}
                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${p.color}15, transparent 70%)`, zIndex: 0 }} />

                      <div className="relative">
                        <div className="h-12 w-12 rounded-2xl grid place-items-center mb-5 shadow" style={{ background: p.color + "22", border: `1.5px solid ${p.color}55` }}>
                          <p.Icon size={22} color={p.color} />
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-1">{p.name}</h3>
                        <div className="text-sm font-semibold mb-1" style={{ color: p.color }}>{p.range}</div>
                        <div className="text-xs text-muted-foreground mb-5">
                          Processing fee · <span className="font-bold text-foreground">{p.feeLabel}</span>
                        </div>

                        <ul className="space-y-2 mb-6">
                          {p.benefits.map((b) => (
                            <li key={b} className="flex items-center gap-2 text-sm text-foreground/70">
                              <Check size={13} style={{ color: p.color }} className="flex-shrink-0" /> {b}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA button */}
                      <button
                        onClick={() => { setPkg(p); setStep(1); }}
                        className="mt-auto w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-95"
                        style={{ background: `linear-gradient(135deg,${p.color}cc,${p.color})`, boxShadow: `0 6px 20px ${p.color}40` }}
                      >
                        Apply Now <ArrowRight size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trust strip */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Shield size={13} className="text-primary" /> CBK Licensed</span>
                <span className="flex items-center gap-1.5"><Lock size={13} className="text-primary" /> 256-bit SSL</span>
                <span className="flex items-center gap-1.5"><Star size={13} className="text-yellow-500 fill-yellow-500" /> 4.9 / 5 rating</span>
                <span className="flex items-center gap-1.5"><Wallet size={13} className="text-primary" /> Funds via M-Pesa</span>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Personal Details ── */}
          {step === 1 && pkg && (
            <motion.div key="s1" {...fade} className="grid lg:grid-cols-[320px_1fr] gap-6">
              <OrderSummary pkg={pkg} />
              <div className="rounded-2xl p-6 md:p-8 bg-card border border-border/60 shadow-card">
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">Your Details</h2>
                <p className="text-muted-foreground text-sm mb-6">We need this to process your application</p>
                <form onSubmit={(e) => { e.preventDefault(); if (form.name && form.id && form.phone) setStep(2); }}>
                  {[
                    { key: "name", label: "Full Name", placeholder: "e.g. Brian Otieno", type: "text", autoComplete: "off" },
                    { key: "id", label: "National ID Number", placeholder: "e.g. 32145678", type: "text", autoComplete: "off" },
                    { key: "phone", label: "M-Pesa Phone Number", placeholder: "e.g. 0712 345 678", type: "tel", autoComplete: "off" },
                  ].map((f) => (
                    <div key={f.key} className="mb-4">
                      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{f.label}</label>
                      <input
                        required
                        type={f.type}
                        autoComplete={f.autoComplete}
                        data-lpignore="true"
                        data-form-type="other"
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full rounded-xl px-4 py-3.5 text-sm text-foreground outline-none transition-all"
                        style={{ border: "1.5px solid #e5e7eb", background: "#f9fafb" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.12)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                    </div>
                  ))}
                  {/* Fee Disclosure */}
                  <div className="mt-6 mb-2 rounded-2xl p-4 border text-sm leading-relaxed" style={{ background: "#fffbeb", borderColor: "#fcd34d" }}>
                    <div className="flex items-start gap-2.5">
                      <Shield size={15} className="mt-0.5 shrink-0" style={{ color: "#d97706" }} />
                      <p className="text-amber-800">
                        A processing and account activation fee of{" "}
                        <span className="font-bold text-amber-700">{pkg.feeLabel}</span>{" "}
                        will be required. This fee is{" "}
                        <span className="font-semibold text-gray-900">fully refundable</span>{" "}
                        upon successful completion and is{" "}
                        <span className="font-semibold text-gray-900">not deducted</span>{" "}
                        from your approved loan amount.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setStep(0)}
                      className="flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all bg-secondary border border-border">
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button type="submit" className="flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg,#059669,#10b981)", boxShadow: "0 8px 30px rgba(5,150,105,0.35)" }}>
                      Continue <ArrowRight size={15} />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: M-Pesa Payment ── */}
          {step === 2 && pkg && (
            <motion.div key="s2" {...fade} className="grid lg:grid-cols-[320px_1fr] gap-6">
              <OrderSummary pkg={pkg} />
              <div className="rounded-2xl p-6 md:p-8 bg-card border border-border/60 shadow-card">
                {/* M-Pesa Header */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/60">
                  <div className="h-12 w-12 rounded-xl grid place-items-center" style={{ background: "#00A651" }}>
                    <Smartphone size={22} color="white" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-foreground text-lg">M-Pesa Payment</div>
                    <div className="text-xs text-muted-foreground">Secure mobile money payment</div>
                  </div>
                  <div className="ml-auto text-2xl font-bold font-display" style={{ color: "#d97706" }}>
                    {pkg.feeLabel}
                  </div>
                </div>

                {pStatus === "idle" && (
                  <motion.div {...fade}>
                    {/* Fee Disclosure */}
                    <div className="rounded-2xl p-4 mb-5 border text-sm leading-relaxed" style={{ background: "#fffbeb", borderColor: "#fcd34d" }}>
                      <div className="flex items-start gap-2.5">
                        <Shield size={15} className="mt-0.5 shrink-0" style={{ color: "#d97706" }} />
                        <p className="text-amber-800">
                          A one-time processing fee of{" "}
                          <span className="font-bold text-amber-700">{pkg.feeLabel}</span>{" "}
                          is required for application review and onboarding. This fee is{" "}
                          <span className="font-semibold text-gray-900">fully refundable</span>{" "}
                          and is{" "}
                          <span className="font-semibold text-gray-900">not deducted</span>{" "}
                          from your approved loan amount.
                        </p>
                      </div>
                    </div>

                    {/* Phone number box */}
                    <div className="rounded-xl p-4 mb-4 border border-border/60 bg-secondary/40">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Sending STK Push to</div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <Smartphone size={14} color="#00A651" /> {form.phone || "07XX XXX XXX"}
                      </div>
                    </div>

                    {/* Payment details */}
                    <div className="rounded-xl p-4 mb-6 border border-border/60 bg-secondary/40 space-y-2.5">
                      {[["Business No.", "4187257"], ["Account Ref.", `NC-${pkg.id.toUpperCase()}`], ["Amount", pkg.feeLabel]].map(([l, v]) => (
                        <div key={l} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{l}</span>
                          <span className="font-semibold text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>

                    {errMsg && (
                      <div className="rounded-xl p-3 mb-4 text-sm text-center border border-red-200 bg-red-50 text-red-600">
                        {errMsg}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)}
                        className="flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all bg-secondary border border-border">
                        <ArrowLeft size={15} /> Back
                      </button>
                      <button onClick={async () => {
                        setErrMsg("");
                        setPStatus("sending");
                        try {
                          const res = await fetch(apiUrl("/api/mpesa/stk-push"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              phone: form.phone,
                              amount: pkg.fee,
                              accountRef: `NC-${pkg.id.toUpperCase()}`,
                              name: form.name,
                              nationalId: form.id,
                              packageId: pkg.id,
                            }),
                          });
                          const data = await res.json() as { CheckoutRequestID?: string; errorCode?: string; error?: string };
                          if (data.CheckoutRequestID) {
                            setCheckoutId(data.CheckoutRequestID);
                            setPStatus("pending");
                          } else {
                            setErrMsg(data.error ?? "Failed to send STK push. Check phone number.");
                            setPStatus("failed");
                          }
                        } catch {
                          setErrMsg("Network error. Please check your connection.");
                          setPStatus("failed");
                        }
                      }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg,#00A651,#059669)", boxShadow: "0 8px 30px rgba(0,166,81,0.35)" }}>
                        <Wallet size={16} /> Send M-Pesa Request
                      </button>
                    </div>
                  </motion.div>
                )}

                {pStatus === "sending" && (
                  <motion.div {...fade} className="text-center py-12">
                    <div className="h-16 w-16 rounded-full mx-auto mb-5 animate-spin" style={{ background: "conic-gradient(#00A651 0%, transparent 75%)", padding: 3 }}>
                      <div className="h-full w-full rounded-full bg-background" />
                    </div>
                    <div className="font-semibold text-foreground mb-1">Sending STK Push…</div>
                    <div className="text-muted-foreground text-sm">Reaching {form.phone}</div>
                  </motion.div>
                )}

                {pStatus === "pending" && (
                  <motion.div {...fade}>
                    <div className="text-center py-6 rounded-2xl mb-5 border border-green-200 bg-green-50">
                      <div className="h-14 w-14 rounded-full grid place-items-center mx-auto mb-3 bg-green-100 border-2 border-green-300">
                        <Smartphone size={24} color="#16a34a" />
                      </div>
                      <div className="font-bold text-gray-900 mb-1">Check Your Phone!</div>
                      <div className="text-sm text-gray-500 mb-4">Enter your M-Pesa PIN to complete payment</div>
                      <div className="text-4xl font-bold font-display" style={{ color: countdown > 15 ? "#16a34a" : "#d97706" }}>{countdown}s</div>
                      <div className="text-xs text-gray-400 mt-1">Time remaining</div>
                    </div>
                    <div className="rounded-xl p-3 border border-border/60 bg-secondary/40 mb-4">
                      <div className="text-xs text-muted-foreground text-center">Waiting for payment confirmation from {form.phone}</div>
                    </div>
                    <button onClick={() => { setErrMsg(""); setPStatus("idle"); }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm text-muted-foreground hover:text-foreground transition-all border border-border bg-secondary">
                      <RefreshCw size={14} /> Resend STK Push
                    </button>
                  </motion.div>
                )}

                {pStatus === "success" && (
                  <motion.div {...fade} className="text-center py-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                      className="h-16 w-16 rounded-full grid place-items-center mx-auto mb-4"
                      style={{ background: "linear-gradient(135deg,#00A651,#059669)", boxShadow: "0 0 40px rgba(0,166,81,0.4)" }}>
                      <CheckCircle2 size={30} color="white" />
                    </motion.div>
                    <div className="font-bold text-foreground text-xl mb-1">Payment Received!</div>
                    <div className="text-muted-foreground text-sm">Redirecting to confirmation…</div>
                  </motion.div>
                )}

                {pStatus === "failed" && (
                  <motion.div {...fade} className="text-center py-8">
                    <div className="h-16 w-16 rounded-full grid place-items-center mx-auto mb-4 bg-red-50 border-2 border-red-200">
                      <RefreshCw size={26} color="#ef4444" />
                    </div>
                    <div className="font-bold text-foreground text-xl mb-2">Payment Failed</div>
                    <div className="text-sm text-muted-foreground mb-6">{errMsg}</div>
                    <button onClick={() => { setErrMsg(""); setPStatus("idle"); }}
                      className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all"
                      style={{ background: "linear-gradient(135deg,#00A651,#059669)", boxShadow: "0 8px 30px rgba(0,166,81,0.3)" }}>
                      <RefreshCw size={14} /> Try Again
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && pkg && (
            <motion.div key="s3" {...fade} className="max-w-lg mx-auto text-center">
              {/* Particles */}
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.span key={i} className="absolute h-2 w-2 rounded-full pointer-events-none"
                  style={{ background: i % 2 === 0 ? "#10b981" : "#f59e0b", left: `${(i * 73) % 90 + 5}%`, top: `${(i * 41) % 60 + 10}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], y: [0, -60, -120], scale: [0, 1, 0.5] }}
                  transition={{ duration: 1.5, delay: i * 0.07 }} />
              ))}
              <div className="rounded-3xl p-8 md:p-12 border border-white/8 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl" style={{ background: "rgba(5,150,105,0.2)" }} />
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                  className="h-20 w-20 rounded-full grid place-items-center mx-auto mb-6 relative z-10"
                  style={{ background: "linear-gradient(135deg,#059669,#10b981)", boxShadow: "0 0 60px rgba(16,185,129,0.5)" }}>
                  <CheckCircle2 size={40} color="white" />
                </motion.div>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs mb-5 border border-green-500/30" style={{ background: "rgba(5,150,105,0.1)", color: "#10b981" }}>
                  <Star size={11} fill="#10b981" /> Application Submitted
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  {form.name ? `Thank you, ${form.name.split(" ")[0]}!` : "Application Received!"}
                </h2>

                {/* ── NyotaCredit high-demand processing notice ── */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="rounded-2xl p-5 mb-7 text-left border border-green-500/25 relative overflow-hidden"
                  style={{ background: "rgba(5,150,105,0.09)" }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: "linear-gradient(180deg,#059669,#10b981)" }} />
                  <div className="flex items-start gap-3 pl-2">
                    <div className="h-8 w-8 rounded-lg grid place-items-center flex-shrink-0 mt-0.5" style={{ background: "rgba(16,185,129,0.15)" }}>
                      <Smartphone size={16} color="#10b981" />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                      NyotaCredit is currently experiencing{" "}
                      <span className="font-semibold text-white">high application demand</span>.
                      Your loan request is being processed, and the funds will be sent directly to your{" "}
                      <span className="font-semibold text-white">M-Pesa once approved</span>.
                      You still qualify for additional funding and may{" "}
                      <span className="font-semibold text-white">apply for a higher loan limit at any time</span>.
                    </p>
                  </div>
                </motion.div>

                {/* Transaction summary */}
                <div className="grid grid-cols-2 gap-3 mb-7 text-left">
                  {[
                    { l: "Package",        v: pkg.name     },
                    { l: "Loan Range",     v: pkg.range    },
                    { l: "Fee Paid",       v: pkg.feeLabel },
                    { l: "Transaction ID", v: txnId        },
                  ].map(({ l, v }) => (
                    <div key={l} className="rounded-xl p-3 border border-white/6" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="text-xs text-white/30 mb-0.5">{l}</div>
                      <div className="font-semibold text-white text-sm">{v}</div>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setPkg(null); setForm({ name: "", id: "", phone: "" }); setPStatus("idle"); setTxnId(""); setCheckoutId(""); setStep(0); }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg,#059669,#10b981)", boxShadow: "0 8px 30px rgba(5,150,105,0.4)" }}
                  >
                    Apply for More <ArrowRight size={15} />
                  </button>
                  <Link to="/"
                    className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold border border-white/10 hover:text-white transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}
                  >
                    <ArrowLeft size={14} /> Back to Home
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

function OrderSummary({ pkg }: { pkg: NonNullable<ReturnType<typeof PKGS.find>> }) {
  return (
    <div className="rounded-2xl p-5 bg-card border border-border/60 shadow-card sticky top-6">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Order Summary</div>
      <div className="flex items-center gap-3 rounded-xl p-3 mb-5 bg-secondary border border-border/50">
        <div className="h-11 w-11 rounded-xl grid place-items-center" style={{ background: pkg.color + "22", border: `1px solid ${pkg.color}44` }}>
          <pkg.Icon size={20} color={pkg.color} />
        </div>
        <div>
          <div className="font-bold text-foreground font-display">{pkg.name}</div>
          <div className="text-xs" style={{ color: pkg.color }}>{pkg.range}</div>
        </div>
      </div>
      <ul className="space-y-2 mb-5">
        {pkg.benefits.map((b) => (
          <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check size={11} color={pkg.color} /> {b}
          </li>
        ))}
      </ul>
      <div className="border-t border-border/60 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Processing Fee</span><span>{pkg.feeLabel}</span>
        </div>
        <div className="flex justify-between font-bold text-foreground">
          <span>Total Due</span>
          <span style={{ color: pkg.color }}>{pkg.feeLabel}</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {[Shield, Lock].map((Icon, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon size={11} color="#16a34a" />
            {i === 0 ? "CBK Licensed & Regulated" : "256-bit SSL Encryption"}
          </div>
        ))}
      </div>
    </div>
  );
}
