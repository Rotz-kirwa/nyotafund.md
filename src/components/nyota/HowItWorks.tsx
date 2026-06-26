import { motion } from "framer-motion";
import { ClipboardList, BadgeCheck, Banknote, ArrowRight } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Apply in Minutes",
    desc: "Fill in your details — name, ID, phone number, and income. Our intelligent form takes under 2 minutes to complete.",
    color: "#22c55e",
    grad: "linear-gradient(135deg, #15803d, #22c55e)",
    glow: "rgba(34,197,94,0.35)",
  },
  {
    num: "02",
    icon: BadgeCheck,
    title: "Instant Verification",
    desc: "Our AI scoring engine reviews your application in real-time. No credit bureau pull. No long waiting. Results in seconds.",
    color: "#f59e0b",
    grad: "linear-gradient(135deg, #d97706, #f59e0b)",
    glow: "rgba(245,158,11,0.35)",
  },
  {
    num: "03",
    icon: Banknote,
    title: "Funds to M-Pesa",
    desc: "Once approved, money is disbursed directly to your M-Pesa within minutes. No branches. No paperwork. Just cash.",
    color: "#60a5fa",
    grad: "linear-gradient(135deg, #2563eb, #60a5fa)",
    glow: "rgba(96,165,250,0.35)",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/40 -z-10" />
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 50%, rgba(34,197,94,0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(245,158,11,0.1) 0%, transparent 50%)",
        }}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-4">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Get funded in{" "}
            <span className="text-gradient-primary">3 easy steps</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            No bank visits. No mountains of paperwork. Just a simple, digital process built for busy Kenyans.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-[72px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px z-0"
            style={{ background: "linear-gradient(to right, #22c55e, #f59e0b, #60a5fa)" }}
          />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-6 relative z-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  className="group flex flex-col items-center text-center"
                >
                  {/* Step badge + icon */}
                  <div className="relative mb-8">
                    {/* Outer glow ring */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                      style={{ background: step.glow }}
                    />
                    {/* Circle */}
                    <div
                      className="relative h-[88px] w-[88px] rounded-full grid place-items-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                      style={{ background: step.grad, boxShadow: `0 12px 36px ${step.glow}` }}
                    >
                      <Icon className="h-9 w-9 text-white" />
                    </div>
                    {/* Step number badge */}
                    <div
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full grid place-items-center text-[11px] font-black text-white border-2 border-background"
                      style={{ background: step.grad }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  {/* Text */}
                  <div
                    className="text-xs font-black uppercase tracking-[0.2em] mb-2"
                    style={{ color: step.color }}
                  >
                    Step {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>

                  {/* Arrow between steps — mobile only */}
                  {i < STEPS.length - 1 && (
                    <div className="md:hidden mt-6 text-muted-foreground/40">
                      <ArrowRight className="h-5 w-5 mx-auto rotate-90" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <a
            href="/apply"
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-primary text-primary-foreground px-8 py-4 font-semibold shadow-glow hover:shadow-elevated transition-all hover:-translate-y-0.5"
          >
            Start Your Application
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            Takes under 2 minutes · No credit impact · Instant result
          </p>
        </motion.div>
      </div>
    </section>
  );
}
