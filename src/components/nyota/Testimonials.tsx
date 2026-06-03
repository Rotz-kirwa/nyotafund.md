import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import a1 from "@/assets/avatar-1.jpg";
import a2 from "@/assets/avatar-2.jpg";
import a3 from "@/assets/avatar-3.jpg";
import a4 from "@/assets/avatar-4.jpg";
import a5 from "@/assets/avatar-5.jpg";

const items = [
  { name: "Brian Otieno", city: "Nairobi", img: a1, text: "NyotaCredit funded my matatu business with KSh 200,000 in under 10 minutes. Truly life-changing service.", role: "Business Owner" },
  { name: "Sharon Chebet", city: "Eldoret", img: a2, text: "Got KSh 80,000 to pay my Master's tuition. The process was seamless and the team treated me with respect.", role: "Postgraduate Student" },
  { name: "Kevin Mwangi", city: "Nakuru", img: a3, text: "I expanded my hardware shop with the Business Boost package. Approval was instant — repayment is flexible.", role: "Entrepreneur" },
  { name: "Faith Achieng", city: "Kisumu", img: a4, text: "When my baby fell ill, NyotaCredit came through with emergency funds the same hour. Forever grateful.", role: "Mother & Teacher" },
  { name: "Dennis Kiptoo", city: "Kitale", img: a5, text: "Used the Elite package to import farming equipment. Lowest rates I've found in Kenya. Highly recommend.", role: "Agribusiness Owner" },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % items.length);
  const prev = () => setI((p) => (p - 1 + items.length) % items.length);
  const t = items[i];
  const paused = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setI((p) => (p + 1) % items.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 -z-10" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-4">
            Customer Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Real impact, <span className="text-gradient-primary">real Kenyans</span>
          </h2>
        </motion.div>

        <div
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-3xl p-8 md:p-12 shadow-elevated"
            >
              <Quote className="h-10 w-10 text-primary/30" />
              <p className="mt-4 text-xl md:text-2xl text-foreground/90 leading-relaxed font-display">
                "{t.text}"
              </p>
              <div className="mt-6 flex gap-1">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-5 w-5 text-gold fill-gold" />
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4">
                <img src={t.img} alt={t.name} loading="lazy" width={56} height={56} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/30" />
                <div>
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role} · {t.city}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {items.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`Show testimonial ${k + 1}`}
                  className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-gradient-primary" : "w-2 bg-muted"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prev} aria-label="Previous" className="h-11 w-11 rounded-full glass grid place-items-center hover:bg-card transition shadow-soft">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={next} aria-label="Next" className="h-11 w-11 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow hover:shadow-elevated transition">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}