import { createAPIFileRoute } from "@tanstack/react-start/api";
import { updateTransactionStatus } from "@/lib/db";

export const APIRoute = createAPIFileRoute("/api/admin/reconcile")({
  POST: async ({ request }) => {
    try {
      const { transactionId, status } = (await request.json()) as {
        transactionId: string;
        status: "pending" | "paid" | "failed";
      };

      if (!transactionId || !status) {
        return Response.json({ error: "Missing transactionId or status" }, { status: 400 });
      }

      const success = await updateTransactionStatus(transactionId, status);
      return Response.json({ success });
    } catch (err) {
      console.error("Failed to reconcile transaction:", err);
      return Response.json(
        { error: err instanceof Error ? err.message : "Reconciliation failed" },
        { status: 500 }
      );
    }
  },
});
