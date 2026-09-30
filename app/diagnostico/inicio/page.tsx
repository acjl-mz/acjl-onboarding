"use client";

import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { readDiagnostic, saveDiagnostic, DiagnosticMode } from "@/lib/diagnostic";

export default function Inicio() {
  const [d, setD] = useState(readDiagnostic());

  const choose = (mode: DiagnosticMode) => {
    const current = readDiagnostic();
    saveDiagnostic({ ...current, diagnosticType: mode });
    window.location.href = "/diagnostico/responsavel";
  };

  return (
    <main className="acjl-page">
      <SiteHeader step="DIAGNÓSTICO ACJL" />
      <div className="acjl-wrap diagnostic-shell">
        <div className="acjl-form">
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
          </section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
