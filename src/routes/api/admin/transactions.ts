import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getAllTransactions } from "@/lib/db";

export const APIRoute = createAPIFileRoute("/api/admin/transactions")({
  GET: async () => {
    try {
      const list = await getAllTransactions();
      return Response.json({ success: true, data: list });
    } catch (err) {
      console.error("Failed to get transactions:", err);
      return Response.json(
        { error: err instanceof Error ? err.message : "Failed to load transactions" },
        { status: 500 }
      );
    }
  },
});
