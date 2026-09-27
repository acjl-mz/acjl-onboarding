import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "acjl-internal-session";
const ADMIN_EMAIL = "acjl.corporate@gmail.com";

function getPassword() {
  return process.env.ACJL_INTERNAL_ADMIN_PASSWORD || "";
}

function signature(email: string) {
  const secret = process.env.ACJL_INTERNAL_AUTH_SECRET || getPassword();
  return createHmac("sha256", secret).update(email).digest("hex");
}

export function authenticateAdmin(email: string, password: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL && !!getPassword() && password === getPassword();
}

export async function createInternalSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${ADMIN_EMAIL}.${signature(ADMIN_EMAIL)}`, {
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
