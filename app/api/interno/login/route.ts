import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json().catch(() => ({}));
    const email = String(identifier || "").trim().toLowerCase();

    if (!email || !password) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user?.id || !data.user.email) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    if (data.user.email?.toLowerCase() !== "acjl.corporate@gmail.com") {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      user: { id: data.user.id, email: data.user.email, role: "admin" },
    });
  } catch {
    return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
  }
}
