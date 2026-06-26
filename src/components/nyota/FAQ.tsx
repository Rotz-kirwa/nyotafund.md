import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Who is eligible for a NyotaCredit loan?",
    a: "Any Kenyan citizen aged 18–65 with a valid National ID and an active M-Pesa-registered phone number. You must have a verifiable source of income — employment, self-employment, or business. We serve all 47 counties across Kenya.",
  },
  {
    q: "How much can I borrow?",
    a: "Loan limits range from KSh 10,000 up to KSh 500,000 depending on your eligibility score, monthly income, and employment status. Use our free Eligibility Checker to discover your personalised limit in seconds.",
  },
  {
    q: "How fast will I receive the money?",
    a: "Once your application is approved and the processing fee is paid via M-Pesa, funds are typically disbursed to your M-Pesa within 5–10 minutes. In high-demand periods, disbursement may take up to 24 hours.",
  },
  {
    q: "What is the processing fee for?",
    a: "The one-time processing fee covers application review, identity verification, system onboarding, and loan facilitation. It is fully refundable upon successful completion of the loan application process and is not deducted from your approved loan amount.",
  },
  {
    q: "What are the repayment terms?",
    a: "Repayment terms vary by package: Starter (3 months), Growth (6 months), Business Boost (12 months), and Elite (24 months). We offer flexible repayment schedules tailored to your income cycle — weekly, bi-weekly, or monthly.",
  },
  {
    q: "Does applying affect my credit score?",
    a: "No. Our eligibility check is a soft inquiry only and will not impact your credit bureau score. We use our own proprietary scoring engine that assesses your financial profile without a hard credit pull.",
  },
  {
    q: "Is NyotaCredit licensed and regulated?",
    a: "Yes. NyotaCredit is fully licensed and regulated by the Central Bank of Kenya (CBK). All transactions are conducted over 256-bit SSL-encrypted channels. Your personal data is stored securely and never shared with third parties.",
  },
  {
    q: "What happens if I miss a repayment?",
    a: "We strongly encourage borrowers to communicate early if they anticipate difficulty with repayments. Late payments may attract additional fees and negatively impact your future loan eligibility. Contact our 24/7 support team immediately to discuss restructuring options.",
  },
];

function FaqItem({
  q,
  a,
  index,
}: {
  q: string;
  a: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          open
            ? "bg-card shadow-elevated border-primary/30"
            : "bg-card border-border/50 hover:border-primary/20 hover:shadow-card"
        }`}
      >
        {/* Question row */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
          aria-expanded={open}
        >
          <span className="font-semibold text-foreground text-sm sm:text-base leading-snug pr-2">
            {q}
          </span>
          <span
            className={`flex-shrink-0 h-8 w-8 rounded-xl grid place-items-center transition-all duration-300 ${
              open
                ? "bg-gradient-primary shadow-glow"
                : "bg-secondary/60 group-hover:bg-accent"
            }`}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                open ? "rotate-180 text-primary-foreground" : "text-muted-foreground"
              }`}
            />
          </span>
        </button>

        {/* Answer */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <div className="h-px bg-border/60 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle mesh background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20 -z-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-4">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Got questions?{" "}
            <span className="text-gradient-primary">We've got answers</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about NyotaCredit loans, eligibility, and our process.
          </p>
        </motion.div>

        {/* FAQ grid — 2 columns on desktop */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
          {FAQS.slice(0, 4).map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} index={i} />
          ))}
          {FAQS.slice(4).map((item, i) => (
            <FaqItem key={i + 4} q={item.q} a={item.a} index={i + 4} />
          ))}
        </div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 max-w-lg mx-auto text-center rounded-3xl border border-border/50 bg-card p-8 shadow-card"
        >
          <div className="h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-4 shadow-glow">
            <HelpCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Still have questions?</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Our team is available 24/7. Reach us via WhatsApp, phone, or email — we respond within 2 hours.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/254700123456"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-glow hover:shadow-elevated transition-all hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </a>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/40 text-foreground px-5 py-2.5 text-sm font-semibold hover:bg-accent transition-all"
            >
              Send a Message
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
