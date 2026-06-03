import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CheckoutPage } from "@/components/nyota/Checkout";

const searchSchema = z.object({
  package: z.enum(["starter", "growth", "business-boost", "elite"]).optional().catch(undefined),
});

export const Route = createFileRoute("/apply")({
  validateSearch: searchSchema,
  component: Apply,
});

function Apply() {
  const { package: pkg } = Route.useSearch();
  return <CheckoutPage selectedPackage={pkg} />;
}
