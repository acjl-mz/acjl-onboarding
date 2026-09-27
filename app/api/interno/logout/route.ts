import { NextResponse } from "next/server";
import { clearInternalSession } from "@/lib/internal-auth";

export const runtime = "nodejs";

export async function POST() {
  await clearInternalSession();
  return NextResponse.json({ ok: true });
}
