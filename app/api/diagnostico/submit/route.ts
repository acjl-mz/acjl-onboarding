import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body?.action === "consultantAccess") {
      const expected = process.env.CONSULTANT_ACCESS_CODE;
      if (!expected) {
        return NextResponse.json(
          { error: "Acesso de consultor não está configurado." },
          { status: 503 },
        );
      }

      if (typeof body.code !== "string" || body.code.trim() !== expected.trim()) {
        return NextResponse.json({ error: "Código de acesso inválido." }, { status: 401 });
      }

      const response = NextResponse.json({ ok: true });
      response.cookies.set("acjl-consultant-access", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
      return response;
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const { responsible, company, model, diagnosticType } = body;

    if (
      !responsible ||
      !company ||
      !["AVENCA", "PONTUAL", "RECOMENDACAO"].includes(model)
    ) {
      return NextResponse.json({ error: "Dados obrigatórios em falta." }, { status: 400 });
    }

    if (!["CLIENTE_AUTO", "BRIEFING_ACJL"].includes(diagnosticType)) {
      return NextResponse.json({ error: "Tipo de diagnóstico inválido." }, { status: 400 });
    }

    const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!endpoint) {
      return NextResponse.json(
        { error: "Google Sheets não está configurado." },
        { status: 500 },
      );
    }

    const diagnosticId =
      typeof body.diagnosticId === "string" && body.diagnosticId
        ? body.diagnosticId
        : randomUUID();

    const payload = {
      schemaVersion: "1.0",
      event: "DIAGNOSTIC_SUBMITTED",
      diagnosticId,
      submittedAt: new Date().toISOString(),
      source: diagnosticType === "BRIEFING_ACJL" ? "BRIEFING_ACJL" : "CLIENTE_AUTO",
      data: body,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const raw = await response.text();
    const contentType = response.headers.get("content-type") || "";
    const isHtmlResponse =
      contentType.toLowerCase().includes("text/html") ||
      /^\s*<!doctype\s+html/i.test(raw) ||
      /^\s*<html[\s>]/i.test(raw);

    let result: { ok?: boolean; id?: string; error?: string; sheet?: string } = {};

    if (!isHtmlResponse) {
      try {
        result = JSON.parse(raw);
      } catch {
        result = { error: "Resposta inválida do serviço de armazenamento." };
      }
    }

    // O Google Apps Script pode devolver uma página HTML intermédia mesmo
    // quando o doPost foi executado com sucesso. Nesse caso, não devemos
    // mostrar esse HTML técnico ao utilizador final.
    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || "Não foi possível guardar o diagnóstico." },
        { status: 502 },
      );
    }

    if (result.ok !== true) {
      // Se a resposta não for JSON, mas o Web App tiver respondido HTTP 2xx,
      // o Apps Script pode ter concluído a gravação e devolvido HTML por causa
      // do redireccionamento do ContentService. Mantemos o ID local para que
      // o utilizador não veja o conteúdo técnico do Google.
      if (isHtmlResponse) {
        return NextResponse.json(
          {
            ok: true,
            id: diagnosticId,
            diagnosticId,
            sheet: null,
            responseFormat: "google-html",
          },
          { status: 201 },
        );
      }

      return NextResponse.json(
        { error: result.error || "Não foi possível guardar o diagnóstico." },
        { status: 502 },
      );
    }

    if (!result.id) {
      return NextResponse.json(
        {
          ok: true,
          id: diagnosticId,
          diagnosticId,
          sheet: result.sheet || null,
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        id: result.id,
        diagnosticId,
        sheet: result.sheet || null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Falha ao processar submissão do diagnóstico:", error);
    return NextResponse.json(
      { error: "Não foi possível processar o pedido." },
      { status: 500 },
    );
  }
}
