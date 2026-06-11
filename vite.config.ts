import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsConfigPaths(),
    tanstackStart({
      server: { preset: "node" },
    }),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.jpg", "og-image.jpg"],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "NyotaCredit",
        short_name: "Nyota",
        description: "Lighting Your Financial Future",
        theme_color: "#0a190f",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          },
        ],
      },
    }),
  ],

  build: {
    // Target modern browsers
    target: ["es2022", "chrome90", "firefox90", "safari15"],

    // Inline assets < 4kb as base64 to save round trips
    assetsInlineLimit: 4096,

    // CSS code splitting per chunk
    cssCodeSplit: true,

    // esbuild minifier — fast and produces small output
    minify: "esbuild",

    // No source maps in prod
    sourcemap: false,

    rollupOptions: {
      output: {
        // Content-hashed filenames for immutable caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },

    // Warn on chunks > 600kb
    chunkSizeWarningLimit: 600,
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-query",
      "lucide-react",
    ],
  },
});
