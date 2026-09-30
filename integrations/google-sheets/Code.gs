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
      emailSent: emailSent,
      emailError: emailError
    });
  } catch (error) {
    return json_({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
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

function arrayText_(value) {
  return Array.isArray(value) ? value.join(" | ") : "";
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
    ? "Briefing ACJL"
    : "Preenchimento pelo cliente";

  const subject = "Novo diagnóstico ACJL — " + (c.legalName || c.tradeName || "Empresa");

  const body = [
    "Foi recebido um novo diagnóstico no sistema ACJL.",
    "",
    "ORIGEM: " + mode,
    "ID: " + id,
    "DATA/HORA DE SUBMISSÃO: " + submittedAt,
    "FOLHA: " + sheetName,
    b.consultantName ? "CONSULTOR: " + b.consultantName : "",
    b.briefingDate ? "DATA DO BRIEFING: " + b.briefingDate : "",
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
    "MODELO: " + (data.model || ""),
    "SERVIÇOS: " + arrayText_(data.services),
    "",
    "O registo foi guardado com todas as respostas na folha indicada, incluindo a coluna 'Dados completos (JSON)'."
  ].filter(Boolean).join("\n");

  MailApp.sendEmail({
    to: COPY_EMAIL,
    subject: subject,
    body: body
  });
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
