import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_auth";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function expectedAdminCookieValue() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return sha256(pw);
}

export async function requireAdmin() {
  const expected = expectedAdminCookieValue();
  if (!expected) throw new Error("ADMIN_PASSWORD is not configured");

  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value || value !== expected) {
    throw new Error("UNAUTHORIZED");
  }
}

export async function setAdminCookie() {
  const expected = expectedAdminCookieValue();
  if (!expected) throw new Error("ADMIN_PASSWORD is not configured");

  (await cookies()).set({
    name: COOKIE_NAME,
    value: expected,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearAdminCookie() {
  (await cookies()).set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
