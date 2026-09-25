import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export default function SucessoPage() {
  return (
    <main className="acjl-page">
      <SiteHeader />
      <div className="acjl-wrap success-wrap">
        <section className="acjl-card success-card">
          <div className="success-icon">✓</div>
          <div className="acjl-eyebrow">DIAGNÓSTICO RECEBIDO</div>
          <h1>Obrigado. Recebemos a sua informação.</h1>
          <p>
            A equipa ACJL irá analisar a realidade e as necessidades apresentadas
            antes de preparar uma solução.
          </p>
          <span className="status-pill">Em análise</span>
          <div>
            <Link href="/" className="acjl-button acjl-primary">
              Voltar à página inicial
            </Link>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}