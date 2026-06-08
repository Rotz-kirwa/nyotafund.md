import { createAPIFileRoute } from "@tanstack/react-start/api";
import { saveEligibilityCheck } from "@/lib/db";
import { corsPreflightResponse, corsResponse } from "@/lib/cors";

export const APIRoute = createAPIFileRoute("/api/eligibility")({
  OPTIONS: async ({ request }) => corsPreflightResponse(request),
  POST: async ({ request }) => {
    try {
      const body = await request.json() as {
        name: string;
        nationalId: string;
        phone: string;
        income: number;
        employmentStatus: string;
      };

      const { name, nationalId, phone, income, employmentStatus } = body;

      if (!name || !nationalId || !phone || !income || !employmentStatus) {
        return corsResponse(request, Response.json({ error: "Missing required fields" }, { status: 400 }));
      }

      // 1. Scoring Logic
      let baseScore = 30; // base score

      // Income factors
      if (income >= 200000) baseScore += 45;
      else if (income >= 100000) baseScore += 35;
      else if (income >= 50000) baseScore += 25;
      else if (income >= 20000) baseScore += 15;
      else baseScore += 5;

      // Employment Status factors
      if (employmentStatus === "Employed") baseScore += 20;
      else if (employmentStatus === "Self-Employed") baseScore += 15;
      else baseScore += 0;

      // Add a tiny bit of randomness based on ID length to simulate credit history checks
      const randomFactor = (nationalId.length * 3) % 10;
      let finalScore = Math.min(baseScore + randomFactor, 98); // cap at 98 for realism

      // 2. Assign Tier
      let tier = "Tier 1";
      let min_limit = 10000;
      let max_limit = 50000;
      let packageId = "starter";

      if (finalScore >= 75) {
        tier = "Tier 3";
        min_limit = 150000;
        max_limit = 500000;
        packageId = "elite";
      } else if (finalScore >= 50) {
        tier = "Tier 2";
        min_limit = 50000;
        max_limit = 150000;
        packageId = "growth";
      }

      // 3. Save to Database
      const record = await saveEligibilityCheck({
        name,
        national_id: nationalId,
        phone,
        income,
        employment_status: employmentStatus,
        score: finalScore,
        tier,
        min_limit,
        max_limit,
      });

      return corsResponse(request, Response.json({
        success: true,
        score: finalScore,
        tier,
        min_limit,
        max_limit,
        packageId,
        recordId: record.id
      }));

    } catch (err) {
      console.error("Eligibility check error:", err);
      return corsResponse(request, Response.json(
        { error: "Internal server error during eligibility check" },
        { status: 500 }
      ));
    }
  },
});
