import { createAPIFileRoute } from "@tanstack/react-start/api";
import { queryStkStatus } from "@/lib/mpesa";
import { corsPreflightResponse, corsResponse } from "@/lib/cors";

export const APIRoute = createAPIFileRoute("/api/mpesa/status")({
  OPTIONS: async ({ request }) => corsPreflightResponse(request),
  POST: async ({ request }) => {
    try {
      const { checkoutRequestId } = (await request.json()) as {
        checkoutRequestId: string;
      };
      if (!checkoutRequestId) {
        return corsResponse(request, Response.json({ error: "Missing checkoutRequestId" }, { status: 400 }));
      }
      if (checkoutRequestId.startsWith("MOCK-NC-")) {
        return corsResponse(request, Response.json({
          ResultCode: "0",
          ResultDesc: "Demo transaction approved",
        }));
      }
      const result = await queryStkStatus(checkoutRequestId);
      return corsResponse(request, Response.json(result));
    } catch (err) {
      console.error("Status query error:", err);
      return corsResponse(request, Response.json(
        { error: err instanceof Error ? err.message : "Status query failed" },
        { status: 500 }
      ));
    }
  },
});
