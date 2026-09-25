import Link from "next/link";
import { Brand } from "@/components/Brand";

export default function DiagnosticoPage(){
 return <main className="acjl-page"><header className="acjl-top"><Brand compact/><div className="acjl-label">DIAGNÓSTICO · INÍCIO</div></header>
 <div className="acjl-wrap"><div className="acjl-form"><div className="acjl-eyebrow">ACJL · DIAGNÓSTICO EMPRESARIAL</div><div className="acjl-progress"><span style={{width:"10%"}}/></div><div className="acjl-card" style={{marginTop:22}}><div className="acjl-eyebrow">ANTES DE COMEÇAR</div><h1>Conheça a realidade da sua empresa</h1><div className="gold-line"/><p>Para prepararmos uma solução adequada às necessidades da sua empresa, precisamos conhecer alguns aspectos da sua actividade, operações e organização.</p><p>Não é necessário enviar documentos contabilísticos, fiscais ou financeiros nesta etapa.</p><div className="acjl-actions"><span/><Link className="acjl-button acjl-primary" href="/diagnostico/inicio">Começar diagnóstico →</Link></div></div></div></div>
 </main>
}