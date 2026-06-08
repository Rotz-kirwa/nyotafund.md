import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/nyota/Logo";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#packages", label: "Loans" },
  { href: "/eligibility", label: "Eligibility" },
  { href: "/#features", label: "Features" },
  { href: "/#testimonials", label: "Stories" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
            scrolled ? "bg-[#0a1a10]/95 backdrop-blur-md border border-white/10 shadow-soft" : "bg-transparent border border-transparent"
          }`}
        >
          <a href="#home" className="flex items-center gap-2 group">
            <Logo dark={true} />
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
              className="lg:hidden h-10 w-10 rounded-xl glass grid place-items-center text-white ring-1 ring-white/10 hover:scale-105 transition-transform"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 lg:hidden flex flex-col bg-black/60 backdrop-blur-sm p-6"
          >
            <div className="flex items-center justify-between">
              <a href="#home" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Logo dark={true} />
              </a>
              <button
                onClick={() => setOpen(false)}
                className="h-10 w-10 rounded-xl glass grid place-items-center text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex-1 flex flex-col items-start justify-center gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="w-full text-left px-4 py-3 rounded-lg text-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 transition duration-200"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto">
              {isLocal && (
                <a
                  href={adminUrl}
                  onClick={() => setOpen(false)}
                  className="block mb-3 w-full text-center rounded-lg px-4 py-3 text-sm font-semibold text-green-400 bg-green-500/5 hover:bg-green-500/10"
                >
                  Admin Portal
                </a>
              )}

              <a
                href="/apply"
                onClick={() => setOpen(false)}
                className="block w-full text-center rounded-xl bg-gradient-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-glow"
              >
                Apply Now
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}