import Link from "next/link";

export default function HomePage(){
 return <main className="acjl-page">
  <header className="acjl-top"><div className="acjl-logo">ACJL</div><div className="acjl-label">CONTABILIDADE & SERVIÇOS</div></header>
  <div className="acjl-wrap">
   <div className="acjl-hero">
    <section><div className="acjl-eyebrow">SISTEMA DE DIAGNÓSTICO</div><h1 className="acjl-title">Conheça a realidade da sua empresa.</h1><p className="acjl-copy">Antes de apresentar uma solução, a ACJL procura compreender como a sua empresa funciona, o que precisa e qual o nível de apoio necessário.</p><Link className="acjl-button acjl-primary" href="/diagnostico">Começar diagnóstico <span>→</span></Link></section>
    <aside className="acjl-card acjl-card-dark"><div className="acjl-number">01</div><h2>Uma análise simples.</h2><p>Sem necessidade de enviar documentos nesta primeira etapa. Responda apenas às perguntas sobre a realidade da sua empresa.</p><div className="acjl-eyebrow" style={{color:"#b8c0c8",marginTop:28}}>TEMPO ESTIMADO</div><strong>5–10 minutos</strong></aside>
   </div>
  </div>
 </main>
}