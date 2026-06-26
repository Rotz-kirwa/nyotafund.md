import { motion } from "framer-motion";
import { Sprout, TrendingUp, Briefcase, Crown, Check, ArrowRight } from "lucide-react";

const packages = [
  {
    id: "starter",
    name: "Starter",
    icon: Sprout,
    range: "KSh 10,000 – 20,000",
    fee: "KSh 100",
    benefits: ["Same-day disbursement", "No collateral", "Flexible 3-month terms"],
    featured: false,
    // Sky blue
    btnStyle: {
      background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
      shadow: "0 8px 24px rgba(14,165,233,0.35)",
      hoverShadow: "0 12px 32px rgba(14,165,233,0.55)",
      iconBg: "linear-gradient(135deg, #0ea5e9, #2563eb)",
      checkColor: "#0ea5e9",
    },
  },
  {
    id: "growth",
    name: "Growth",
    icon: TrendingUp,
    range: "KSh 50,000 – 100,000",
    fee: "KSh 150",
    benefits: ["Priority approval", "Build credit score", "Repay up to 6 months"],
    featured: true,
    // Brand green
    btnStyle: {
      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      shadow: "0 8px 24px rgba(34,197,94,0.35)",
      hoverShadow: "0 12px 32px rgba(34,197,94,0.55)",
      iconBg: "linear-gradient(135deg, #22c55e, #16a34a)",
      checkColor: "#22c55e",
    },
  },
  {
    id: "business-boost",
    name: "Business Boost",
    icon: Briefcase,
    range: "KSh 150,000 – 300,000",
    fee: "KSh 200",
    benefits: ["Dedicated advisor", "Working capital ready", "12-month repayment"],
    featured: false,
    // Amber orange
    btnStyle: {
      background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
      shadow: "0 8px 24px rgba(245,158,11,0.35)",
      hoverShadow: "0 12px 32px rgba(245,158,11,0.55)",
      iconBg: "linear-gradient(135deg, #f59e0b, #ea580c)",
      checkColor: "#f59e0b",
    },
  },
  {
    id: "elite",
    name: "Elite",
    icon: Crown,
    range: "KSh 350,000 – 500,000",
    fee: "KSh 250",
    benefits: ["VIP processing", "Lowest interest rates", "24-month repayment"],
    featured: false,
    // Violet purple
    btnStyle: {
      background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
      shadow: "0 8px 24px rgba(168,85,247,0.35)",
      hoverShadow: "0 12px 32px rgba(168,85,247,0.55)",
      iconBg: "linear-gradient(135deg, #a855f7, #7c3aed)",
      checkColor: "#a855f7",
    },
  },
];

export function Packages() {
  return (
    <section id="packages" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 -z-10" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-4">
            Loan Packages
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Choose a plan that <span className="text-gradient-primary">fits your dream</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Transparent fees. Flexible repayment. Tailored for every stage of your journey.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative"
              >
                {p.featured && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center z-10">
                    <span className="bg-gradient-gold text-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-soft">
                      Most Popular
                    </span>
                  </div>
                )}
                <div
                  className={`relative h-full rounded-3xl p-6 bg-card shadow-card border border-border/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated overflow-hidden ${
                    p.featured ? "ring-2 ring-primary/40" : ""
                  }`}
                >
                  {/* Gradient border glow on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-0" />
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative">
                    {/* Icon badge — uses package accent colour */}
                    <div
                      className="h-14 w-14 rounded-2xl grid place-items-center mb-5 shadow-lg"
                      style={{ background: p.btnStyle.iconBg }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                    <div className="mt-3 mb-1 text-2xl font-bold text-gradient-primary font-display">
                      {p.range}
                    </div>
                    <div className="text-xs text-muted-foreground mb-5">
                      Processing fee · <span className="font-semibold text-foreground">{p.fee}</span>
                    </div>

                    <ul className="space-y-2.5 mb-6">
                      {p.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                          <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: p.btnStyle.checkColor }} />
                          {b}
                        </li>
                      ))}
                    </ul>

                    {/* Apply Now — unique gradient per package */}
                    <a
                      href={`/apply?package=${p.id}`}
                      onClick={() => {
                        window.ttq?.track("ViewContent", {
                          content_name: p.name,
                          content_category: "Loan Package",
                        });
                      }}
                      className="mt-auto inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] active:scale-95"
                      style={{
                        background: p.btnStyle.background,
                        boxShadow: p.btnStyle.shadow,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = p.btnStyle.hoverShadow)}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = p.btnStyle.shadow)}
                    >
                      Apply Now <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}