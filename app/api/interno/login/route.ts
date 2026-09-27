import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({ error: "Use o acesso com Google." }, { status: 405 });
}
