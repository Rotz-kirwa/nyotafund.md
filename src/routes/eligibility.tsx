import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/nyota/Navbar";
import { Footer } from "@/components/nyota/Footer";
import { Eligibility as EligibilityComponent } from "@/components/nyota/Eligibility";

export const Route = createFileRoute("/eligibility")({
  component: EligibilityPage,
});

function EligibilityPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20">
        <EligibilityComponent />
      </div>
      <Footer />
    </main>
  );
}
