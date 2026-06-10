/**
 * Server-side admin authentication helpers.
 * All admin API routes must call `requireAdminAuth(request)` before
 * accessing the database. This keeps credentials out of the client bundle.
 */

/** The secret token sent by the admin SPA on every request. */
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "nyota-admin-secret-2025";

/** The admin login password (validated by the /api/admin/login endpoint). */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "nyota@admin2025";

/**
 * Validates the x-admin-secret header.
 * Returns null on success, or a 401 Response to return immediately.
 */
export function requireAdminAuth(request: Request): Response | null {
  const token = request.headers.get("x-admin-secret");
  if (!token || token !== ADMIN_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Validates the admin password during login.
 * Returns true if the password matches.
 */
export function validateAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
