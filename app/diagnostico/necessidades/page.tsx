"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import {
  readDiagnostic,
  saveDiagnostic,
  serviceDescriptions,
  serviceTasks,
  serviceDiagnosticQuestions,
} from "@/lib/diagnostic";

const services = Object.keys(serviceDescriptions);

const locked = [
  "Gestão Fiscal e de Impostos",
  "Contabilidade",
  "Processamento de Salários",
  "Assistência Administrativa",
];

export default function NecessidadesPage() {
  const [d, setD] = useState(readDiagnostic());
  const [error, setError] = useState("");
  const isBriefing = d.diagnosticType === "BRIEFING_ACJL";

  const setModel = (model: "AVENCA" | "PONTUAL") => {
    setD((x) => ({
      ...x,
      model,
      services: model === "AVENCA" ? locked : [],
      tasks: {},
      taskDetails: "",
    }));
  };

  const toggleService = (service: string) => {
    setD((x) => ({
      ...x,
      services: x.services.includes(service)
        ? x.services.filter((value) => value !== service)
        : [...x.services, service],
    }));
  };

  const toggleTask = (service: string, task: string) => {
    setD((x) => ({
      ...x,
      tasks: {
        ...x.tasks,
        [service]: (x.tasks[service] || []).includes(task)
          ? (x.tasks[service] || []).filter((value) => value !== task)
          : [...(x.tasks[service] || []), task],
      },
    }));
  };

  const updateDetail = (service: string, key: string, value: string) => {
    setD((x) => ({
      ...x,
      serviceDetails: {
        ...x.serviceDetails,
        [service]: {
          ...(x.serviceDetails?.[service] || {}),
          [key]: value,
        },
      },
    }));
  };

  const goNext = () => {
    if (!d.model) {
      setError("Seleccione uma modalidade de apoio para continuar.");
      return;
    }

    if (
      d.model === "PONTUAL" &&
      !d.services.length &&
      !d.taskDetails.trim()
    ) {
      setError(
        "Seleccione pelo menos uma área ou descreva a necessidade que pretende tratar.",
      );
      return;
    }

    if (
      d.model === "PONTUAL" &&
      d.services.some((service) => {
        const detail = d.serviceDetails?.[service];
        return (
          !detail?.currentState ||
          !detail?.frequency ||
          !detail?.volume ||
          !detail?.urgency
        );
      })
    ) {
      setError(
        "Complete os campos de dimensionamento das áreas seleccionadas antes de continuar.",
      );
      return;
    }

    saveDiagnostic(d);
    window.location.href = d.diagnosticType === "BRIEFING_ACJL" ? "/diagnostico/briefing" : "/diagnostico/situacao";
  };

  return (
    <main className="acjl-page">
      <SiteHeader step={isBriefing ? "3 DE 7 · NECESSIDADES E DIMENSIONAMENTO" : "3 DE 6 · MODELO E NECESSIDADES"} />

      <div className="acjl-wrap diagnostic-shell">
        <div className="acjl-form">
          <div className="acjl-progress">
            <span style={{ width: "50%" }} />
          </div>

          <section className="acjl-card diagnostic-card">
            <div className="acjl-eyebrow">ETAPA 3 · MODELO DE APOIO</div>

            <h1>{isBriefing ? "O que precisa de ser tratado?" : "Como pretende contar com a ACJL?"}</h1>
            <p>{isBriefing ? "No briefing, o consultor poderá aprofundar as necessidades, mesmo quando a empresa ainda não sabe exactamente qual serviço precisa." : "Escolha o modelo que melhor corresponde à necessidade da sua empresa."}</p>

            <div className="model-grid">
              <button
                type="button"
                className={
                  "model-option " + (d.model === "AVENCA" ? "active" : "")
                }
                onClick={() => setModel("AVENCA")}
              >
                <strong>Apoio contínuo · Avença mensal</strong>
                <span>
                  Um pacote integrado para acompanhar de forma recorrente as
                  principais rotinas fiscais, contabilísticas, salariais e
                  administrativas.
                </span>
              </button>

              <button
                type="button"
                className={
                  "model-option " + (d.model === "PONTUAL" ? "active" : "")
                }
                onClick={() => setModel("PONTUAL")}
              >
                <strong>Serviço pontual</strong>
                <span>
                  Para tratar uma tarefa, projecto, regularização, auditoria,
                  formação ou outra necessidade específica.
                </span>
              </button>
            </div>

            {d.model === "AVENCA" && (
              <div className="locked-package">
                <div className="acjl-eyebrow">PACOTE DE ENTRADA ACJL</div>
                <h2>O pacote já vem estruturado.</h2>
                <p>Na modalidade de apoio contínuo, o pacote inclui:</p>

                <div className="package-items">
                  {locked.map((service) => (
                    <div key={service}>
                      ✓ <strong>{service}</strong>
                    </div>
                  ))}
                </div>

                <div className="package-price">
                  <strong>6.000,00 MZN + IVA</strong>
                  <span>
                    Valor de entrada. O preço final é definido após a avaliação
                    da realidade e das necessidades da empresa.
                  </span>
                </div>
              </div>
            )}

            {d.model === "PONTUAL" && (
              <>
                <div className="selection-note">
                  Seleccione primeiro as áreas e depois as tarefas que pretende
                  tratar. Incluímos abaixo situações e pedidos frequentemente
                  procurados pelas empresas.
                </div>

                <div className="service-grid">
                  {services.map((service) => {
                    const selected = d.services.includes(service);
                    const details =
                      d.serviceDetails?.[service] || {
                        currentState: "",
                        frequency: "",
                        volume: "",
                        urgency: "",
                        notes: "",
                      };
                    const question = serviceDiagnosticQuestions[service];

                    return (
                      <div key={service}>
                        <button
                          type="button"
                          onClick={() => toggleService(service)}
                          className={
                            "service-option" + (selected ? " active" : "")
                          }
                        >
                          <span className="service-title">{service}</span>
                          <span className="service-check">
                            {selected ? "✓" : "+"}
                          </span>
                        </button>

                        {selected && (
                          <>
                            <div className="task-list">
                              {(serviceTasks[service] || []).map((task) => (
                                <label key={task} className="task-line">
                                  <input
                                    type="checkbox"
                                    checked={(d.tasks[service] || []).includes(
                                      task,
                                    )}
                                    onChange={() =>
                                      toggleTask(service, task)
                                    }
                                  />
                                  <span>{task}</span>
                                </label>
                              ))}
                            </div>

                            <div className="service-detail-box">
                              <div className="acjl-eyebrow">
                                PARA DIMENSIONAR O APOIO
                              </div>

                              <div className="acjl-field compact">
                                <label>Como está esta área actualmente?</label>
                                <select
                                  className="acjl-select"
                                  value={details.currentState}
                                  onChange={(e) =>
                                    updateDetail(
                                      service,
                                      "currentState",
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="">Seleccione</option>
                                  <option>
                                    Está organizada e funciona normalmente
                                  </option>
                                  <option>
                                    Funciona, mas precisa de melhoria
                                  </option>
                                  <option>
                                    Está parcialmente organizada
                                  </option>
                                  <option>
                                    Está atrasada/desorganizada
                                  </option>
                                  <option>Não existe internamente</option>
                                  <option>Não sei</option>
                                </select>
                              </div>

                              <div className="acjl-field compact">
                                <label>
                                  Com que frequência existe esta necessidade?
                                </label>
                                <select
                                  className="acjl-select"
                                  value={details.frequency}
                                  onChange={(e) =>
                                    updateDetail(
                                      service,
                                      "frequency",
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="">Seleccione</option>
                                  <option>Diária</option>
                                  <option>Semanal</option>
                                  <option>Mensal</option>
                                  <option>Trimestral</option>
                                  <option>Eventual</option>
                                  <option>Uma única vez</option>
                                </select>
                              </div>

                              <div className="acjl-field compact">
                                <label>{question.volumeLabel}</label>
                                <select
                                  className="acjl-select"
                                  value={details.volume}
                                  onChange={(e) =>
                                    updateDetail(
                                      service,
                                      "volume",
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="">Seleccione</option>
                                  {question.volumeOptions.map((option) => (
                                    <option key={option}>{option}</option>
                                  ))}
                                </select>
                                <small>{question.help}</small>
                              </div>

                              <div className="acjl-field compact">
                                <label>
                                  Existe alguma urgência ou prazo relevante?
                                </label>
                                <select
                                  className="acjl-select"
                                  value={details.urgency}
                                  onChange={(e) =>
                                    updateDetail(
                                      service,
                                      "urgency",
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="">Seleccione</option>
                                  <option>Não</option>
                                  <option>
                                    Sim, nos próximos 7 dias
                                  </option>
                                  <option>
                                    Sim, nos próximos 30 dias
                                  </option>
                                  <option>
                                    Sim, mas sem prazo definido
                                  </option>
                                </select>
                              </div>

                              <div className="acjl-field compact">
                                <label>
                                  Observação sobre esta área{" "}
                                  <span>(opcional)</span>
                                </label>
                                <textarea
                                  rows={2}
                                  className="acjl-textarea"
                                  value={details.notes}
                                  onChange={(e) =>
                                    updateDetail(
                                      service,
                                      "notes",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Acrescente apenas o que considerar relevante."
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="acjl-field">
                  <label>
                    Outra tarefa, necessidade ou detalhe importante{" "}
                    <span>(opcional)</span>
                  </label>
                  <textarea
                    rows={5}
                    className="acjl-textarea"
                    value={d.taskDetails}
                    onChange={(e) =>
                      setD((x) => ({
                        ...x,
                        taskDetails: e.target.value,
                      }))
                    }
                    placeholder="Não encontrou o que procura? Explique aqui. Pode também acrescentar contexto, urgência ou o resultado que pretende alcançar."
                  />
                </div>
              </>
            )}
          </section>

          {error && (
            <div className="form-error" role="alert">
              ⚠ {error}
            </div>
          )}

          <div className="acjl-actions">
            <Link
              className="acjl-button acjl-secondary"
              href="/diagnostico/empresa"
            >
              ← Voltar
            </Link>

            <button
              type="button"
              onClick={goNext}
              className="acjl-button acjl-primary"
            >
              Continuar →
            </button>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
