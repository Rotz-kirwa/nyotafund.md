#!/usr/bin/env node
import http from "node:http";
import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import pg from "pg";

const PORT = Number(process.env.PORT || 3000);
const MPESA_BASE_URL = "https://api.safaricom.co.ke";
const DEFAULT_ALLOWED_ORIGINS = [
  "https://nyotacredit.co.ke",
  "https://nyotafund-md.vercel.app",
  "https://nyota-admin.vercel.app",
  "http://localhost:8080",
  "http://localhost:8082",
  "http://localhost:5173",
];

const mockDatabase = [
  { id: 1, name: "Brian Otieno", phone: "0712***456", national_id: "32145678", package_id: "starter", fee_amount: 100, status: "paid", transaction_id: "MPESA-NC-7A19X", created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString() },
  { id: 2, name: "Amani Kamau", phone: "0722***912", national_id: "28471203", package_id: "growth", fee_amount: 300, status: "paid", transaction_id: "MPESA-NC-2K84M", created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString() },
  { id: 3, name: "Fatma Hassan", phone: "0790***124", national_id: "30582910", package_id: "business-boost", fee_amount: 700, status: "paid", transaction_id: "MPESA-NC-9P52Z", created_at: new Date(Date.now() - 42 * 60 * 1000).toISOString() },
];

let pool = null;
if (process.env.DATABASE_URL || process.env.PGURI) {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || process.env.PGURI,
    ssl: { rejectUnauthorized: false },
  });
}

function normalizeOrigin(origin) {
  return origin.replace(/\/+$/, "");
}

function allowedOrigins() {
  const configured = process.env.ALLOWED_ORIGINS
    ?.split(",")
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean);
  return new Set(configured?.length ? configured : DEFAULT_ALLOWED_ORIGINS);
}

function corsHeaders(req) {
  const origin = req.headers.origin;
  const headers = {
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
  };

  if (origin && allowedOrigins().has(normalizeOrigin(origin))) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function sendJson(req, res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders(req),
  });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf8");
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function getTimestamp() {
  return new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
}

function formatPhone(phone) {
  return String(phone).replace(/\s+/g, "").replace(/^\+/, "").replace(/^0/, "254");
}

function base64(value) {
  return Buffer.from(value).toString("base64");
}

async function getMpesaToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("Missing M-Pesa consumer credentials");

  const res = await fetch(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${base64(`${key}:${secret}`)}` },
  });

  if (!res.ok) throw new Error(`Token error: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function initiateStkPush(phone, amount, accountRef, callbackUrl) {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  if (!shortcode || !passkey) throw new Error("Missing M-Pesa shortcode or passkey");

  const token = await getMpesaToken();
  const timestamp = getTimestamp();
  const password = base64(`${shortcode}${passkey}${timestamp}`);

  const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: formatPhone(phone),
      PartyB: shortcode,
      PhoneNumber: formatPhone(phone),
      CallBackURL: callbackUrl,
      AccountReference: accountRef,
      TransactionDesc: `NyotaCredit ${accountRef} Processing Fee`,
    }),
  });

  if (!res.ok) throw new Error(`STK Push error: ${res.status}`);
  return res.json();
}

async function queryStkStatus(checkoutRequestId) {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  if (!shortcode || !passkey) throw new Error("Missing M-Pesa shortcode or passkey");

  const token = await getMpesaToken();
  const timestamp = getTimestamp();
  const password = base64(`${shortcode}${passkey}${timestamp}`);

  const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  });

  if (!res.ok) throw new Error(`Status query error: ${res.status}`);
  return res.json();
}

async function initializeDatabaseSchema() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nyota_transactions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      national_id VARCHAR(50) NOT NULL,
      package_id VARCHAR(50) NOT NULL,
      fee_amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL,
      transaction_id VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function getAllTransactions() {
  if (pool) {
    const res = await pool.query("SELECT * FROM nyota_transactions ORDER BY created_at DESC");
    return res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      national_id: row.national_id,
      package_id: row.package_id,
      fee_amount: Number(row.fee_amount),
      status: row.status,
      transaction_id: row.transaction_id,
      created_at: row.created_at.toISOString(),
    }));
  }

  return [...mockDatabase].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function addTransaction(tx) {
  if (pool) {
    const res = await pool.query(
      `INSERT INTO nyota_transactions (name, phone, national_id, package_id, fee_amount, status, transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (transaction_id) DO UPDATE SET status = EXCLUDED.status
       RETURNING *`,
      [tx.name, tx.phone, tx.national_id, tx.package_id, tx.fee_amount, tx.status, tx.transaction_id],
    );
    const row = res.rows[0];
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      national_id: row.national_id,
      package_id: row.package_id,
      fee_amount: Number(row.fee_amount),
      status: row.status,
      transaction_id: row.transaction_id,
      created_at: row.created_at.toISOString(),
    };
  }

  const record = { id: mockDatabase.length + 1, ...tx, created_at: new Date().toISOString() };
  mockDatabase.unshift(record);
  return record;
}

async function updateTransactionStatus(transactionId, status) {
  if (pool) {
    const res = await pool.query(
      "UPDATE nyota_transactions SET status = $1 WHERE transaction_id = $2",
      [status, transactionId],
    );
    if (res.rowCount > 0) return true;
  }

  const record = mockDatabase.find((tx) => tx.transaction_id === transactionId);
  if (!record) return false;
  record.status = status;
  return true;
}

