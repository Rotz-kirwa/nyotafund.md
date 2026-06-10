import { createAPIFileRoute } from "@tanstack/react-start/api";
import { validateAdminPassword } from "@/lib/admin-auth";
import { corsPreflightResponse, corsResponse } from "@/lib/cors";

/**
 * POST /api/admin/login
 * Validates the admin password server-side and returns the admin secret token.
 * The token is then stored in sessionStorage and sent with every subsequent
 * admin API request as the x-admin-secret header.
 */
export const APIRoute = createAPIFileRoute("/api/admin/login")({
  OPTIONS: async ({ request }) => corsPreflightResponse(request),
  POST: async ({ request }) => {
    try {
      const { password } = (await request.json()) as { password: string };

      if (!password) {
        return corsResponse(
          request,
          Response.json({ error: "Password required" }, { status: 400 })
        );
      }

      if (!validateAdminPassword(password)) {
        // Small delay to deter brute-forcing
        await new Promise((r) => setTimeout(r, 500));
        return corsResponse(
          request,
          Response.json({ error: "Invalid password" }, { status: 401 })
        );
      }

      // Return the server-side secret token so the client can attach it to future requests
      const secret = process.env.ADMIN_SECRET ?? "nyota-admin-secret-2025";
      return corsResponse(request, Response.json({ success: true, token: secret }));
    } catch (err) {
      console.error("Login error:", err);
      return corsResponse(
        request,
        Response.json({ error: "Login failed" }, { status: 500 })
      );
    }
  },
});
