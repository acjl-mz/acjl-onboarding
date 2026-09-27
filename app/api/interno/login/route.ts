import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json().catch(() => ({}));

    const expectedPassword = process.env.INTERNAL_ACCESS_PASSWORD;
    const expectedEmail = process.env.INTERNAL_ACCESS_EMAIL?.trim().toLowerCase();
    const expectedPhone = process.env.INTERNAL_ACCESS_PHONE?.trim();
    const token = process.env.INTERNAL_ACCESS_TOKEN;

    const normalizedIdentifier = String(identifier || "").trim().toLowerCase();
    const validEmail = Boolean(expectedEmail && normalizedIdentifier === expectedEmail);\n    const validPhone = Boolean(expectedPhone && String(identifier || "").trim() === expectedPhone);\n    const validIdentifier = validEmail || validPhone;

    if (!expectedPassword || !token || !validIdentifier || password !== expectedPassword) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set("acjl-internal-access", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
  }
}
