import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();

    if (authError || !auth.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const admin = createSupabaseAdminClient();
    const { data: access, error: accessError } = await admin
      .from("internal_users")
      .select("role, active")
      .eq("user_id", auth.user.id)
      .eq("active", true)
      .maybeSingle();

    if (accessError || !access) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await admin
      .from("diagnostic_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }
}
