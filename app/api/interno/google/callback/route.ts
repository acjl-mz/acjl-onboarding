import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { OAuth2Client } from "google-auth-library";
import { ADMIN_EMAIL, createInternalSession } from "@/lib/internal-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = (await cookies()).get("acjl-google-state")?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/interno?error=google", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/interno?error=config", request.url));
  }

  try {
    const origin = url.origin;
    const client = new OAuth2Client(clientId, clientSecret, `${origin}/api/interno/google/callback`);
    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) throw new Error("Missing ID token");

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });
    const payload = ticket.getPayload();

    if (
      !payload ||
      payload.email?.toLowerCase() !== ADMIN_EMAIL ||
      payload.email_verified !== true
    ) {
      return NextResponse.redirect(new URL("/interno?error=unauthorized", request.url));
    }

    await createInternalSession(ADMIN_EMAIL);
    (await cookies()).set("acjl-google-state", "", {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", path: "/", maxAge: 0,
    });

    return NextResponse.redirect(new URL("/interno/balcao", request.url));
  } catch {
    return NextResponse.redirect(new URL("/interno?error=google", request.url));
  }
}
