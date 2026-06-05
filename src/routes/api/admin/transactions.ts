import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getAllTransactions } from "@/lib/db";
import { corsPreflightResponse, corsResponse } from "@/lib/cors";

export const APIRoute = createAPIFileRoute("/api/admin/transactions")({
  OPTIONS: async ({ request }) => corsPreflightResponse(request),
  GET: async ({ request }) => {
    try {
      const list = await getAllTransactions();
      return corsResponse(request, Response.json({ success: true, data: list }));
    } catch (err) {
      console.error("Failed to get transactions:", err);
      return corsResponse(request, Response.json(
        { error: err instanceof Error ? err.message : "Failed to load transactions" },
        { status: 500 }
      ));
    }
  },
});
