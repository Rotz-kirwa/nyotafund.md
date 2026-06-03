import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Facebook, Twitter, Instagram, Linkedin,
  Mail, Phone, MapPin, Send, MessageCircle,
  Clock, Shield, ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/nyota/Logo";

const SOCIALS = [
  { Icon: Facebook,  href: "#", label: "Facebook"  },
  { Icon: Twitter,   href: "#", label: "Twitter"   },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Linkedin,  href: "#", label: "LinkedIn"  },
];

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+254 700 123 456",
    sub: "Mon – Fri, 8 am – 8 pm",
    color: "#22c55e",
    href: "tel:+254700123456",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@nyotacredit.co.ke",
    sub: "Response within 2 hours",
    color: "#f59e0b",
    href: "mailto:hello@nyotacredit.co.ke",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+254 700 123 456",
    sub: "Chat with us anytime",
    color: "#25d366",
    href: "https://wa.me/254700123456",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Westlands, Nairobi",
    sub: "Kenya",
    color: "#60a5fa",
    href: "#",
  },
];

export function Footer() {
  const [isMounted, setIsMounted] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMsg]   = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <footer
      id="contact"
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#060f08 0%,#0a1a0d 45%,#071209 100%)" }}
    >
      {/* ── decorative blobs ── */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-[120px] pointer-events-none"
           style={{ background: "rgba(34,197,94,0.12)" }} />
      <div className="absolute top-1/2 right-0 h-80 w-80 rounded-full blur-[100px] pointer-events-none"
           style={{ background: "rgba(245,158,11,0.07)" }} />
      <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full blur-[80px] pointer-events-none"
           style={{ background: "rgba(34,197,94,0.08)" }} />
      {/* grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* ── TOP: Contact Us heading ── */}
      <div className="relative z-10 pt-20 pb-0 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-4"
               style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }}>
            <MessageCircle className="h-3.5 w-3.5" /> Get in Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            We're here to{" "}
            <span style={{ background: "linear-gradient(90deg,#22c55e,#86efac)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              help you
            </span>
          </h2>
          <p className="mt-4 text-base max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Reach out through any channel — our team is always ready to assist with your loan needs.
          </p>
        </motion.div>

        {/* ── Contact cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {CONTACT_CARDS.map(({ icon: Icon, label, value, sub, color, href }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="block rounded-2xl p-5 transition-all group"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="h-11 w-11 rounded-xl grid place-items-center mb-4 transition-all group-hover:scale-110"
                   style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
              <div className="font-semibold text-white text-sm leading-snug">{value}</div>
              <div className="text-xs mt-1 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                <Clock className="h-3 w-3" /> {sub}
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── Two-column: form + footer info ── */}
        <div className="grid lg:grid-cols-2 gap-12 pb-20">

          {/* Quick message form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            {isMounted ? (
              sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-8 text-center"
                  style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  <div className="h-14 w-14 rounded-full grid place-items-center mx-auto mb-4"
                       style={{ background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.4)" }}>
                    <Send className="h-6 w-6" style={{ color: "#22c55e" }} />
                  </div>
                  <div className="font-bold text-white text-xl mb-2">Message Sent!</div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    We'll get back to you within 2 hours. Thank you for reaching out.
                  </p>
                  <button
                    onClick={() => { setSent(false); setMsg({ name: "", email: "", message: "" }); }}
                    className="mt-5 text-sm underline underline-offset-2"
                    style={{ color: "#4ade80" }}
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSend} className="space-y-4" suppressHydrationWarning>
                  <div className="grid grid-cols-2 gap-4" suppressHydrationWarning>
                    {[
                      { k: "name",  l: "Your Name",    p: "Brian Otieno",            t: "text"  },
                      { k: "email", l: "Email Address", p: "brian@example.com",       t: "email" },
                    ].map((f) => (
                      <div key={f.k} suppressHydrationWarning>
                        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                               style={{ color: "rgba(255,255,255,0.45)" }}>{f.l}</label>
                        <input
                          required
                          type={f.t}
                          autoComplete="new-password"
                          data-lpignore="true"
                          data-1p-ignore="true"
                          data-form-type="other"
                          placeholder={f.p}
                          value={msg[f.k as keyof typeof msg]}
                          onChange={(e) => setMsg({ ...msg, [f.k]: e.target.value })}
                          className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.12)"; }}
                          onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                          suppressHydrationWarning
                        />
                      </div>
                    ))}
                  </div>
                  <div suppressHydrationWarning>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                           style={{ color: "rgba(255,255,255,0.45)" }}>Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you?"
                      value={msg.message}
                      onChange={(e) => setMsg({ ...msg, message: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all resize-none"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.12)"; }}
                      onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                      suppressHydrationWarning
                    />
                  </div>
                  <button
                    type="submit"
                    className="group w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg,#15803d,#22c55e)", boxShadow: "0 8px 28px rgba(34,197,94,0.3)" }}
                  >
                    Send Message
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )
            ) : (
              <div
                className="rounded-2xl p-6 space-y-6 animate-pulse"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  height: "320px",
                }}
              >
                {/* name & email input skeletons */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-white/10 rounded w-1/3" />
                    <div className="h-11 bg-white/5 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/10 rounded w-1/3" />
                    <div className="h-11 bg-white/5 rounded-xl" />
                  </div>
                </div>

                {/* message input skeleton */}
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded w-1/4" />
                  <div className="h-28 bg-white/5 rounded-xl" />
                </div>

                {/* submit button skeleton */}
                <div className="h-12 bg-white/10 rounded-xl" />
              </div>
            )}
          </motion.div>

          {/* Footer links + brand */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            {/* Brand */}
            <div>
              <a href="#home"><Logo dark size={34} /></a>
              <p className="mt-4 text-sm max-w-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Financial freedom starts here. Premium fintech serving Kenyan youth, families, and businesses since 2020.
              </p>
              {/* Social icons */}
              <div className="mt-5 flex gap-2">
                {SOCIALS.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="h-10 w-10 rounded-xl grid place-items-center transition-all hover:-translate-y-1 hover:shadow-lg"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg,#15803d,#22c55e)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Company</h4>
                <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {["About Us", "Loan Packages", "How it Works", "Careers", "Press"].map((l) => (
                    <li key={l}>
                      <a href="#" className="hover:text-white transition-colors flex items-center gap-1 group">
                        <span className="h-px w-0 group-hover:w-3 inline-block transition-all rounded-full" style={{ background: "#22c55e" }} />
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Products</h4>
                <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {["Check Eligibility", "Apply for a Loan", "Features", "Testimonials", "FAQ"].map((l) => (
                    <li key={l}>
                      <a href="#" className="hover:text-white transition-colors flex items-center gap-1 group">
                        <span className="h-px w-0 group-hover:w-3 inline-block transition-all rounded-full" style={{ background: "#22c55e" }} />
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-3 rounded-2xl p-4"
                 style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="h-10 w-10 rounded-xl grid place-items-center flex-shrink-0"
                   style={{ background: "rgba(34,197,94,0.15)" }}>
                <Shield className="h-5 w-5" style={{ color: "#22c55e" }} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">CBK Licensed & Regulated</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Central Bank of Kenya • Ref: CBK/2024/001</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t py-8" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <p className="text-xs mb-4 max-w-4xl" style={{ color: "rgba(255,255,255,0.35)" }}>
            <strong style={{ color: "rgba(255,255,255,0.55)" }}>Disclaimer:</strong> NyotaCredit is licensed by the Central Bank of Kenya (CBK).
            Loans are subject to eligibility, affordability assessment, and applicable interest rates.
            Late repayments may attract additional fees. Borrow responsibly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            <div>© {new Date().getFullYear()} NyotaCredit Ltd. All rights reserved.</div>
            <div className="flex gap-5">
              {["Privacy", "Terms", "Cookies"].map((l) => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}