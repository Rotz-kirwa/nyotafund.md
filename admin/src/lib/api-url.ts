// Use the environment variable if provided, otherwise:
// - In local dev: use an empty base (relative URLs) so Vite's proxy forwards /api/* to the main app
// - In production: VITE_API_URL must be set (e.g. https://nyotafund-md.onrender.com)
const ENV_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

const API_BASE_URL = ENV_URL !== undefined && ENV_URL !== ""
  ? ENV_URL
  : typeof window !== "undefined" && window.location.hostname === "localhost"
    ? ""  // Empty = relative URLs; Vite proxy forwards /api/* → localhost:5173
    : "https://nyotafund-md.onrender.com";

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

