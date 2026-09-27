import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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

    const admin = createSupabaseAdminClient();
    const { data: access, error: accessError } = await admin
      .from("internal_users")
      .select("user_id, email, role, active")
      .eq("user_id", data.user.id)
      .eq("active", true)
      .maybeSingle();

    if (accessError || !access) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      user: { id: data.user.id, email: data.user.email, role: access.role },
    });
  } catch {
    return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
  }
}
