// src/lib/webmail-auth.ts
import crypto from "crypto";
import { cookies } from "next/headers";

export interface WebmailSessionPayload {
  mailboxId: number;
  address: string;
  name: string;
  role: "mailbox" | "admin";
  exp: number; // Unix timestamp in seconds
}

export const WEBMAIL_COOKIE_NAME = "persis_webmail_token";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecretKey(): string {
  return (
    process.env.PAYLOAD_SECRET ||
    process.env.EMAIL_WEBHOOK_SECRET ||
    "persisquartz-webmail-super-secure-secret-key-2026"
  );
}

/**
 * Hash password using native scrypt with a random 16-byte salt
 * Output format: $scrypt$salt$derivedKey
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`$scrypt$${salt}$${derivedKey.toString("hex")}`);
    });
  });
}

/**
 * Timing-safe password verification
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !storedHash.startsWith("$scrypt$")) {
    return false;
  }

  const parts = storedHash.split("$");
  if (parts.length !== 4) return false;

  const salt = parts[2];
  const originalKeyHex = parts[3];

  return new Promise((resolve) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return resolve(false);

      const keyBuffer = Buffer.from(originalKeyHex, "hex");
      if (keyBuffer.length !== derivedKey.length) {
        return resolve(false);
      }

      const isValid = crypto.timingSafeEqual(keyBuffer, derivedKey);
      resolve(isValid);
    });
  });
}

/**
 * Create HMAC-SHA256 Signed Session Token
 */
export function createWebmailToken(payload: Omit<WebmailSessionPayload, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const fullPayload: WebmailSessionPayload = { ...payload, exp };

  const dataString = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(dataString)
    .digest("base64url");

  return `${dataString}.${signature}`;
}

/**
 * Verify and Decode Session Token
 */
export function verifyWebmailToken(token: string): WebmailSessionPayload | null {
  if (!token || !token.includes(".")) return null;

  const [dataString, signature] = token.split(".");
  if (!dataString || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", getSecretKey())
    .update(dataString)
    .digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return null;
  }

  try {
    const payload: WebmailSessionPayload = JSON.parse(
      Buffer.from(dataString, "base64url").toString("utf8")
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Read current session from HTTP cookies (for Server Components & Server Actions)
 */
export async function getWebmailSession(): Promise<WebmailSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(WEBMAIL_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyWebmailToken(token);
}

/**
 * Write session cookie
 */
export async function setWebmailSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(WEBMAIL_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

/**
 * Clear session cookie (Logout)
 */
export async function clearWebmailSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(WEBMAIL_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
