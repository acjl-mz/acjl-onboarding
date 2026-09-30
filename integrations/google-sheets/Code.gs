const SHEET_NAME = "Diagnósticos";
const COPY_EMAIL = "acjl.corporate@gmail.com";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const sheet = getSheet_();
    ensureHeaders_(sheet);
    const now = new Date();

    const row = [
      now, data.diagnosticType || "", data.consultantBriefing?.consultantName || "",
      data.consultantBriefing?.briefingDate || "", data.consultantBriefing?.duration || "",
      data.responsible?.fullName || "", data.responsible?.role || "", data.responsible?.phone || "",
      data.responsible?.email || "", data.responsible?.preferredChannel || "",
      data.company?.legalName || "", data.company?.tradeName || "", data.company?.nuit || "",
      data.company?.organizationType || "", data.company?.sector || "", data.company?.mainActivity || "",
      data.company?.activityDescription || "", data.company?.incorporationYear || "",
      data.company?.activityStartYear || "", data.company?.location || "", data.company?.establishments || "",
      data.company?.employeeRange || "", data.company?.activityVolume || "", data.model || "",
      Array.isArray(data.services) ? data.services.join(" | ") : "", JSON.stringify(data.tasks || {}),
      data.taskDetails || "", JSON.stringify(data.serviceDetails || {}), JSON.stringify(data.operations || {}),
      JSON.stringify(data.situation || {}), JSON.stringify(data.objectives || {}),
      data.consultantBriefing?.notes || "", JSON.stringify(data.consultantBriefing?.assessment || {}),
      JSON.stringify(data)
    ];

    sheet.appendRow(row);
    sendCopy_(data, now);
    return json_({ ok: true, id: Utilities.getUuid() });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function ensureHeaders_(sheet) {
  const headers = [
    "Data/Hora","Tipo de diagnóstico","Consultor ACJL","Data do briefing","Duração do briefing",
    "Nome","Relação com empresa","Telefone","E-mail","Canal preferencial","Empresa","Nome comercial",
    "NUIT","Tipo de entidade","Sector","Actividade principal","Descrição da actividade","Ano constituição",
    "Ano início actividade","Localização","Estabelecimentos","N.º colaboradores","Volume de actividade",
    "Modelo","Serviços","Tarefas","Detalhes das tarefas","Dimensionamento dos serviços","Organização interna",
    "Situação actual","Objectivos","Notas do briefing","Avaliação técnica do consultor","Dados completos (JSON)"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }

  const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const missing = headers.filter(header => existing.indexOf(header) === -1);
  if (missing.length > 0) {
    sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
  }
}

function sendCopy_(data, submittedAt) {
  const r = data.responsible || {};
  const c = data.company || {};
  const b = data.consultantBriefing || {};
  const mode = data.diagnosticType === "BRIEFING_ACJL" ? "Briefing ACJL" : "Preenchimento pelo cliente";
  const subject = "Novo diagnóstico ACJL — " + (c.legalName || c.tradeName || "Empresa");

  const body = [
    "Foi recebido um novo diagnóstico no sistema ACJL.", "",
    "ORIGEM: " + mode,
    "DATA/HORA DE SUBMISSÃO: " + submittedAt,
    b.consultantName ? "CONSULTOR: " + b.consultantName : "",
    b.briefingDate ? "DATA DO BRIEFING: " + b.briefingDate : "",
    "", "RESPONSÁVEL",
    "Nome: " + (r.fullName || ""), "Relação: " + (r.role || ""),
    "Telefone: " + (r.phone || ""), "E-mail: " + (r.email || ""),
    "", "EMPRESA", "Razão social: " + (c.legalName || ""),
    "Nome comercial: " + (c.tradeName || ""), "NUIT: " + (c.nuit || ""),
    "Sector: " + (c.sector || ""), "Actividade: " + (c.mainActivity || ""),
    "Localização: " + (c.location || ""), "", "MODELO: " + (data.model || ""),
    "SERVIÇOS: " + (Array.isArray(data.services) ? data.services.join(", ") : ""), "",
    "O diagnóstico completo encontra-se na folha '" + SHEET_NAME + "', incluindo a coluna de dados completos em JSON."
  ].filter(Boolean).join("\n");

  MailApp.sendEmail({ to: COPY_EMAIL, subject: subject, body: body });
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
