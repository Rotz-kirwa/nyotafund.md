import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getAllTransactions } from "@/lib/db";
import { corsPreflightResponse, corsResponse } from "@/lib/cors";
import { requireAdminAuth } from "@/lib/admin-auth";

export const APIRoute = createAPIFileRoute("/api/admin/transactions")({
  OPTIONS: async ({ request }) => corsPreflightResponse(request),
  GET: async ({ request }) => {
    const authError = requireAdminAuth(request);
    if (authError) return corsResponse(request, authError);

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
