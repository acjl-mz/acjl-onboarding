import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { responsible, company, model } = body ?? {};

    if (!responsible || !company || !model || !["AVENCA", "PONTUAL"].includes(model)) {
      return NextResponse.json({ error: "Dados obrigatórios em falta." }, { status: 400 });
    }

    const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!endpoint) {
      return NextResponse.json({ error: "Google Sheets não está configurado." }, { status: 500 });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.ok !== true) {
      return NextResponse.json(
        { error: result.error || "Não foi possível guardar o diagnóstico." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, id: result.id || null }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível submeter o diagnóstico." }, { status: 500 });
  }
}
