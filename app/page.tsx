import Link from "next/link";
import { Brand } from "@/components/Brand";

export default function HomePage(){
 return <main className="acjl-page">
  <header className="acjl-top"><Brand/><div className="acjl-label">SISTEMA DE DIAGNÓSTICO</div></header>
  <div className="acjl-wrap">
   <div className="acjl-hero">
    <section><div className="acjl-eyebrow">ACJL · DIAGNÓSTICO EMPRESARIAL</div><h1 className="acjl-title">Conheça a realidade da sua empresa.</h1><p className="acjl-copy">Antes de apresentar uma solução, a ACJL procura compreender como a sua empresa funciona, o que precisa e qual o nível de apoio necessário.</p><Link className="acjl-button acjl-primary" href="/diagnostico">Começar diagnóstico <span>→</span></Link></section>
    <aside className="acjl-card acjl-card-dark"><div className="acjl-number">01</div><h2 style={{marginBottom:8}}>Uma análise simples.</h2><p style={{color:"#d5dde4",lineHeight:1.65}}>Sem necessidade de enviar documentos nesta primeira etapa. Responda apenas às perguntas sobre a realidade da sua empresa.</p><div className="acjl-eyebrow" style={{color:"#b9923d",marginTop:28}}>TEMPO ESTIMADO</div><strong>5–10 minutos</strong></aside>
   </div>
  </div>
 </main>
}