const DEFAULT_ALLOWED_ORIGINS = [
  "https://nyotacredit.co.ke",
  "https://www.nyotacredit.co.ke",
  "https://nyotafund-md.vercel.app",
  "https://nyota-admin.vercel.app",
  "http://localhost:8080",
  "http://localhost:8082",
  "http://localhost:5173",
];

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

function getAllowedOrigins(): Set<string> {
  const configured = process.env.ALLOWED_ORIGINS
    ?.split(",")
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean);

  return new Set(configured?.length ? configured : DEFAULT_ALLOWED_ORIGINS);
}

export function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = {
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
  };

  if (origin && getAllowedOrigins().has(normalizeOrigin(origin))) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

export function corsResponse(request: Request, response: Response): Response {
  const headers = new Headers(response.headers);
  Object.entries(getCorsHeaders(request)).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function corsPreflightResponse(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}
