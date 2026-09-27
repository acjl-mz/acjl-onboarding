import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "acjl-internal-session";
export const ADMIN_EMAIL = "acjl.corporate@gmail.com";

function signingSecret() {
  return process.env.ACJL_INTERNAL_AUTH_SECRET || process.env.GOOGLE_CLIENT_SECRET || "acjl-internal";
}

function signature(email: string) {
  return createHmac("sha256", signingSecret()).update(email).digest("hex");
}

export async function createInternalSession(email = ADMIN_EMAIL) {
  const normalized = email.trim().toLowerCase();
  if (normalized !== ADMIN_EMAIL) throw new Error("Unauthorized");

  (await cookies()).set(COOKIE_NAME, `${ADMIN_EMAIL}.${signature(ADMIN_EMAIL)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function isInternalAdmin() {
  const value = (await cookies()).get(COOKIE_NAME)?.value || "";
  const [email, provided] = value.split(".");
  if (email !== ADMIN_EMAIL || !provided) return false;
  const expected = signature(ADMIN_EMAIL);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function clearInternalSession() {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
