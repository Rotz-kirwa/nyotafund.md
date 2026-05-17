import { Sparkles, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="relative bg-foreground text-background pt-20 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(80,200,120,0.18),transparent_50%),radial-gradient(circle_at_90%_100%,rgba(80,200,120,0.12),transparent_50%)]" />
      <div className="container relative mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="font-display font-bold text-xl">
                Nyota<span className="text-gradient-primary">Credit</span>
              </div>
            </a>
            <p className="mt-4 text-sm text-background/70 max-w-xs">
              Financial freedom starts here. Premium fintech serving Kenyan youth, families, and businesses.
            </p>
            <div className="mt-5 flex gap-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social" className="h-10 w-10 rounded-xl bg-background/10 hover:bg-gradient-primary grid place-items-center transition-all hover:-translate-y-0.5">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-background/70">
              {["About Us", "Loan Packages", "How it Works", "Careers", "Press"].map((l) => (
                <li key={l}><a href="#" className="hover:text-background transition">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-background/70">
              <li><a href="#eligibility" className="hover:text-background transition">Check Eligibility</a></li>
              <li><a href="#packages" className="hover:text-background transition">Apply for a Loan</a></li>
              <li><a href="#features" className="hover:text-background transition">Features</a></li>
              <li><a href="#testimonials" className="hover:text-background transition">Testimonials</a></li>
              <li><a href="#" className="hover:text-background transition">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary-glow" /> Westlands, Nairobi, Kenya</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary-glow" /> +254 700 123 456</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-glow" /> hello@nyotacredit.co.ke</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10">
          <p className="text-xs text-background/60 max-w-4xl">
            <strong className="text-background/80">Disclaimer:</strong> NyotaCredit is backed and licensed by the Central Bank of Kenya (CBK).
            Loans are subject to eligibility, affordability assessment, and applicable interest rates. Late repayments may attract additional fees.
            Borrow responsibly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs text-background/50">
            <div>© {new Date().getFullYear()} NyotaCredit Ltd. All rights reserved.</div>
            <div className="flex gap-5">
              <a href="#" className="hover:text-background transition">Privacy</a>
              <a href="#" className="hover:text-background transition">Terms</a>
              <a href="#" className="hover:text-background transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}