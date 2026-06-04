import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NyotaCredit — Lighting Your Financial Future" },
      { name: "description", content: "NyotaCredit offers fast, secure loans from KSh 10,000 to KSh 500,000 for Kenyan youth, families, and entrepreneurs. Apply in minutes." },
      { name: "author", content: "NyotaCredit" },
      { name: "theme-color", content: "#0a190f" },
      { name: "color-scheme", content: "light" },
      // Open Graph
      { property: "og:title", content: "NyotaCredit — Lighting Your Financial Future" },
      { property: "og:description", content: "Premium Kenyan fintech. Fast approval, flexible repayment, trusted nationwide." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://nyotacredit.com/og-image.jpg" },
      { property: "og:image:width", content: "736" },
      { property: "og:image:height", content: "736" },
      { property: "og:image:alt", content: "NyotaCredit — Lighting Your Financial Future" },
      // Twitter / X card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@NyotaCredit" },
      { name: "twitter:title", content: "NyotaCredit — Lighting Your Financial Future" },
      { name: "twitter:description", content: "Premium Kenyan fintech. Fast approval, flexible repayment, trusted nationwide." },
      { name: "twitter:image", content: "https://nyotacredit.com/og-image.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: "/favicon.jpg" },
      { rel: "apple-touch-icon", href: "/og-image.jpg" },
      // DNS prefetch + preconnect for Google Fonts CDN
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      // Load only the weights we actually use; swap prevents FOIT
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [showDevBadge, setShowDevBadge] = useState(false);

  useEffect(() => {
    const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const isLocalNetwork = window.location.hostname.startsWith("192.168.") || window.location.hostname.startsWith("10.") || window.location.hostname.startsWith("172.");
    if (isLocalHost || isLocalNetwork) {
      setShowDevBadge(true);
    }
  }, []);

  const adminUrl = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8082`
    : "/admin";

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {showDevBadge && (
        <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
          <a
            href={adminUrl}
            className="flex items-center gap-2 rounded-full bg-black/90 hover:bg-black border border-green-500/40 hover:border-green-400 text-white px-4 py-2.5 text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ boxShadow: "0 0 15px rgba(34,197,94,0.25)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-green-400 font-mono tracking-wider">DEV:</span>
            <span>Open Admin Dashboard ➜</span>
          </a>
        </div>
      )}
    </QueryClientProvider>
  );
}
