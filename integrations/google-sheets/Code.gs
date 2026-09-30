const SHEETS = {
  CLIENT: "ACJL - Diagnosticos",
  CONSULTANT: "ACJL - Briefing",
};

const COPY_EMAIL = "acjl.corporate@gmail.com";

const SPREADSHEET_ID_PROPERTY = "SPREADSHEET_ID";

const HEADERS = [
  "ID da submissão",
  "Data/Hora",
  "Tipo de diagnóstico",
  "Origem",
  "Consultor ACJL",
  "Data do briefing",
  "Duração do briefing",
  "Nome",
  "Relação com empresa",
  "Telefone",
  "E-mail",
  "Canal preferencial",
  "Empresa",
  "Nome comercial",
  "NUIT",
  "Tipo de entidade",
  "Sector",
  "Actividade principal",
  "Descrição da actividade",
  "Ano constituição",
  "Ano início actividade",
  "Localização",
  "Estabelecimentos",
  "N.º colaboradores",
  "Volume de actividade",
  "Modelo",
  "Serviços",
  "Tarefas",
  "Detalhes das tarefas",
  "Dimensionamento dos serviços",
  "Organização interna",
  "Situação actual",
  "Objectivos",
  "Notas do briefing",
  "Avaliação técnica do consultor",
  "Dados completos (JSON)"
];

