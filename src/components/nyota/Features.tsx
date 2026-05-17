import { motion } from "framer-motion";
import { Zap, ShieldCheck, Clock, Repeat, MapPin, Headphones } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Loan Processing", desc: "Get funds in your M-Pesa within minutes of approval." },
  { icon: ShieldCheck, title: "Secure Transactions", desc: "Bank-grade 256-bit encryption protects every transaction." },
  { icon: Clock, title: "Fast Approval", desc: "Smart algorithms approve eligible applicants in under 5 minutes." },
  { icon: Repeat, title: "Flexible Repayment", desc: "Choose schedules from 30 days up to 24 months." },
  { icon: MapPin, title: "Trusted Nationwide", desc: "Serving all 47 counties across Kenya with local expertise." },
  { icon: Headphones, title: "24/7 Customer Support", desc: "Real humans ready to help you, anytime, day or night." },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-secondary/40 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-4">
            Why NyotaCredit
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Built for <span className="text-gradient-primary">real Kenyans</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every feature is engineered to give you speed, safety, and total peace of mind.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-3xl bg-card p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}