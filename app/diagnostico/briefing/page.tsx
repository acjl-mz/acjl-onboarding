"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { readDiagnostic, saveDiagnostic } from "@/lib/diagnostic";

type Briefing = {
  consultantName: string;
  briefingDate: string;
  duration: string;
  systems: string;
  documentFlow: string;
  internalControls: string;
  dependencies: string[];
  seasonality: string;
  risks: string[];
  assessment: string;
};

const initial: Briefing = {
  consultantName: "", briefingDate: "", duration: "", systems: "",
  documentFlow: "", internalControls: "", dependencies: [], seasonality: "",
  risks: [], assessment: "",
};

const dependencyOptions = ["Sócios/gerência", "Colaboradores-chave", "Prestador actual", "Bancos", "Clientes/fornecedores", "Sistemas/software", "Entidades públicas", "Nenhuma relevante", "Não sei"];
const riskOptions = ["Pendências em atraso", "Documentação incompleta", "Processos pouco definidos", "Dependência de uma pessoa", "Volume elevado", "Prazos próximos", "Mudança de prestador", "Nenhum identificado", "Não sei"];

export default function BriefingPage() {
  const d = readDiagnostic();
  const [b, setB] = useState<Briefing>({
    ...initial,
    ...(d.consultantBriefing as Partial<Briefing> || {}),
    dependencies: Array.isArray(d.consultantBriefing?.assessment?.dependencies)
      ? d.consultantBriefing.assessment.dependencies.split(" | ").filter(Boolean)
      : [],
    risks: Array.isArray(d.consultantBriefing?.assessment?.risks)
      ? d.consultantBriefing.assessment.risks.split(" | ").filter(Boolean)
      : [],
    assessment: d.consultantBriefing?.assessment?.assessment || "",
  });
  const [error, setError] = useState("");

  const set = (key: keyof Briefing, value: string | string[]) =>
    setB(x => ({ ...x, [key]: value }));

  const toggle = (key: "dependencies" | "risks", value: string) =>
    setB(x => ({ ...x, [key]: x[key].includes(value) ? x[key].filter(v => v !== value) : [...x[key], value] }));

  const next = () => {
    if (!b.consultantName.trim() || !b.briefingDate || !b.duration || !b.systems || !b.documentFlow || !b.internalControls) {
      setError("Complete os campos estruturados obrigatórios do briefing antes de continuar.");
      return;
    }

    const nextData = {
      ...d,
      consultantBriefing: {
        consultantName: b.consultantName,
        briefingDate: b.briefingDate,
        duration: b.duration,
        notes: "",
        assessment: {
          systems: b.systems,
          documentFlow: b.documentFlow,
          internalControls: b.internalControls,
          dependencies: b.dependencies.join(" | "),
          seasonality: b.seasonality,
          risks: b.risks.join(" | "),
          assessment: b.assessment,
        },
      },
    };

    saveDiagnostic(nextData);
    window.location.href = "/diagnostico/situacao";
  };

  return (
    <main className="acjl-page">
      <SiteHeader step="4 DE 7 · BRIEFING ACJL" />
      <div className="acjl-wrap diagnostic-shell">
        <div className="acjl-form">
          <div className="acjl-progress"><span style={{ width: "57%" }} /></div>
          <section className="acjl-card diagnostic-card">
            <div className="acjl-eyebrow">ETAPA 4 · RECOLHA TÉCNICA</div>
            <h1>Aprofundamento pelo consultor.</h1>
            <p>Não vamos repetir o que já foi respondido. Esta etapa acrescenta apenas informação técnica que ajuda a ACJL a dimensionar o trabalho.</p>

            <div className="short-section">
              <h3>Registo do briefing</h3>
              <div className="acjl-field">
                <label>Consultor ACJL *</label>
                <input className="acjl-input" value={b.consultantName} onChange={e => set("consultantName", e.target.value)} />
              </div>
              <div className="acjl-field">
                <label>Data do briefing *</label>
                <input type="date" className="acjl-input" value={b.briefingDate} onChange={e => set("briefingDate", e.target.value)} />
              </div>
              <div className="acjl-field">
                <label>Duração aproximada *</label>
                <select className="acjl-select" value={b.duration} onChange={e => set("duration", e.target.value)}>
                  <option value="">Seleccione</option><option>Até 30 minutos</option><option>30–60 minutos</option><option>60–90 minutos</option><option>Mais de 90 minutos</option>
                </select>
              </div>
            </div>

            <div className="short-section">
              <h3>Informação complementar</h3>
              <p>As perguntas abaixo não repetem os dados do formulário. Escolha a opção que melhor descreve o que o consultor verificou.</p>

              <div className="acjl-field">
                <label>Sistemas e ferramentas utilizados *</label>
                <select className="acjl-select" value={b.systems} onChange={e => set("systems", e.target.value)}>
                  <option value="">Seleccione</option><option>Software de contabilidade</option><option>Software de facturação + contabilidade</option><option>Folhas Excel / ferramentas simples</option><option>Vários sistemas integrados</option><option>Sistemas próprios / específicos</option><option>Não utiliza sistema estruturado</option><option>Não foi possível identificar</option>
                </select>
              </div>

              <div className="acjl-field">
                <label>Fluxo de documentos e informação *</label>
                <select className="acjl-select" value={b.documentFlow} onChange={e => set("documentFlow", e.target.value)}>
                  <option value="">Seleccione</option><option>Organizado e regular</option><option>Organizado, mas com falhas</option><option>Parcialmente organizado</option><option>Desorganizado / depende de intervenção manual</option><option>Não existe fluxo definido</option><option>Não foi possível identificar</option>
                </select>
              </div>

              <div className="acjl-field">
                <label>Controlos internos observados *</label>
                <select className="acjl-select" value={b.internalControls} onChange={e => set("internalControls", e.target.value)}>
                  <option value="">Seleccione</option><option>Controlos definidos e seguidos</option><option>Existem, mas são informais</option><option>Existem parcialmente</option><option>Controlos insuficientes</option><option>Praticamente inexistentes</option><option>Não foi possível identificar</option>
                </select>
              </div>

              <div className="acjl-field">
                <label>Sazonalidade ou períodos críticos</label>
                <select className="acjl-select" value={b.seasonality} onChange={e => set("seasonality", e.target.value)}>
                  <option value="">Seleccione</option><option>Não existem períodos críticos relevantes</option><option>Existem alguns períodos de maior carga</option><option>Existem vários períodos críticos</option><option>O trabalho é muito sazonal</option><option>Não foi possível identificar</option>
                </select>
              </div>
            </div>

            <div className="short-section">
              <h3>Dependências e pontos de atenção</h3>
              <div className="acjl-field">
                <label>O trabalho depende de:</label>
                <div className="task-list">
                  {dependencyOptions.map(v => <label key={v} className="task-line"><input type="checkbox" checked={b.dependencies.includes(v)} onChange={() => toggle("dependencies", v)} /><span>{v}</span></label>)}
                </div>
              </div>
              <div className="acjl-field">
                <label>Pontos de atenção identificados:</label>
                <div className="task-list">
                  {riskOptions.map(v => <label key={v} className="task-line"><input type="checkbox" checked={b.risks.includes(v)} onChange={() => toggle("risks", v)} /><span>{v}</span></label>)}
                </div>
              </div>
              <div className="acjl-field">
                <label>Observação técnica do consultor <span>(opcional)</span></label>
                <textarea rows={4} className="acjl-textarea" value={b.assessment} onChange={e => set("assessment", e.target.value)} placeholder="Registe apenas uma conclusão técnica que não tenha sido capturada pelas opções acima." />
              </div>
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
