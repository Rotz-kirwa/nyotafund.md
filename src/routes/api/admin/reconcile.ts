import { createAPIFileRoute } from "@tanstack/react-start/api";
import { updateTransactionStatus } from "@/lib/db";
import { corsPreflightResponse, corsResponse } from "@/lib/cors";
import { requireAdminAuth } from "@/lib/admin-auth";

export const APIRoute = createAPIFileRoute("/api/admin/reconcile")({
  OPTIONS: async ({ request }) => corsPreflightResponse(request),
  POST: async ({ request }) => {
    const authError = requireAdminAuth(request);
    if (authError) return corsResponse(request, authError);

    try {
      const { transactionId, status } = (await request.json()) as {
        transactionId: string;
        status: "pending" | "paid" | "failed";
      };

      if (!transactionId || !status) {
        return corsResponse(request, Response.json({ error: "Missing transactionId or status" }, { status: 400 }));
      }

      const success = await updateTransactionStatus(transactionId, status);
      return corsResponse(request, Response.json({ success }));
    } catch (err) {
      console.error("Failed to reconcile transaction:", err);
      return corsResponse(request, Response.json(
        { error: err instanceof Error ? err.message : "Reconciliation failed" },
        { status: 500 }
      ));
    }
  },
});
