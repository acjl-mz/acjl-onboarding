"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { readDiagnostic, saveDiagnostic } from "@/lib/diagnostic";

const fields = [
  ["structure", "Estrutura da empresa", "Descreva departamentos, responsáveis, equipas ou funções relevantes para o serviço."],
  ["systems", "Sistemas e ferramentas utilizados", "Software de contabilidade, facturação, salários, gestão documental, bancos ou outras ferramentas."],
  ["fiscalRegime", "Enquadramento fiscal e obrigações", "Regime aplicável, principais obrigações, frequência e situações fiscais relevantes."],
  ["fiscalHistory", "Histórico fiscal e pendências", "Atrasos, notificações, inspecções, regularizações, reembolsos ou outros assuntos em aberto."],
  ["accountingState", "Estado da contabilidade", "Período em dia ou atrasado, qualidade dos registos, documentos disponíveis e reconciliações."],
  ["accountingVolume", "Volume contabilístico", "Estimativa de documentos/movimentos, contas bancárias, frequência de fechos e complexidade."],
  ["payrollProcess", "Processamento salarial actual", "Como os salários são preparados, controlados e submetidos; INSS, IRPS, contratos e ocorrências relevantes."],
  ["operations", "Fluxo operacional", "Como a informação nasce, é recolhida, conferida, tratada, aprovada e arquivada."],
  ["controls", "Controlos internos", "Controlos existentes, pontos frágeis, separação de funções e mecanismos de verificação."],
  ["seasonality", "Sazonalidade e períodos críticos", "Meses de maior actividade, campanhas, projectos, fechos, auditorias ou prazos importantes."],
  ["dependencies", "Dependências e interfaces", "Dependência de pessoas, fornecedores, sistemas, bancos, clientes ou prestadores externos."],
  ["provider", "Prestadores actuais e responsabilidades", "Quem executa actualmente cada área e o que ficará com a ACJL."],
  ["scope", "Escopo esperado da ACJL", "O que o cliente espera que a ACJL passe a executar, acompanhar ou melhorar."],
  ["risks", "Riscos ou pontos de atenção", "Aspectos que podem aumentar esforço, urgência, complexidade ou necessidade de acompanhamento."],
  ["assessment", "Observações técnicas do consultor", "Síntese profissional do consultor sobre a situação, necessidades identificadas e próximos passos."]
] as const;

export default function BriefingPage() {
  const [d, setD] = useState(readDiagnostic());
  const [error, setError] = useState("");

  const update = (key: string, value: string) => {
    setD((x) => ({
      ...x,
      consultantBriefing: {
        ...(x as any).consultantBriefing,
        assessment: {
          ...((x as any).consultantBriefing?.assessment || {}),
          [key]: value,
        },
      },
    }));
  };

  const meta = (key: "consultantName" | "briefingDate" | "duration" | "notes", value: string) => {
    setD((x) => ({ ...x, consultantBriefing: { ...(x as any).consultantBriefing, [key]: value } }));
  };

  const next = () => {
    const b = (d as any).consultantBriefing || {};
    if (!b.consultantName?.trim() || !b.briefingDate || !b.duration || !b.assessment?.assessment?.trim()) {
      setError("Registe o consultor, a data, a duração e as observações técnicas antes de continuar.");
      return;
    }
    saveDiagnostic(d);
    window.location.href = "/diagnostico/situacao";
  };

  return (
    <main className="acjl-page">
      <SiteHeader step="4 DE 7 · BRIEFING ACJL" />
      <div className="acjl-wrap diagnostic-shell">
        <div className="acjl-form">
          <div className="acjl-progress"><span style={{ width: "57%" }} /></div>
          <section className="acjl-card diagnostic-card">
            <div className="acjl-eyebrow">ETAPA 4 · DIAGNÓSTICO PROFUNDO</div>
            <h1>Informação recolhida pelo consultor.</h1>
            <p>Esta etapa aprofunda a realidade operacional da empresa para que a proposta seja dimensionada com base no trabalho que será efectivamente necessário.</p>

            <div className="short-section">
              <h3>Dados do briefing</h3>
              <div className="acjl-field"><label>Consultor ACJL *</label><input className="acjl-input" value={(d as any).consultantBriefing?.consultantName || ""} onChange={e => meta("consultantName", e.target.value)} /></div>
              <div className="acjl-field"><label>Data do briefing *</label><input type="date" className="acjl-input" value={(d as any).consultantBriefing?.briefingDate || ""} onChange={e => meta("briefingDate", e.target.value)} /></div>
              <div className="acjl-field"><label>Duração aproximada *</label><select className="acjl-select" value={(d as any).consultantBriefing?.duration || ""} onChange={e => meta("duration", e.target.value)}><option value="">Seleccione</option><option>Até 30 minutos</option><option>30–60 minutos</option><option>60–90 minutos</option><option>Mais de 90 minutos</option></select></div>
              <div className="acjl-field"><label>Notas gerais do briefing</label><textarea rows={3} className="acjl-textarea" value={(d as any).consultantBriefing?.notes || ""} onChange={e => meta("notes", e.target.value)} /></div>
            </div>

            <div className="short-section">
              <h3>Aprofundamento técnico</h3>
              {fields.map(([key, label, help]) => (
                <div className="acjl-field" key={key}>
                  <label>{label}{key === "assessment" ? " *" : ""}</label>
                  <textarea rows={key === "assessment" ? 6 : 4} className="acjl-textarea" value={(d as any).consultantBriefing?.assessment?.[key] || ""} onChange={e => update(key, e.target.value)} placeholder={help} />
                </div>
              ))}
            </div>

            {error && <div className="form-error" role="alert">⚠ {error}</div>}
            <div className="acjl-actions">
              <Link className="acjl-button acjl-secondary" href="/diagnostico/necessidades">← Voltar</Link>
              <button type="button" onClick={next} className="acjl-button acjl-primary">Continuar →</button>
            </div>
          </section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
