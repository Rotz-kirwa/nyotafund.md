import type { IncomingMessage, ServerResponse } from "node:http";
import { join } from "node:path";
import { readdirSync, statSync, existsSync, createReadStream, readFileSync } from "node:fs";

// Find the real TanStack SSR entry — it's the LARGEST server-*.js file
// (our error wrapper is ~2.5kb; the real SSR bundle is ~18kb+)
function findServerEntry(): string {
  const dir = join(process.cwd(), "dist", "server", "assets");
  const files = readdirSync(dir)
    .filter((f) => f.startsWith("server-") && f.endsWith(".js"))
    .map((f) => ({ name: f, size: statSync(join(dir, f)).size }))
    .sort((a, b) => b.size - a.size); // largest first = real SSR entry

  if (!files.length) throw new Error(`No server-*.js found in ${dir}`);
  return join(dir, files[0].name);
}

let handlerCache: { fetch: (req: Request) => Promise<Response> } | null = null;

async function getHandler() {
  if (handlerCache) return handlerCache;
  const entryPath = findServerEntry();
  console.log("[SSR] Loading entry:", entryPath);
  const mod = await import(entryPath);
  handlerCache = (mod.default ?? mod) as { fetch: (req: Request) => Promise<Response> };
  return handlerCache;
}

function tryServeStatic(req: IncomingMessage, res: ServerResponse): boolean {
  try {
    const protocol = (req.headers["x-forwarded-proto"] as string) ?? "https";
    const host = (req.headers["x-forwarded-host"] as string) ?? (req.headers["host"] as string) ?? "localhost";
    const url = new URL(req.url ?? "", `${protocol}://${host}`);
    let pathname = decodeURIComponent(url.pathname || "/");

    // Normalize root to index.html
    if (pathname === "/") {
      const indexPath = join(process.cwd(), "dist", "client", "index.html");
      if (existsSync(indexPath)) {
        const content = readFileSync(indexPath, "utf8");
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(content);
        return true;
      }
      return false;
    }

    // Serve static assets from dist/client
    const filePath = join(process.cwd(), "dist", "client", pathname);
    const ext = pathname.split(".").pop()?.toLowerCase();
    const map: Record<string, string> = {
      js: "application/javascript; charset=utf-8",
      css: "text/css; charset=utf-8",
      html: "text/html; charset=utf-8",
      json: "application/json; charset=utf-8",
      svg: "image/svg+xml",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      ico: "image/x-icon",
    };

    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const contentType = (ext && map[ext]) || "application/octet-stream";
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);

      // Add cache headers for hashed assets and images
      if (pathname.startsWith("/assets/") || ["js", "css", "png", "jpg", "jpeg", "webp", "svg", "ico"].includes(ext ?? "")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }

      const stream = createReadStream(filePath);
      stream.pipe(res);
      return true;
    }

    // SPA fallback: if GET and no matching static file, serve index.html so client router can handle the route
    if ((req.method ?? "GET") === "GET") {
      const indexPath = join(process.cwd(), "dist", "client", "index.html");
      if (existsSync(indexPath)) {
        const content = readFileSync(indexPath, "utf8");
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(content);
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    let server;
    try {
      server = await getHandler();
    } catch (err) {
      // If server bundle is missing, try to serve static client files (SPA fallback)
      const served = tryServeStatic(req, res);
      if (served) return;
      throw err;
    }

    const protocol = (req.headers["x-forwarded-proto"] as string) ?? "https";
    const host = (req.headers["x-forwarded-host"] as string) ?? (req.headers["host"] as string) ?? "localhost";
    const url = `${protocol}://${host}${req.url}`;

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const body = hasBody ? await readBody(req) : undefined;

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (val == null) continue;
      if (Array.isArray(val)) val.forEach((v) => headers.append(key, v));
      else headers.set(key, val as string);
    }

    const fetchReq = new Request(url, {
      method: req.method ?? "GET",
      headers,
      body: hasBody ? body : undefined,
      // @ts-expect-error - Node 18+ requires duplex for body
      duplex: hasBody ? "half" : undefined,
    });

    const response = await server.fetch(fetchReq);

    // If SSR returned 404 for a GET request, serve SPA index.html fallback so
    // client-side router can handle the route (helps for strange deep links).
    if (response.status === 404 && (req.method ?? "GET") === "GET") {
      console.warn("[SSR] Returned 404 — falling back to static index.html");
      const served = tryServeStatic(req, res);
      if (served) return;
    }

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (response.body) {
      const reader = response.body.getReader();
      const pump = async (): Promise<void> => {
        const { done, value } = await reader.read();
        if (done) { res.end(); return; }
        res.write(value);
        return pump();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (err) {
    console.error("[SSR handler error]", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`<!doctype html><html><body><h1>Server Error</h1><pre>${err instanceof Error ? err.message : String(err)}</pre></body></html>`);
  }
}
