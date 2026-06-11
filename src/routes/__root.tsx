import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

declare global {
  interface Window {
    ttq: any;
    TiktokAnalyticsObject: any;
  }
}
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
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
      { rel: "manifest", href: "/manifest.webmanifest" },
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
        {import.meta.env.VITE_TIKTOK_PIXEL_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${import.meta.env.VITE_TIKTOK_PIXEL_ID}');
                ttq.page();
              }(window, document, 'ttq');
              `,
            }}
          />
        )}
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
  // Always start with a static fallback so SSR and the first client render agree.
  // The real URL is patched in after hydration inside useEffect.
  const [adminUrl, setAdminUrl] = useState("/admin");

  useEffect(() => {
    // Only register SW in the browser
    if (typeof window !== "undefined") {
      import("virtual:pwa-register").then(({ registerSW }) => {
        registerSW({ immediate: true });
      }).catch(err => console.error("PWA registration failed:", err));
    }

    const hostname = window.location.hostname;
    const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
    const isLocalNetwork =
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.");
    if (isLocalHost || isLocalNetwork) {
      setAdminUrl(`${window.location.protocol}//${hostname}:8082`);
      setShowDevBadge(true);
    }
  }, []);

  // Track page views on route changes
  const location = useRouterState({ select: (s) => s.location });
  useEffect(() => {
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.page();
    }
  }, [location.pathname]);

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
