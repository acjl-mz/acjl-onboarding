import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const { responsible, company, model, diagnosticType } = body;

    if (!responsible || !company || ![ "AVENCA", "PONTUAL" ].includes(model)) {
      return NextResponse.json({ error: "Dados obrigatórios em falta." }, { status: 400 });
    }

    if (!["CLIENTE_AUTO", "BRIEFING_ACJL"].includes(diagnosticType)) {
      return NextResponse.json({ error: "Tipo de diagnóstico inválido." }, { status: 400 });
    }

    const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!endpoint) {
      return NextResponse.json({ error: "Google Sheets não está configurado." }, { status: 500 });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const raw = await response.text();
    let result: { ok?: boolean; id?: string; error?: string; sheet?: string } = {};

    try {
      result = JSON.parse(raw);
    } catch {
      result = { error: raw || "Resposta inválida do Google Sheets." };
    }

    if (!response.ok || result.ok !== true || !result.id) {
      return NextResponse.json(
        { error: result.error || "Não foi possível guardar o diagnóstico." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { ok: true, id: result.id, sheet: result.sheet || null },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Não foi possível submeter o diagnóstico." },
      { status: 500 },
    );
  }
}
