"use client";

import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { readDiagnostic, saveDiagnostic, DiagnosticMode } from "@/lib/diagnostic";

export default function Inicio() {
  const [d] = useState(readDiagnostic());
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const choose = (mode: DiagnosticMode) => {
    setError("");
    if (mode === "BRIEFING_ACJL") {
      setShowCode(true);
      return;
    }
    saveDiagnostic({ ...d, diagnosticType: mode });
    window.location.href = "/diagnostico/responsavel";
  };

  const continueBriefing = async () => {
    if (!code.trim()) { setError("Introduza o código de acesso do consultor."); return; }
    setChecking(true); setError("");
    try {
      const response = await fetch("/api/diagnostico/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "consultantAccess", code }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Código de acesso inválido.");
      saveDiagnostic({ ...d, diagnosticType: "BRIEFING_ACJL" });
      window.location.href = "/diagnostico/responsavel";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível validar o acesso.");
    } finally { setChecking(false); }
  };

  return <main className="acjl-page">
    <SiteHeader step="DIAGNÓSTICO ACJL" />
    <div className="acjl-wrap diagnostic-shell"><div className="acjl-form">
      <section className="acjl-card diagnostic-card">
        <div className="acjl-eyebrow">COMO SERÁ REALIZADO O DIAGNÓSTICO?</div>
        <h1>Escolha como pretende realizar o diagnóstico.</h1>
        <p>As duas opções utilizam a mesma base de informação. A diferença está na profundidade da recolha.</p>
        <div className="model-grid">
          <button type="button" className="model-option" onClick={() => choose("CLIENTE_AUTO")}>
            <strong>Preencher sozinho</strong>
            <span>Responda às perguntas online, de forma simples e autónoma. A ACJL utilizará as informações para compreender a sua empresa e preparar a análise inicial.</span>
          </button>
          <button type="button" className="model-option" onClick={() => choose("BRIEFING_ACJL")}>
            <strong>Fazer briefing com um consultor ACJL</strong>
            <span>Uma conversa orientada com um consultor ACJL para aprofundar a realidade da empresa, esclarecer questões e identificar as necessidades com maior precisão.</span>
          </button>
        </div>
        {showCode && <div className="service-detail-box" style={{marginTop:24}}>
          <div className="acjl-eyebrow">ACESSO INTERNO</div>
          <h3>Briefing com consultor ACJL</h3>
          <p>Introduza o código de acesso fornecido ao pessoal autorizado.</p>
          <div className="acjl-field">
            <label htmlFor="consultant-code">Código de acesso *</label>
            <input id="consultant-code" type="password" autoComplete="off" className="acjl-input"
              value={code} onChange={e => setCode(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") void continueBriefing(); }}
              placeholder="Código de acesso" />
          </div>
          {error && <div className="form-error" role="alert">⚠ {error}</div>}
          <div className="acjl-actions">
            <button type="button" className="acjl-button acjl-secondary" onClick={() => {setShowCode(false);setCode("");setError("");}}>Cancelar</button>
            <button type="button" className="acjl-button acjl-primary" disabled={checking} onClick={() => void continueBriefing()}>
              {checking ? "A validar…" : "Entrar no briefing →"}
            </button>
          </div>
        </div>}
      </section>
    </div></div>
    <SiteFooter />
  </main>;
}
