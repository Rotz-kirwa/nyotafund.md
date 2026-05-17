import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Star, TrendingUp, Wallet, BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero.jpg";

function Counter({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.floor(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{value.toLocaleString()}{suffix}</>;
}

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Animated mesh background */}
      <div className="absolute inset-0 bg-gradient-mesh animate-gradient -z-10" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-blob -z-10" />
      <div className="absolute top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-primary-glow/30 blur-3xl animate-blob -z-10" style={{ animationDelay: "4s" }} />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-gold/20 blur-3xl animate-blob -z-10" style={{ animationDelay: "8s" }} />

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-primary/40 -z-10"
          style={{ left: `${(i * 83) % 100}%`, top: `${(i * 37) % 90}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-foreground shadow-soft mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Licensed by Central Bank of Kenya
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground">
            Lighting Your{" "}
            <span className="text-gradient-primary">Financial Future</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Premium instant loans from <strong className="text-foreground">KSh 10,000 to KSh 500,000</strong>.
            Empowering Kenyan youth, families, and entrepreneurs with fast, secure, and flexible financing.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#eligibility"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-7 py-4 font-semibold shadow-glow hover:shadow-elevated transition-all hover:-translate-y-0.5"
            >
              Apply Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#eligibility"
              className="inline-flex items-center gap-2 rounded-xl glass text-foreground px-7 py-4 font-semibold shadow-soft hover:bg-card transition-all"
            >
              <BadgeCheck className="h-4 w-4 text-primary" />
              Check Eligibility
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> 256-bit secured</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> 5-min approval</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 text-gold fill-gold" /> 4.9 / 5 rating</span>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg">
            {[
              { v: 50000, s: "+", l: "Loans Approved" },
              { v: 47, s: "+", l: "Counties Reached" },
              { v: 5, s: " min", l: "Avg Approval" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl p-4 shadow-soft">
                <div className="text-2xl md:text-3xl font-bold text-gradient-primary font-display">
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden shadow-elevated border border-border/50">
            <img
              src={heroImg}
              alt="Happy Kenyan entrepreneurs using NyotaCredit"
              width={1536}
              height={1024}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
          </div>

          {/* Floating card 1 */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 md:-left-10 top-10 glass rounded-2xl p-4 shadow-elevated w-56"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Disbursed</div>
                <div className="font-bold text-foreground">KSh 250,000</div>
              </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-4/5 bg-gradient-primary rounded-full" />
            </div>
          </motion.div>

          {/* Floating card 2 */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-2 md:-right-6 bottom-10 glass rounded-2xl p-4 shadow-elevated"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-gold grid place-items-center">
                <TrendingUp className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Loan Score</div>
                <div className="font-bold text-foreground">Excellent · 92%</div>
              </div>
            </div>
          </motion.div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-4 left-1/3 glass rounded-full px-4 py-2 shadow-soft flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">CBK Licensed</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}