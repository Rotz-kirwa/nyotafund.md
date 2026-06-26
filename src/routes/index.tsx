import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Navbar } from "@/components/nyota/Navbar";
import { Hero } from "@/components/nyota/Hero";

// Lazy-load all below-the-fold sections — they are NOT needed for LCP
const HowItWorks  = lazy(() => import("@/components/nyota/HowItWorks").then(m => ({ default: m.HowItWorks })));
const Packages    = lazy(() => import("@/components/nyota/Packages").then(m => ({ default: m.Packages })));
const Eligibility = lazy(() => import("@/components/nyota/Eligibility").then(m => ({ default: m.Eligibility })));
const Features    = lazy(() => import("@/components/nyota/Features").then(m => ({ default: m.Features })));
const Testimonials= lazy(() => import("@/components/nyota/Testimonials").then(m => ({ default: m.Testimonials })));
const About       = lazy(() => import("@/components/nyota/About").then(m => ({ default: m.About })));
const FAQ         = lazy(() => import("@/components/nyota/FAQ").then(m => ({ default: m.FAQ })));
const CtaBanner   = lazy(() => import("@/components/nyota/CtaBanner").then(m => ({ default: m.CtaBanner })));
const Footer      = lazy(() => import("@/components/nyota/Footer").then(m => ({ default: m.Footer })));

// Lightweight skeleton shown while lazy sections load
function SectionSkeleton() {
  return (
    <div className="py-24 px-4">
      <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-muted mx-auto" />
        <div className="h-4 w-80 rounded-lg bg-muted mx-auto" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Above-the-fold — loaded eagerly */}
      <Navbar />
      <Hero />
      {/* Below-the-fold — lazy loaded, non-blocking */}
      <Suspense fallback={<SectionSkeleton />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Packages />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Eligibility />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Features />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <FAQ />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <CtaBanner />
      </Suspense>
      <Suspense fallback={<div className="h-32 bg-muted animate-pulse" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
