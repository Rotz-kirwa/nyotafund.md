#!/usr/bin/env node
import http from "node:http";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

function findServerEntry() {
  const dir = join(process.cwd(), "dist", "server", "assets");
  const files = readdirSync(dir)
    .filter((f) => f.startsWith("server-") && f.endsWith(".js"))
    .map((f) => ({ name: f, size: statSync(join(dir, f)).size }))
    .sort((a, b) => b.size - a.size);

  if (!files.length) throw new Error(`No server-*.js found in ${dir}`);
  return join(dir, files[0].name);
}

let handlerCache = null;
async function getHandler() {
  if (handlerCache) return handlerCache;
  const entryPath = findServerEntry();
  console.log("[local-ssr] Loading entry:", entryPath);
  const mod = await import(entryPath);
  handlerCache = (mod.default ?? mod);
  return handlerCache;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (!existsSync(join(process.cwd(), "dist", "server"))) {
      res.statusCode = 500;
      res.end("dist/server missing - run npm run build");
      return;
    }

    const handler = await getHandler();

    const protocol = "http";
    const host = req.headers.host || "localhost:3000";
    const url = `${protocol}://${host}${req.url}`;

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const body = hasBody ? await readBody(req) : undefined;

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (val == null) continue;
      if (Array.isArray(val)) val.forEach((v) => headers.append(key, v));
      else headers.set(key, val);
    }

    const fetchReq = new Request(url, {
      method: req.method || "GET",
      headers,
      body: hasBody ? body : undefined,
      // @ts-expect-error duplex for node
      duplex: hasBody ? "half" : undefined,
    });

    const response = await handler.fetch(fetchReq);

    res.statusCode = response.status;
    response.headers.forEach((v, k) => res.setHeader(k, v));

    if (response.body) {
      const reader = response.body.getReader();
      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) { res.end(); return; }
        res.write(Buffer.from(value));
        return pump();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (err) {
    console.error("[local-ssr] error:", err);
    res.statusCode = 500;
    res.end(String(err));
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
server.listen(port, () => console.log(`[local-ssr] Listening on http://localhost:${port}/`));
