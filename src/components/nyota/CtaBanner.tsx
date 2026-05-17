import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-hero animate-gradient p-10 md:p-16 text-center shadow-elevated"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,215,0,0.15),transparent_50%)]" />
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-full bg-primary-foreground/40"
              style={{ left: `${(i * 73) % 100}%`, top: `${(i * 41) % 90}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.4 }}
            />
          ))}

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full glass-dark text-primary-foreground px-4 py-1.5 text-xs font-semibold mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Limited-time approval boost
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight max-w-3xl mx-auto">
              Your Future Deserves <span className="text-gradient-gold">Financial Support</span>
            </h2>
            <p className="mt-5 text-primary-foreground/85 max-w-xl mx-auto">
              Join 50,000+ Kenyans who unlocked their next chapter with NyotaCredit. Approval in minutes — not weeks.
            </p>
            <a
              href="#eligibility"
              className="mt-8 group inline-flex items-center gap-2 rounded-2xl bg-primary-foreground text-primary px-8 py-4 font-bold shadow-elevated hover:scale-105 transition-transform"
            >
              <span className="absolute inset-0 rounded-2xl animate-pulse-ring" />
              Apply Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}