async function handleApi(req, res, pathname) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders(req));
    res.end();
    return true;
  }

  if (pathname === "/api/health") {
    sendJson(req, res, 200, { ok: true, service: "nyotafund-md" });
    return true;
  }

  if (pathname === "/api/mpesa/stk-push" && req.method === "POST") {
    const { phone, amount, accountRef, name, nationalId, packageId } = await readJson(req);
    if (!phone || !amount || !accountRef) {
      sendJson(req, res, 400, { error: "Missing required fields" });
      return true;
    }

    const appUrl = process.env.APP_URL || "https://nyotafund-md.onrender.com";
    const callbackUrl = `${appUrl.replace(/\/+$/, "")}/api/mpesa/callback`;
    let checkoutRequestId = `MOCK-NC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    let responseDescription = "STK Push initiated successfully (Demo Mode)";

    try {
      const result = await initiateStkPush(phone, amount, accountRef, callbackUrl);
      if (result?.CheckoutRequestID) {
        checkoutRequestId = result.CheckoutRequestID;
        responseDescription = result.ResponseDescription || responseDescription;
      }
    } catch (error) {
      console.warn("M-Pesa API unavailable; recording demo transaction:", error);
    }

    await addTransaction({
      name: name || "Anonymous Client",
      phone,
      national_id: nationalId || "12345678",
      package_id: packageId || "starter",
      fee_amount: amount,
      status: "pending",
      transaction_id: checkoutRequestId,
    });

    sendJson(req, res, 200, {
      CheckoutRequestID: checkoutRequestId,
      ResponseDescription: responseDescription,
      success: true,
    });
    return true;
  }

  if (pathname === "/api/mpesa/status" && req.method === "POST") {
    const { checkoutRequestId } = await readJson(req);
    if (!checkoutRequestId) {
      sendJson(req, res, 400, { error: "Missing checkoutRequestId" });
      return true;
    }
    if (checkoutRequestId.startsWith("MOCK-NC-")) {
      sendJson(req, res, 200, {
        ResultCode: "0",
        ResultDesc: "Demo transaction approved",
      });
      return true;
    }

    const result = await queryStkStatus(checkoutRequestId);
    sendJson(req, res, 200, result);
    return true;
  }

  if (pathname === "/api/mpesa/callback" && req.method === "POST") {
    const body = await readJson(req);
    const callback = body?.Body?.stkCallback;
    if (callback?.CheckoutRequestID) {
      await updateTransactionStatus(callback.CheckoutRequestID, callback.ResultCode === 0 ? "paid" : "failed");
    }
    sendJson(req, res, 200, { ResultCode: 0, ResultDesc: "Accepted" });
    return true;
  }

  if (pathname === "/api/admin/transactions" && req.method === "GET") {
    sendJson(req, res, 200, { success: true, data: await getAllTransactions() });
    return true;
  }

  if (pathname === "/api/admin/reconcile" && req.method === "POST") {
    const { transactionId, status } = await readJson(req);
    if (!transactionId || !status) {
      sendJson(req, res, 400, { error: "Missing transactionId or status" });
      return true;
    }
    sendJson(req, res, 200, { success: await updateTransactionStatus(transactionId, status) });
    return true;
  }

  if (pathname === "/api/admin/record" && req.method === "POST") {
    const tx = await readJson(req);
    if (!tx.name || !tx.phone || !tx.national_id || !tx.package_id || !tx.fee_amount || !tx.status || !tx.transaction_id) {
      sendJson(req, res, 400, { error: "Missing required fields" });
      return true;
    }
    sendJson(req, res, 200, { success: true, data: await addTransaction(tx) });
    return true;
  }

  if (pathname.startsWith("/api/")) {
    sendJson(req, res, 404, { error: "API route not found" });
    return true;
  }

  return false;
}

function serveStatic(req, res, pathname) {
  const clientDir = join(process.cwd(), "dist", "client");
  const filePath = pathname === "/" ? join(clientDir, "index.html") : join(clientDir, decodeURIComponent(pathname));
  const fallbackPath = join(clientDir, "index.html");
  const target = existsSync(filePath) && statSync(filePath).isFile() ? filePath : fallbackPath;

  if (!existsSync(target)) {
    sendJson(req, res, 200, { ok: true, service: "nyotafund-md" });
    return;
  }

  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
  };

  res.writeHead(200, {
    "Content-Type": contentTypes[extname(target)] || "application/octet-stream",
    "Cache-Control": target.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache",
  });
  createReadStream(target).pipe(res);
}

await initializeDatabaseSchema().catch((error) => {
  console.error("Database schema initialization failed:", error);
});

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (await handleApi(req, res, url.pathname)) return;
    serveStatic(req, res, url.pathname);
  } catch (error) {
    console.error("Request failed:", error);
    sendJson(req, res, 500, { error: error instanceof Error ? error.message : "Server error" });
  }
}).listen(PORT, () => {
  const assets = existsSync(join(process.cwd(), "dist", "client", "assets"))
    ? readdirSync(join(process.cwd(), "dist", "client", "assets")).length
    : 0;
  console.log(`[render-server] Listening on port ${PORT} with ${assets} client assets`);
});
