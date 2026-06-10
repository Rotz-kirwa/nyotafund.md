import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Standalone Vite configuration for decoupled admin application.
// Proxies /api/* requests to the main TanStack Start dev server on port 3000.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8082,
    proxy: {
      "/api": {
        // TanStack Start Vite dev server runs on 5173 (not 3000)
        // In production the admin SPA is served from Vercel and calls the
        // main Render backend directly via VITE_API_URL
        target: "http://localhost:5173",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
