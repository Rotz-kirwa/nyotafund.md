import { createAPIFileRoute } from "@tanstack/react-start/api";
import { updateTransactionStatus } from "@/lib/db";

export const APIRoute = createAPIFileRoute("/api/mpesa/callback")({
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

      return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
    } catch (err) {
      console.error("Callback error:", err);
      return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }
  },
});
