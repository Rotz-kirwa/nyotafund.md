import { ArrowRight, ShieldCheck, Zap, Star, BadgeCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/hero.jpg";

const TICKER_ITEMS = [
  { name: "Brian O.",    phone: "0712***456", amount: "KSh 50,000",  mins: 2  },
  { name: "Sharon C.",   phone: "0791***817", amount: "KSh 80,000",  mins: 4  },
  { name: "Kevin M.",    phone: "0703***291", amount: "KSh 150,000", mins: 6  },
  { name: "Faith A.",    phone: "0722***634", amount: "KSh 30,000",  mins: 8  },
  { name: "Dennis K.",   phone: "0768***052", amount: "KSh 200,000", mins: 11 },
  { name: "Grace W.",    phone: "0715***389", amount: "KSh 45,000",  mins: 13 },
  { name: "James N.",    phone: "0744***710", amount: "KSh 100,000", mins: 15 },
  { name: "Mercy L.",    phone: "0799***143", amount: "KSh 25,000",  mins: 17 },
  { name: "Peter K.",    phone: "0731***967", amount: "KSh 500,000", mins: 19 },
  { name: "Asha M.",     phone: "0756***408", amount: "KSh 60,000",  mins: 21 },
];

function LiveTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
    >
      <div className="flex gap-3 w-max" style={{ animation: "ticker-scroll 45s linear infinite" }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 flex items-center gap-2.5 rounded-full px-4 py-2"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-semibold text-white whitespace-nowrap">{item.name}</span>
            <span className="text-xs text-white/50 whitespace-nowrap">{item.phone}</span>
            <span className="text-xs font-bold text-emerald-400 whitespace-nowrap">{item.amount}</span>
            <span className="text-[11px] text-white/40 whitespace-nowrap">{item.mins} min ago</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes ticker-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

function Counter({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Only animate when element enters viewport
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
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
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden flex items-start md:items-center">
      {/* LCP image — eager, high priority, no lazy */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Happy Kenyan entrepreneurs using NyotaCredit"
          className="w-full h-full object-cover object-top md:object-center"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 md:hidden" style={{ background: "rgba(10,25,15,0.82)" }} />
        <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(to right, rgba(15,30,20,0.88) 0%, rgba(15,30,20,0.6) 55%, rgba(15,30,20,0.25) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,25,15,0.75) 0%, transparent 60%, rgba(10,25,15,0.2) 100%)" }} />
      </div>

      {/* CSS-only floating particles — no framer-motion on critical path */}
      <style>{`
        .hero-particle{position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);pointer-events:none;z-index:10;animation:hero-float var(--d,4s) ease-in-out infinite var(--delay,0s)}
        @keyframes hero-float{0%,100%{transform:translateY(0);opacity:.15}50%{transform:translateY(-28px);opacity:.6}}
        @media(prefers-reduced-motion:reduce){.hero-particle{display:none}}
      `}</style>
      {[8,12,6,10,9,14,7,11,8,13,6,9,11,7].map((size, i) => (
        <span key={i} className="hero-particle" style={{
          width: `${size * 0.8}px`, height: `${size * 0.8}px`,
          left: `${(i * 83) % 100}%`, top: `${(i * 37) % 90}%`,
          "--d": `${4 + (i % 5)}s`, "--delay": `${i * 0.3}s`,
        } as React.CSSProperties} />
      ))}

      <div className="relative z-10 w-full px-4 pt-24 pb-16 md:container md:mx-auto md:pt-40 md:pb-28">
        <div className="max-w-3xl">

          {/* Live ticker */}
          <div className="mb-5 -mx-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-widest text-primary-foreground/50 font-semibold">Live Disbursements</span>
            </div>
            <LiveTicker />
          </div>

          {/* CBK badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 border border-primary-foreground/25 px-4 py-1.5 text-xs font-medium text-primary-foreground mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Licensed by Central Bank of Kenya
          </div>

          {/* H1 — no animation delay, renders immediately for LCP */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-primary-foreground">
            Lighting Your{" "}
            <span className="text-gradient-gold">Financial Future</span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-primary-foreground/80 max-w-xl">
            Premium instant loans from{" "}
            <strong className="text-primary-foreground">KSh 10,000 to KSh 500,000</strong>.
            Fast, secure &amp; flexible financing for every Kenyan.
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/apply"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-7 py-4 font-semibold shadow-glow hover:shadow-elevated transition-all hover:-translate-y-0.5"
            >
              Apply Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/apply"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground/15 border border-primary-foreground/30 text-primary-foreground px-7 py-4 font-semibold hover:bg-primary-foreground/25 transition-all"
            >
              <BadgeCheck className="h-4 w-4" />
              Check Eligibility
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-primary-foreground/75">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary-glow" /> 256-bit secured
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary-glow" /> 5-min approval
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 text-gold fill-gold" /> 4.9 / 5 rating
            </span>
          </div>

          {/* Stats — intersection-observer animated counters */}
          <div className="mt-6 grid grid-cols-3 gap-2 md:gap-3 max-w-lg">
            {[
              { v: 50000, s: "+", l: "Loans Approved" },
              { v: 47, s: "+", l: "Counties Reached" },
              { v: 5, s: " min", l: "Avg Approval" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl md:rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 p-3 md:p-4">
                <div className="text-xl md:text-3xl font-bold text-gradient-gold font-display">
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-primary-foreground/60 mt-1 leading-tight">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

