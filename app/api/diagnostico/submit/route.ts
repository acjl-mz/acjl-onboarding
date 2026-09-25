import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { responsible, company, model, services, tasks, taskDetails, operations, situation, objectives } = body ?? {};

    if (!responsible || !company || !model || !["AVENCA", "PONTUAL"].includes(model)) {
      return NextResponse.json({ error: "Dados obrigatórios em falta." }, { status: 400 });
    }

    if (model === "PONTUAL" && (!Array.isArray(services) || services.length === 0) && !String(taskDetails || "").trim()) {
      return NextResponse.json({ error: "Seleccione pelo menos uma área ou descreva a necessidade." }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: "Supabase não configurado." }, { status: 500 });
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("diagnostic_submissions")
      .insert({
        responsible,
        company,
        model,
        services: Array.isArray(services) ? services : [],
        tasks: tasks && typeof tasks === "object" ? tasks : {},
        task_details: String(taskDetails || ""),
        operations: operations && typeof operations === "object" ? operations : {},
        situation: situation && typeof situation === "object" ? situation : {},
        objectives: objectives && typeof objectives === "object" ? objectives : {}
      })
      .select("id, submitted_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const functionUrl = process.env.SUPABASE_DIAGNOSTIC_NOTIFY_URL;
    let notification = "queued";

    if (functionUrl) {
      const notify = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: data.id })
      });

      if (!notify.ok) {
        notification = "failed";
      }
    }

    return NextResponse.json({ ok: true, id: data.id, notification }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível submeter o diagnóstico." }, { status: 500 });
  }
}
