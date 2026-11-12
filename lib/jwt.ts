/**
 * Web-Crypto Native JWT Implementation for Next.js App Router & Edge Runtime.
 * Zero external dependencies, fully compatible with Node.js and Edge Middlewares.
 */

export interface AdminJWTPayload {
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const ADMIN_COOKIE_NAME = "mart_admin_jwt";

const DEFAULT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  "mart-fitness-sports-admin-secure-jwt-secret-key-2026-production-token";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlToBytes(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

/**
 * Signs a payload with HS256 and returns the JWT string.
 */
export async function signAdminJWT(
  payload: Omit<AdminJWTPayload, "iat" | "exp">,
  expiresInSeconds: number = 7 * 24 * 60 * 60, // 7 days default
  secret: string = DEFAULT_SECRET
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: AdminJWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = bytesToBase64Url(encoder.encode(JSON.stringify(header)));
  const encodedPayload = bytesToBase64Url(
    encoder.encode(JSON.stringify(fullPayload))
  );

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const key = await getHmacKey(secret, "sign");
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(unsignedToken)
  );

  const encodedSignature = bytesToBase64Url(new Uint8Array(signatureBuffer));
  return `${unsignedToken}.${encodedSignature}`;
}

/**
 * Verifies an HS256 JWT string. Returns null if invalid or expired.
 */
export async function verifyAdminJWT(
  token: string | undefined | null,
  secret: string = DEFAULT_SECRET
): Promise<AdminJWTPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  try {
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const key = await getHmacKey(secret, "verify");
    const signatureBytes = base64UrlToBytes(encodedSignature);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      encoder.encode(unsignedToken)
    );

    if (!isValid) return null;

    const payloadJson = decoder.decode(base64UrlToBytes(encodedPayload));
    const payload = JSON.parse(payloadJson) as AdminJWTPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      // Token expired
      return null;
    }

    return payload;
  } catch (err) {
    console.error("[JWT Verification Error]:", err);
    return null;
  }
}
