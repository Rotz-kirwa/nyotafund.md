import { createAPIFileRoute } from "@tanstack/react-start/api";
import { updateTransactionStatus } from "@/lib/db";
import { corsPreflightResponse, corsResponse } from "@/lib/cors";

export const APIRoute = createAPIFileRoute("/api/mpesa/callback")({
  OPTIONS: async ({ request }) => corsPreflightResponse(request),
  POST: async ({ request }) => {
    try {
      const body = (await request.json()) as {
        Body?: {
          stkCallback?: {
            CheckoutRequestID: string;
            ResultCode: number;
            ResultDesc?: string;
          };
        };
      };

      console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2));

      const callback = body?.Body?.stkCallback;
      if (callback && callback.CheckoutRequestID) {
        const checkoutRequestId = callback.CheckoutRequestID;
        const status = callback.ResultCode === 0 ? "paid" : "failed";
        
        // Securely update status in PostgreSQL
        const updated = await updateTransactionStatus(checkoutRequestId, status);
        console.log(`Transaction ${checkoutRequestId} status updated to ${status}. DB Success: ${updated}`);
      }

      return corsResponse(request, Response.json({ ResultCode: 0, ResultDesc: "Accepted" }));
    } catch (err) {
      console.error("Callback error:", err);
      return corsResponse(request, Response.json({ ResultCode: 0, ResultDesc: "Accepted" }));
    }
  },
});
