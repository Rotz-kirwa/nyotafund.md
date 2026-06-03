import { createAPIFileRoute } from "@tanstack/react-start/api";
import { queryStkStatus } from "@/lib/mpesa";

export const APIRoute = createAPIFileRoute("/api/mpesa/status")({
  POST: async ({ request }) => {
    try {
      const { checkoutRequestId } = (await request.json()) as {
        checkoutRequestId: string;
      };
      if (!checkoutRequestId) {
        return Response.json({ error: "Missing checkoutRequestId" }, { status: 400 });
      }
      const result = await queryStkStatus(checkoutRequestId);
      return Response.json(result);
    } catch (err) {
      console.error("Status query error:", err);
      return Response.json(
        { error: err instanceof Error ? err.message : "Status query failed" },
        { status: 500 }
      );
    }
  },
});
