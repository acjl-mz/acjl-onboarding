import Link from "next/link";

export default function DiagnosticoPage(){
 return <main className="acjl-page"><header className="acjl-top"><div className="acjl-logo">ACJL</div><div className="acjl-label">DIAGNÓSTICO</div></header>
 <div className="acjl-wrap"><div className="acjl-form"><div className="acjl-eyebrow">ACJL · DIAGNÓSTICO EMPRESARIAL</div><div className="acjl-progress"><span style={{width:"20%"}}/></div><div className="acjl-card" style={{marginTop:22}}><div className="acjl-eyebrow">INÍCIO</div><h1>Conheça a realidade da sua empresa</h1><p>Para prepararmos uma solução adequada às necessidades da sua empresa, precisamos conhecer alguns aspectos da sua actividade, operações e organização.</p><p>Não é necessário enviar documentos contabilísticos, fiscais ou financeiros nesta etapa.</p><div className="acjl-actions"><span/><Link className="acjl-button acjl-primary" href="/diagnostico/inicio">Começar diagnóstico →</Link></div></div></div></div>
 </main>
}