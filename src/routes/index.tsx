import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/nyota/Navbar";
import { Hero } from "@/components/nyota/Hero";
import { Packages } from "@/components/nyota/Packages";
import { Eligibility } from "@/components/nyota/Eligibility";
import { Features } from "@/components/nyota/Features";
import { Testimonials } from "@/components/nyota/Testimonials";
import { About } from "@/components/nyota/About";
import { CtaBanner } from "@/components/nyota/CtaBanner";
import { Footer } from "@/components/nyota/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Packages />
      <Eligibility />
      <Features />
      <Testimonials />
      <About />
      <CtaBanner />
      <Footer />
    </main>
  );
}