/**
 * Endpoint publicado como Web App no Google Apps Script.
 * Recebe o payload integral enviado pelo /api/diagnostico/submit.
 *
 * CLIENTE_AUTO  -> folha "Diagnósticos"
 * BRIEFING_ACJL -> folha "Briefings ACJL"
 *
 * A coluna "Dados completos (JSON)" é sempre gravada e funciona como
 * cópia integral do payload, inclusive para campos adicionados no futuro.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(30000);

    const envelope = parsePayload_(e);
    const data = envelope.data || envelope;
    validatePayload_(data);

    const id = envelope.diagnosticId || Utilities.getUuid();
    const now = envelope.submittedAt ? new Date(envelope.submittedAt) : new Date();
    const sheet = getSheetForType_(data.diagnosticType);

    ensureHeaders_(sheet);

    const record = buildRecord_(data, id, now);
    const existingRow = findSubmissionRow_(sheet, id);
    if (existingRow) {
      return json_({ ok: true, id: id, sheet: sheet.getName(), duplicate: true });
    }

    appendRecord_(sheet, record);
    SpreadsheetApp.flush();

    let emailSent = true;
    let emailError = "";
    try {
      sendCopy_(data, id, now, sheet.getName());
    } catch (mailError) {
      emailSent = false;
      emailError = mailError instanceof Error ? mailError.message : String(mailError);
      console.warn("Diagnóstico guardado, mas a notificação por e-mail falhou: " + emailError);
    }

    return json_({
      ok: true,
      id: id,
      sheet: sheet.getName(),
      emailSent: emailSent
    });
  } catch (error) {
    console.error("Falha no processamento do diagnóstico:", error);
    return json_({
      ok: false,
      error: "Não foi possível concluir o registo do diagnóstico."
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {}
  }
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_ID_PROPERTY);

  if (!id) {
    throw new Error(
      "SPREADSHEET_ID não configurado no Apps Script. " +
      "Abra Project Settings > Script properties e defina SPREADSHEET_ID."
    );
  }

  try {
    return SpreadsheetApp.openById(id.trim());
  } catch (_) {
    throw new Error(
      "Não foi possível abrir o Google Sheets configurado. " +
      "Verifique o SPREADSHEET_ID e as permissões do Web App."
    );
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Payload vazio.");
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (_) {
    throw new Error("Payload JSON inválido.");
  }
}

function validatePayload_(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos.");
  }

  if (!data.responsible || !data.company) {
    throw new Error("Dados do responsável ou da empresa em falta.");
  }

  if (!["AVENCA", "PONTUAL", "RECOMENDACAO"].includes(data.model)) {
    throw new Error("Modelo de contratação inválido.");
  }

  if (!["CLIENTE_AUTO", "BRIEFING_ACJL"].includes(data.diagnosticType)) {
    throw new Error("Tipo de diagnóstico inválido.");
  }
}

function getSheetForType_(diagnosticType) {
  const ss = getSpreadsheet_();
  const name = diagnosticType === "BRIEFING_ACJL"
    ? SHEETS.CONSULTANT
    : SHEETS.CLIENT;

  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0]
    .map(value => String(value || "").trim());

  HEADERS.forEach(header => {
    if (existing.indexOf(header) === -1) {
      const column = sheet.getLastColumn() + 1;
      sheet.getRange(1, column).setValue(header);
      existing.push(header);
    }
  });

  sheet.setFrozenRows(1);
}

function buildRecord_(data, id, now) {
  const r = data.responsible || {};
  const c = data.company || {};
  const b = data.consultantBriefing || {};

  return {
    "ID da submissão": id,
    "Data/Hora": now,
    "Tipo de diagnóstico": data.diagnosticType || "",
    "Origem": data.diagnosticType === "BRIEFING_ACJL"
      ? "Briefing conduzido pela ACJL"
      : "Preenchimento pelo cliente",
    "Consultor ACJL": b.consultantName || "",
    "Data do briefing": b.briefingDate || "",
    "Duração do briefing": b.duration || "",
    "Nome": r.fullName || "",
    "Relação com empresa": r.role || "",
    "Telefone": r.phone || "",
    "E-mail": r.email || "",
    "Canal preferencial": r.preferredChannel || "",
    "Empresa": c.legalName || "",
    "Nome comercial": c.tradeName || "",
    "NUIT": c.nuit || "",
    "Tipo de entidade": c.organizationType || "",
    "Sector": c.sector || "",
    "Actividade principal": c.mainActivity || "",
    "Descrição da actividade": c.activityDescription || "",
    "Ano constituição": c.incorporationYear || "",
    "Ano início actividade": c.activityStartYear || "",
    "Localização": c.location || "",
    "Estabelecimentos": c.establishments || "",
    "N.º colaboradores": c.employeeRange || "",
    "Volume de actividade": c.activityVolume || "",
    "Modelo": data.model || "",
    "Serviços": arrayText_(data.services),
    "Tarefas": jsonText_(data.tasks || {}),
    "Detalhes das tarefas": data.taskDetails || "",
    "Dimensionamento dos serviços": jsonText_(data.serviceDetails || {}),
    "Organização interna": jsonText_(data.operations || {}),
    "Situação actual": jsonText_(data.situation || {}),
    "Objectivos": jsonText_(data.objectives || {}),
    "Notas do briefing": b.notes || "",
    "Avaliação técnica do consultor": jsonText_(b.assessment || {}),
    "Dados completos (JSON)": JSON.stringify(data)
  };
}

function findSubmissionRow_(sheet, id) {
  const idColumn = 1;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const values = sheet.getRange(2, idColumn, lastRow - 1, 1).getDisplayValues().flat();
  const index = values.indexOf(String(id));
  return index >= 0 ? index + 2 : 0;
}

function appendRecord_(sheet, record) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(value => String(value || "").trim());

  const row = headers.map(header =>
    Object.prototype.hasOwnProperty.call(record, header) ? record[header] : ""
  );

  const targetRow = sheet.getLastRow() + 1;
  sheet.getRange(targetRow, 1, 1, headers.length).setValues([row]);

  // Evita que o Sheets transforme automaticamente NUIT/telefone/JSON.
  const textColumns = [
    "ID da submissão",
    "NUIT",
    "Telefone",
    "E-mail",
    "Dados completos (JSON)"
  ];

  textColumns.forEach(header => {
    const index = headers.indexOf(header);
    if (index >= 0) {
      sheet.getRange(targetRow, index + 1).setNumberFormat("@");
    }
  });
}

function jsonText_(value) {
  try {
    return JSON.stringify(value);
  } catch (_) {
    return "";
  }
}

function sendCopy_(data, id, submittedAt, sheetName) {
  const r = data.responsible || {};
  const c = data.company || {};
  const b = data.consultantBriefing || {};
  const mode = data.diagnosticType === "BRIEFING_ACJL"
    ? "Briefing conduzido pela ACJL"
    : "Preenchimento pelo cliente";

  const subject = "Novo diagnóstico ACJL — " + (c.legalName || c.tradeName || "Empresa");

  const html = buildDiagnosticEmailHtml_(data, id, submittedAt, sheetName, mode);
  const plainText = buildDiagnosticEmailText_(data, id, submittedAt, sheetName, mode);

  MailApp.sendEmail({
    to: COPY_EMAIL,
    subject: subject,
    body: plainText,
    htmlBody: html,
    name: "ACJL — Diagnóstico"
  });
}

function buildDiagnosticEmailHtml_(data, id, submittedAt, sheetName, mode) {
  const r = data.responsible || {};
  const c = data.company || {};
  const b = data.consultantBriefing || {};

  const companyName = c.legalName || c.tradeName || "Empresa";
  const submitted = formatDate_(submittedAt);

  let html = [
    "<!doctype html>",
    "<html><head><meta charset='UTF-8'></head>",
    "<body style='margin:0;padding:24px;background:#f4f4f2;font-family:Arial,Helvetica,sans-serif;color:#222;'>",
    "<div style='max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e4e1dc;border-radius:12px;overflow:hidden;'>",
    "<div style='padding:24px 28px;background:#222;color:#fff;'>",
    "<div style='font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#d7b56d;margin-bottom:8px;'>ACJL — Diagnóstico</div>",
    "<div style='font-size:25px;font-weight:700;'>Novo diagnóstico recebido</div>",
    "<div style='font-size:14px;color:#ddd;margin-top:8px;'>" + esc_(mode) + "</div>",
    "</div>",
    "<div style='padding:24px 28px;'>",
    infoGrid_([
      ["Empresa", companyName],
      ["ID do diagnóstico", id],
      ["Recebido em", submitted],
      ["Folha", sheetName]
    ]),
    sectionHtml_("Responsável pela submissão", [
      ["Nome", r.fullName],
      ["Relação com a empresa", r.role],
      ["Telefone", r.phone],
      ["E-mail", r.email],
      ["Canal preferencial", r.preferredChannel]
    ]),
    sectionHtml_("Empresa", [
      ["Razão social", c.legalName],
      ["Nome comercial", c.tradeName],
      ["NUIT", c.nuit],
      ["Tipo de entidade", c.organizationType],
      ["Sector", c.sector],
      ["Actividade principal", c.mainActivity],
      ["Descrição da actividade", c.activityDescription],
      ["Ano de constituição", c.incorporationYear],
      ["Ano de início da actividade", c.activityStartYear],
      ["Localização", c.location],
      ["Estabelecimentos", c.establishments],
      ["N.º de colaboradores", c.employeeRange],
      ["Volume de actividade", c.activityVolume]
    ]),
    sectionHtml_("Modelo e serviços", [
      ["Modelo", data.model],
      ["Serviços", arrayText_(data.services)],
      ["Detalhes das tarefas", data.taskDetails]
    ]),
    objectSectionHtml_("Tarefas seleccionadas", data.tasks),
    objectSectionHtml_("Dimensionamento dos serviços", data.serviceDetails),
    objectSectionHtml_("Organização interna", data.operations),
    objectSectionHtml_("Situação actual", data.situation),
    objectSectionHtml_("Objectivos", data.objectives)
  ].join("");

  if (data.diagnosticType === "BRIEFING_ACJL") {
    const assessment = b.assessment || {};

    html += sectionHtml_("Briefing ACJL", [
      ["Consultor", b.consultantName],
      ["Data do briefing", b.briefingDate],
      ["Duração", b.duration],
      ["Sistemas e ferramentas", assessment.systems],
      ["Fluxo de documentos e informação", assessment.documentFlow],
      ["Controlos internos", assessment.internalControls],
      ["Sazonalidade ou períodos críticos", assessment.seasonality],
      ["Dependências", assessment.dependencies],
      ["Pontos de atenção", assessment.risks],
      ["Observação técnica", assessment.assessment],
      ["Notas", b.notes]
    ]);
  }

  html += [
    "<div style='margin-top:28px;padding:16px;background:#f7f6f3;border-radius:8px;font-size:12px;color:#666;'>",
    "<strong>Registo interno ACJL</strong><br>",
    "Todas as respostas foram guardadas no Google Sheets, incluindo os dados completos para consulta interna. ",
    "Este e-mail é um resumo operacional da submissão e não substitui a análise técnica.",
    "</div>",
    "</div>",
    "</div>",
    "</body></html>"
  ].join("");

  return html;
}

function buildDiagnosticEmailText_(data, id, submittedAt, sheetName, mode) {
  const r = data.responsible || {};
  const c = data.company || {};
  const b = data.consultantBriefing || {};

  return [
    "ACJL — NOVO DIAGNÓSTICO RECEBIDO",
    "",
    "Origem: " + mode,
    "Empresa: " + (c.legalName || c.tradeName || ""),
    "ID: " + id,
    "Recebido em: " + formatDate_(submittedAt),
    "Folha: " + sheetName,
    "",
    "RESPONSÁVEL",
    "Nome: " + (r.fullName || ""),
    "Relação: " + (r.role || ""),
    "Telefone: " + (r.phone || ""),
    "E-mail: " + (r.email || ""),
    "",
    "EMPRESA",
    "Razão social: " + (c.legalName || ""),
    "Nome comercial: " + (c.tradeName || ""),
    "NUIT: " + (c.nuit || ""),
    "Sector: " + (c.sector || ""),
    "Actividade: " + (c.mainActivity || ""),
    "Localização: " + (c.location || ""),
    "",
    "MODELO E SERVIÇOS",
    "Modelo: " + (data.model || ""),
    "Serviços: " + arrayText_(data.services),
    "Tarefas: " + objectText_(data.tasks),
    "Detalhes das tarefas: " + (data.taskDetails || ""),
    "",
    data.diagnosticType === "BRIEFING_ACJL"
      ? "BRIEFING ACJL\nConsultor: " + (b.consultantName || "") + "\nNotas: " + (b.notes || "")
      : "",
    "",
    "As respostas completas permanecem guardadas no Google Sheets."
  ].filter(Boolean).join("\n");
}

function sectionHtml_(title, fields) {
  const rows = fields
    .filter(item => hasValue_(item[1]))
    .map(item =>
      "<tr>" +
      "<td style='padding:9px 12px;border-bottom:1px solid #eee;color:#666;width:35%;vertical-align:top;'>" + esc_(item[0]) + "</td>" +
      "<td style='padding:9px 12px;border-bottom:1px solid #eee;color:#222;vertical-align:top;'>" + nl2br_(item[1]) + "</td>" +
      "</tr>"
    ).join("");

  if (!rows) return "";

  return [
    "<div style='margin-top:28px;'>",
    "<div style='font-size:16px;font-weight:700;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid #d7b56d;'>",
    esc_(title),
    "</div>",
    "<table style='width:100%;border-collapse:collapse;font-size:13px;'>",
    rows,
    "</table>",
    "</div>"
  ].join("");
}

function objectSectionHtml_(title, value) {
  if (!hasValue_(value)) return "";

  const rows = objectRows_(value);
  if (!rows.length) return "";

  return [
    "<div style='margin-top:28px;'>",
    "<div style='font-size:16px;font-weight:700;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid #d7b56d;'>",
    esc_(title),
    "</div>",
    "<table style='width:100%;border-collapse:collapse;font-size:13px;'>",
    rows.map(item =>
      "<tr>" +
      "<td style='padding:9px 12px;border-bottom:1px solid #eee;color:#666;width:35%;vertical-align:top;'>" + esc_(humanizeKey_(item[0])) + "</td>" +
      "<td style='padding:9px 12px;border-bottom:1px solid #eee;color:#222;vertical-align:top;'>" + nl2br_(item[1]) + "</td>" +
      "</tr>"
    ).join(""),
    "</table>",
    "</div>"
  ].join("");
}

function infoGrid_(fields) {
  return [
    "<table style='width:100%;border-collapse:separate;border-spacing:8px;margin:0 -8px 4px;'>",
    fields.map(item =>
      "<tr><td style='padding:8px;background:#f7f6f3;border-radius:6px;width:25%;font-size:11px;color:#777;text-transform:uppercase;letter-spacing:.4px;'>" +
      esc_(item[0]) +
      "</td><td style='padding:8px;background:#f7f6f3;border-radius:6px;font-size:13px;font-weight:600;'>" +
      esc_(item[1]) +
      "</td></tr>"
    ).join(""),
    "</table>"
  ].join("");
}

function objectRows_(value, prefix) {
  const rows = [];
  const currentPrefix = prefix || "";

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const key = currentPrefix ? currentPrefix + " · " + (index + 1) : String(index + 1);
      if (item && typeof item === "object") {
        rows.push.apply(rows, objectRows_(item, key));
      } else if (hasValue_(item)) {
        rows.push([key, String(item)]);
      }
    });
    return rows;
  }

  if (value && typeof value === "object") {
    Object.keys(value).forEach(key => {
      const label = currentPrefix ? currentPrefix + " · " + key : key;
      const item = value[key];

      if (item && typeof item === "object") {
        const nested = objectRows_(item, label);
        if (nested.length) rows.push.apply(rows, nested);
      } else if (hasValue_(item)) {
        rows.push([label, String(item)]);
      }
    });
    return rows;
  }

  if (hasValue_(value)) rows.push([currentPrefix || "Resposta", String(value)]);
  return rows;
}

function objectText_(value) {
  return objectRows_(value).map(item => item[0] + ": " + item[1]).join(" | ");
}

function humanizeKey_(key) {
  const labels = {
    // Organização interna
    routines: "Rotinas definidas",
    processes: "Processos e procedimentos",
    collection: "Recolha e organização da informação",
    treatment: "Tratamento e transformação da informação",
    management: "Acompanhamento, controlo e gestão da informação",

    // Situação actual
    provider: "Prestador actual",
    providerScope: "O que pretende manter, melhorar ou alterar",
    motivation: "Motivação para procurar apoio",
    pending: "Assuntos pendentes",

    // Dimensionamento dos serviços
    currentState: "Situação actual",
    frequency: "Frequência",
    volume: "Volume",
    urgency: "Urgência",
    notes: "Observações",

    // Objectivos
    main: "Principal resultado pretendido",
    recommendation: "Recomendação da ACJL sobre o modelo de contratação",

    // Briefing ACJL
    consultantName: "Consultor ACJL",
    briefingDate: "Data do briefing",
    duration: "Duração do briefing",
    systems: "Sistemas e ferramentas utilizados",
    documentFlow: "Fluxo de documentos e informação",
    internalControls: "Controlos internos observados",
    dependencies: "Dependências",
    seasonality: "Sazonalidade ou períodos críticos",
    risks: "Pontos de atenção identificados",
    assessment: "Observação técnica do consultor"
  };

  const raw = String(key || "");
  if (Object.prototype.hasOwnProperty.call(labels, raw)) {
    return labels[raw];
  }

  return raw
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\\s+/g, " ")
    .replace(/^./, s => s.toUpperCase());
}

function arrayText_(value) {
  return Array.isArray(value) ? value.map(item => String(item)).join(" · ") : "";
}

function hasValue_(value) {
  return value !== null &&
    value !== undefined &&
    !(typeof value === "string" && value.trim() === "") &&
    !(Array.isArray(value) && value.length === 0);
}

function esc_(value) {
  return String(value === null || value === undefined ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br_(value) {
  return esc_(value).replace(/\r?\n/g, "<br>");
}

function formatDate_(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return String(value || "");
  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone() || "Africa/Maputo",
    "dd/MM/yyyy HH:mm"
  );
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
