import { createAPIFileRoute } from "@tanstack/react-start/api";
import { initiateStkPush } from "@/lib/mpesa";
import { addTransaction } from "@/lib/db";
import { corsPreflightResponse, corsResponse } from "@/lib/cors";

export const APIRoute = createAPIFileRoute("/api/mpesa/stk-push")({
  OPTIONS: async ({ request }) => corsPreflightResponse(request),
  POST: async ({ request }) => {
    try {
      const { phone, amount, accountRef, name, nationalId, packageId } = (await request.json()) as {
        phone: string;
        amount: number;
        accountRef: string;
        name?: string;
        nationalId?: string;
        packageId?: string;
      };

      if (!phone || !amount || !accountRef) {
        return corsResponse(request, Response.json({ error: "Missing required fields" }, { status: 400 }));
      }

      const appUrl = process.env.APP_URL ?? "https://nyotafund-md.onrender.com";
      const callbackUrl = `${appUrl.replace(/\/+$/, "")}/api/mpesa/callback`;

      // 1. Attempt live M-Pesa STK push
      let checkoutRequestId = `MOCK-NC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      let responseDescription = "STK Push initiated successfully (Demo Mode)";
      const hasMpesaKeys = process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET && process.env.MPESA_SHORTCODE && process.env.MPESA_PASSKEY;

      if (hasMpesaKeys) {
        try {
          const result = await initiateStkPush(phone, amount, accountRef, callbackUrl);
          if (result && result.CheckoutRequestID) {
            checkoutRequestId = result.CheckoutRequestID;
            responseDescription = result.ResponseDescription || "STK Push initiated successfully";
          } else {
            throw new Error("Invalid response from Safaricom");
          }
        } catch (mpesaError) {
          console.error("M-Pesa STK push failed:", mpesaError);
          const isProdEnv = process.env.NODE_ENV === "production" || process.env.MPESA_ENV === "production";
          if (isProdEnv) {
            return corsResponse(request, Response.json({
              error: `M-Pesa transaction failed: ${mpesaError instanceof Error ? mpesaError.message : "Internal Gateway Error"}. Please check your phone number and try again.`
            }, { status: 500 }));
          } else {
            checkoutRequestId = `MOCK-NC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            responseDescription = `STK Push failed (${mpesaError instanceof Error ? mpesaError.message : "Error"}). Running demo fallback.`;
          }
        }
      }

      // 2. Save pending transaction directly in PostgreSQL database
      await addTransaction({
        name: name || "Anonymous Client",
        phone: phone,
        national_id: nationalId || "12345678",
        package_id: packageId || "starter",
        fee_amount: amount,
        status: "pending",
        transaction_id: checkoutRequestId,
      });

      return corsResponse(request, Response.json({
        CheckoutRequestID: checkoutRequestId,
        ResponseDescription: responseDescription,
        success: true
      }));
    } catch (err) {
      console.error("STK Push error:", err);
      return corsResponse(request, Response.json(
        { error: err instanceof Error ? err.message : "STK Push failed" },
        { status: 500 }
      ));
    }
  },
});
