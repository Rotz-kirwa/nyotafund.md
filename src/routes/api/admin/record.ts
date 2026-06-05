import { createAPIFileRoute } from "@tanstack/react-start/api";
import { addTransaction } from "@/lib/db";
import { corsPreflightResponse, corsResponse } from "@/lib/cors";

// API Route to record a transaction manually into the back-office database schema
export const APIRoute = createAPIFileRoute("/api/admin/record")({
  OPTIONS: async ({ request }) => corsPreflightResponse(request),
  POST: async ({ request }) => {
    try {
      const tx = (await request.json()) as {
        name: string;
        phone: string;
        national_id: string;
        package_id: string;
        fee_amount: number;
        status: "pending" | "paid" | "failed";
        transaction_id: string;
      };

      if (!tx.name || !tx.phone || !tx.national_id || !tx.package_id || !tx.fee_amount || !tx.status || !tx.transaction_id) {
        return corsResponse(request, Response.json({ error: "Missing required fields" }, { status: 400 }));
      }

      const record = await addTransaction(tx);
      return corsResponse(request, Response.json({ success: true, data: record }));
    } catch (err) {
      console.error("Failed to record manual transaction:", err);
      return corsResponse(request, Response.json(
        { error: err instanceof Error ? err.message : "Record failed" },
        { status: 500 }
      ));
    }
  },
});
