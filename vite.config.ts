import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsConfigPaths(),
    tanstackStart({
      server: { preset: "node" },
    }),
    react(),
  ],

  build: {
    // Target modern browsers — smaller output, no legacy polyfills
    target: ["es2022", "chrome90", "firefox90", "safari15"],

    // Inline assets < 4kb as base64 to save round trips
    assetsInlineLimit: 4096,

    // Enable CSS code splitting per-chunk
    cssCodeSplit: true,

    // Use rollup's native minifier (esbuild is faster; use for prod)
    minify: "esbuild",

    // Source maps off in prod for smaller payload
    sourcemap: false,

    rollupOptions: {
      output: {
        // Deterministic filenames with content hash for long-lived caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",

        // Manual chunk splitting — vendor libs separate from app code
        manualChunks(id) {
          // Core React runtime — never changes, cache forever
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          // TanStack — router + query
          if (id.includes("@tanstack/react-router") || id.includes("@tanstack/react-query")) {
            return "vendor-tanstack";
          }
          // Framer Motion — large, lazy loaded with below-fold sections
          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils")) {
            return "vendor-motion";
          }
          // Radix UI primitives — used across many components
          if (id.includes("@radix-ui")) {
            return "vendor-radix";
          }
          // Recharts — only used in admin, split out
          if (id.includes("recharts") || id.includes("d3-")) {
            return "vendor-charts";
          }
          // Lucide icons — tree-shaken but still isolate
          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }
          // Everything else in node_modules
          if (id.includes("node_modules/")) {
            return "vendor-misc";
          }
        },
      },
    },

    // Warn on chunks > 500kb (down from default 1mb)
    chunkSizeWarningLimit: 500,
  },

  // Optimize deps pre-bundling
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-query",
      "lucide-react",
    ],
    // Don't pre-bundle these — they're lazy loaded
    exclude: ["framer-motion"],
  },

  // Compression handled by Vercel CDN edge (brotli/gzip auto)
  // We just ensure assets have correct content hashes for immutable caching
});
