/** Server-side M-Pesa Daraja API helpers */

const MPESA_ENV = process.env.MPESA_ENV || "production";
const BASE = MPESA_ENV === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";

export function getTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
}

export function getMpesaPassword(timestamp: string): string {
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  return btoa(`${shortcode}${passkey}${timestamp}`);
}

export async function getMpesaToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY!;
  const secret = process.env.MPESA_CONSUMER_SECRET!;
  const auth = btoa(`${key}:${secret}`);

  const res = await fetch(
    `${BASE}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );
  if (!res.ok) throw new Error(`Token error: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export function formatPhone(phone: string): string {
  return phone
    .replace(/\s+/g, "")
    .replace(/^\+/, "")
    .replace(/^0/, "254");
}

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface StkStatusResponse {
  ResultCode: string;
  ResultDesc: string;
}

export async function initiateStkPush(
  phone: string,
  amount: number,
  accountRef: string,
  callbackUrl: string
): Promise<StkPushResponse> {
  const token = await getMpesaToken();
  const timestamp = getTimestamp();
  const password = getMpesaPassword(timestamp);
  const shortcode = process.env.MPESA_SHORTCODE!;
  const transactionType = process.env.MPESA_TRANSACTION_TYPE || "CustomerPayBillOnline";
  const partyB = process.env.MPESA_TILL_NUMBER || shortcode;

  const res = await fetch(`${BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: transactionType,
      Amount: amount,
      PartyA: formatPhone(phone),
      PartyB: partyB,
      PhoneNumber: formatPhone(phone),
      CallBackURL: callbackUrl,
      AccountReference: accountRef,
      TransactionDesc: `NyotaCredit ${accountRef} Processing Fee`,
    }),
  });

  if (!res.ok) throw new Error(`STK Push error: ${res.status}`);
  return res.json() as Promise<StkPushResponse>;
}

export async function queryStkStatus(
  checkoutRequestId: string
): Promise<StkStatusResponse> {
  const token = await getMpesaToken();
  const timestamp = getTimestamp();
  const password = getMpesaPassword(timestamp);
  const shortcode = process.env.MPESA_SHORTCODE!;

  const res = await fetch(`${BASE}/mpesa/stkpushquery/v1/query`, {
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
  return res.json() as Promise<StkStatusResponse>;
}
