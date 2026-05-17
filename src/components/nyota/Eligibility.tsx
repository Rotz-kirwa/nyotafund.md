import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, X, TrendingUp, Award } from "lucide-react";

export function Eligibility() {
  const [form, setForm] = useState({ name: "", id: "", phone: "" });
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.id || !form.phone) return;
    setShowResult(true);
    setScore(0);
    const target = 92;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1500, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setScore(Math.floor(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  return (
    <section id="eligibility" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-hero animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-primary-foreground"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass-dark text-primary-foreground px-4 py-1.5 text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Free Eligibility Check
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Discover how much <br />you qualify for in <span className="text-gradient-gold">60 seconds</span>
            </h2>
            <p className="mt-5 text-primary-foreground/80 text-lg max-w-md">
              No credit pull. No hidden fees. Get an instant pre-approval and unlock premium loan offers tailored to you.
            </p>
            <ul className="mt-8 space-y-3">
              {["Instant decision in seconds", "Soft check — no impact on credit", "100% secure & confidential"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-primary-foreground/90">
                  <span className="h-6 w-6 rounded-full bg-primary-foreground/15 grid place-items-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="glass rounded-3xl p-6 md:p-8 shadow-elevated"
          >
            <h3 className="text-2xl font-bold text-foreground mb-1">Check Your Eligibility</h3>
            <p className="text-sm text-muted-foreground mb-6">Fill in your details to get started</p>

            {[
              { k: "name", l: "Full Name", p: "e.g. Brian Otieno", t: "text" },
              { k: "id", l: "National ID Number", p: "e.g. 32145678", t: "text" },
              { k: "phone", l: "Phone Number", p: "e.g. 0712 345 678", t: "tel" },
            ].map((f) => (
              <div key={f.k} className="mb-4">
                <label className="block text-xs font-semibold text-foreground/80 mb-1.5">{f.l}</label>
                <input
                  required
                  type={f.t}
                  value={form[f.k as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                  placeholder={f.p}
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                />
              </div>
            ))}

            <button
              type="submit"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-5 py-4 font-semibold shadow-glow hover:shadow-elevated transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Check My Eligibility
            </button>
            <p className="mt-4 text-[11px] text-center text-muted-foreground">
              By submitting, you agree to our Terms & Privacy Policy.
            </p>
          </motion.form>
        </div>
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-foreground/60 backdrop-blur-md p-4"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-card rounded-3xl p-8 shadow-elevated overflow-hidden"
            >
              <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
              <button
                onClick={() => setShowResult(false)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full hover:bg-accent grid place-items-center text-muted-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="mx-auto h-20 w-20 rounded-full bg-gradient-primary grid place-items-center shadow-glow"
                >
                  <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                </motion.div>

                <h3 className="mt-6 text-2xl font-bold text-foreground font-display">
                  Congratulations{form.name ? `, ${form.name.split(" ")[0]}!` : "!"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You qualify for premium loan offers starting from
                </p>
                <div className="mt-2 text-3xl font-bold text-gradient-primary font-display">
                  KSh 50,000 – 500,000
                </div>

                {/* Score meter */}
                <div className="mt-6 text-left">
                  <div className="flex justify-between text-xs font-semibold text-foreground/80 mb-2">
                    <span>Loan Score</span>
                    <span className="text-primary">{score}% · Excellent</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                      className="h-full bg-gradient-primary rounded-full relative"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </motion.div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                  <div className="rounded-xl bg-accent/60 p-3">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" /> Approval
                    </div>
                    <div className="font-bold text-foreground mt-0.5">{score}%</div>
                  </div>
                  <div className="rounded-xl bg-accent/60 p-3">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Award className="h-3.5 w-3.5 text-primary" /> Tier
                    </div>
                    <div className="font-bold text-foreground mt-0.5">Elite</div>
                  </div>
                </div>

                <p className="mt-5 text-sm text-foreground/80 italic">
                  "Your financial freedom starts today. Keep dreaming — we've got the funding."
                </p>

                <button
                  onClick={() => setShowResult(false)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-5 py-3.5 font-semibold shadow-glow"
                >
                  Continue Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}