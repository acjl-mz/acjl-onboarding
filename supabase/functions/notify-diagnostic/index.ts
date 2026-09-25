import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

const esc = (value: unknown) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const lines = (obj: Record<string, unknown>) =>
  Object.entries(obj || {}).map(([key, value]) =>
    `<tr><td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #eee">${esc(key)}</td><td style="padding:7px 10px;border-bottom:1px solid #eee">${esc(value)}</td></tr>`
  ).join("");

const report = (row: Record<string, unknown>) => {
  const responsible = row.responsible as Record<string, unknown>;
  const company = row.company as Record<string, unknown>;
  const operations = row.operations as Record<string, unknown>;
  const situation = row.situation as Record<string, unknown>;
  const objectives = row.objectives as Record<string, unknown>;
  const tasks = row.tasks as Record<string, string[]>;
  const taskHtml = Object.entries(tasks || {}).map(([service, items]) =>
    `<li><strong>${esc(service)}</strong>: ${(items || []).map(esc).join(", ") || "Nenhuma tarefa seleccionada"}</li>`
  ).join("");

  return `
  <div style="font-family:Arial,sans-serif;color:#17212b;max-width:800px;margin:auto">
    <div style="border-top:4px solid #b9923d;padding:24px 0">
      <h1 style="margin:0;color:#001533">Novo diagnóstico ACJL</h1>
      <p style="color:#65727e">Submetido em ${esc(row.submitted_at)}</p>
    </div>
    <h2>Responsável</h2><table style="width:100%;border-collapse:collapse">${lines(responsible)}</table>
    <h2>Empresa</h2><table style="width:100%;border-collapse:collapse">${lines(company)}</table>
    <h2>Modelo e serviços</h2>
    <p><strong>Modelo:</strong> ${esc(row.model)}</p>
    <p><strong>Áreas:</strong> ${esc((row.services as string[] || []).join(", "))}</p>
    <h3>Tarefas pontuais</h3><ul>${taskHtml || "<li>Não aplicável</li>"}</ul>
    <p><strong>Outra necessidade:</strong> ${esc(row.task_details)}</p>
    <h2>Organização interna</h2><table style="width:100%;border-collapse:collapse">${lines(operations)}</table>
    <h2>Situação actual</h2><table style="width:100%;border-collapse:collapse">${lines(situation)}</table>
    <h2>Objectivos</h2><table style="width:100%;border-collapse:collapse">${lines(objectives)}</table>
    <hr><p style="font-size:12px;color:#65727e">Relatório automático do formulário de Diagnóstico ACJL.</p>
  </div>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { submissionId } = await req.json();
    if (!submissionId) return new Response(JSON.stringify({ error: "submissionId obrigatório" }), { status: 400, headers: cors });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: row, error } = await supabase
      .from("diagnostic_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (error || !row) throw new Error(error?.message || "Diagnóstico não encontrado");

    const apiKey = Deno.env.get("RESEND_API_KEY");
    const to = Deno.env.get("REPORT_TO_EMAIL") || "al.andrelangaa@gmail.com";
    const from = Deno.env.get("REPORT_FROM_EMAIL");

    if (!apiKey || !from) throw new Error("RESEND_API_KEY ou REPORT_FROM_EMAIL não configurado");

    const email = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Novo diagnóstico ACJL — ${row.company?.legalName || "Empresa"}`,
        html: report(row)
      })
    });

    if (!email.ok) throw new Error(await email.text());

    await supabase.from("diagnostic_submissions").update({
      notification_status: "sent",
      notified_at: new Date().toISOString(),
      notification_error: null
    }).eq("id", submissionId);

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao enviar notificação";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: cors });
  }
});
