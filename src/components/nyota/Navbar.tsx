import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/nyota/Logo";

const links = [
  { href: "#home", label: "Home" },
  { href: "#packages", label: "Loans" },
  { href: "#eligibility", label: "Eligibility" },
  { href: "#features", label: "Features" },
  { href: "#testimonials", label: "Stories" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const isLocalNetwork = window.location.hostname.startsWith("192.168.") || window.location.hostname.startsWith("10.") || window.location.hostname.startsWith("172.");
    if (isLocalHost || isLocalNetwork) {
      setIsLocal(true);
    }
  }, []);

  const adminUrl = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8082`
    : "/admin";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all duration-300 ${
            scrolled ? "glass shadow-soft" : "bg-transparent"
          }`}
        >
          <a href="#home" className="flex items-center gap-2 group">
            <Logo />
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition duration-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isLocal && (
              <a
                href={adminUrl}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-green-500/30 text-green-400 bg-green-500/10 px-4 py-2.5 text-xs font-semibold hover:bg-green-500/20 transition-all active:scale-95"
              >
                Admin Portal
              </a>
            )}
            <a
              href="/apply"
              className="hidden md:inline-flex items-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-glow hover:shadow-elevated transition-all hover:-translate-y-0.5"
            >
              Apply Now
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden h-10 w-10 rounded-xl glass grid place-items-center text-white"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-2 glass rounded-2xl p-4 flex flex-col gap-1 shadow-soft"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition duration-200"
              >
                {l.label}
              </a>
            ))}
            {isLocal && (
              <a
                href={adminUrl}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-semibold text-green-400 hover:bg-green-500/10 transition duration-200"
              >
                Admin Portal
              </a>
            )}
            <a
              href="/apply"
              onClick={() => setOpen(false)}
              className="mt-2 text-center rounded-xl bg-gradient-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-glow"
            >
              Apply Now
            </a>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}