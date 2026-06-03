import type { IncomingMessage, ServerResponse } from "node:http";

// Dynamically import the built SSR bundle at runtime
async function getHandler() {
  // In production this resolves to dist/server/server.js
  const mod = await import("../dist/server/server.js");
  return (mod.default ?? mod) as { fetch: (req: Request) => Promise<Response> };
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
  const server = await getHandler();

  const protocol = (req.headers["x-forwarded-proto"] as string) ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers["host"] ?? "localhost";
  const url = `${protocol}://${host}${req.url}`;

  const body = readBody(req);
  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  const headers = new Headers();
  for (const [key, val] of Object.entries(req.headers)) {
    if (val) {
      if (Array.isArray(val)) val.forEach((v) => headers.append(key, v));
      else headers.set(key, val);
    }
  }

  const fetchReq = new Request(url, {
    method: req.method ?? "GET",
    headers,
    body: hasBody ? await body : undefined,
    // @ts-expect-error - Node 18+ duplex required for body streams
    duplex: hasBody ? "half" : undefined,
  });

  const response = await server.fetch(fetchReq);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (response.body) {
    const reader = response.body.getReader();
    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) { res.end(); return; }
      res.write(value);
      return pump();
    };
    await pump();
  } else {
    res.end();
  }
}
