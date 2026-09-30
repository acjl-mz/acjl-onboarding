import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body?.action === "consultantAccess") {
      const expected = process.env.CONSULTANT_ACCESS_CODE;
      if (!expected) return NextResponse.json({ error: "Acesso de consultor não está configurado." }, { status: 503 });
      if (typeof body.code !== "string" || body.code.trim() !== expected.trim()) {
        return NextResponse.json({ error: "Código de acesso inválido." }, { status: 401 });
      }
      const response = NextResponse.json({ ok: true });
      response.cookies.set("acjl-consultant-access", "1", {
        httpOnly: true, secure: process.env.NODE_ENV === "production",
        sameSite: "lax", path: "/", maxAge: 60 * 60 * 8,
      });
      return response;
    }

    if (!body || typeof body !== "object") return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

    const { responsible, company, model, diagnosticType } = body;
    if (!responsible || !company || !["AVENCA", "PONTUAL", "RECOMENDACAO"].includes(model)) {
      return NextResponse.json({ error: "Dados obrigatórios em falta." }, { status: 400 });
    }
    if (!["CLIENTE_AUTO", "BRIEFING_ACJL"].includes(diagnosticType)) {
      return NextResponse.json({ error: "Tipo de diagnóstico inválido." }, { status: 400 });
    }

    const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!endpoint) return NextResponse.json({ error: "Google Sheets não está configurado." }, { status: 500 });

    const payload = {\n      schemaVersion: "1.0",\n      event: "DIAGNOSTIC_SUBMITTED",\n      diagnosticId: typeof body.diagnosticId === "string" && body.diagnosticId ? body.diagnosticId : makeDiagnosticId(),\n      submittedAt: new Date().toISOString(),\n      source: diagnosticType === "BRIEFING_ACJL" ? "BRIEFING_ACJL" : "CLIENTE_AUTO",\n      data: body,\n    };\n\n    const response = await fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), cache: "no-store",
    });

    const raw = await response.text();
    let result: { ok?: boolean; id?: string; error?: string; sheet?: string } = {};
    try { result = JSON.parse(raw); } catch { result = { error: raw || "Resposta inválida do Google Sheets." }; }

    if (!response.ok || result.ok !== true || !result.id) {
      return NextResponse.json({ error: result.error || "Não foi possível guardar o diagnóstico." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: result.id, diagnosticId: payload.diagnosticId, sheet: result.sheet || null }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Não foi possível processar o pedido." },
      { status: 500 },
    );
  }
}
