import { motion } from "framer-motion";
import { Heart, Target, Users, Award } from "lucide-react";

const stats = [
  { icon: Users, v: "120K+", l: "Lives Empowered" },
  { icon: Heart, v: "47", l: "Counties Served" },
  { icon: Target, v: "KSh 8B+", l: "Disbursed" },
  { icon: Award, v: "CBK", l: "Licensed" },
];

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-4">
              Our Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Uplifting the youth, <span className="text-gradient-primary">building the nation</span>
            </h2>
            <p className="mt-5 text-muted-foreground text-lg">
              NyotaCredit was born with one mission: to make premium financial services accessible to every Kenyan.
              Whether you're a student chasing a degree, an entrepreneur scaling a hustle, or a parent meeting urgent needs —
              we provide quick, fair, and dignified financing.
            </p>
            <p className="mt-4 text-muted-foreground">
              Backed by world-class technology and licensed by the Central Bank of Kenya, we've empowered over 120,000 dreams
              across the country. Your future deserves more than a maybe.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.l}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card border border-border/50"
                  >
                    <div className="h-11 w-11 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground font-display">{s.v}</div>
                      <div className="text-xs text-muted-foreground">{s.l}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-primary rounded-[3rem] rotate-6 opacity-30 blur-2xl" />
              <div className="relative h-full glass rounded-[3rem] p-8 shadow-elevated overflow-hidden">
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/30 blur-3xl" />
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <div className="text-6xl font-bold text-gradient-primary font-display">"</div>
                    <p className="text-xl text-foreground font-display leading-snug mt-2">
                      Empowering Kenyan dreams — one loan, one family, one future at a time.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-6 border-t border-border/40">
                    <div className="h-10 w-10 rounded-xl bg-gradient-gold grid place-items-center">
                      <Heart className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">Our Promise</div>
                      <div className="text-xs text-muted-foreground">Mission-driven, people-first</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}