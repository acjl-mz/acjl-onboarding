"use client";

import { useState } from "react";
import Link from "next/link";

const services = [
  "Gestão Fiscal e de Impostos","Contabilidade","Processamento de Salários",
  "Assistência Administrativa","Auditoria","Treinamento","Serviço especializado","Outro"
];

export default function NecessidadesPage() {
  const [selected,setSelected] = useState<string[]>([]);
  const toggle=(s:string)=>setSelected(selected.includes(s)?selected.filter(x=>x!==s):[...selected,s]);
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] p-6">
      <div className="mx-auto max-w-2xl pt-8">
        <p className="text-sm text-slate-500">2 de 5 · Necessidades</p>
        <section className="mt-3 rounded-2xl bg-white p-8 border border-black/5 shadow-sm">
          <h1 className="text-2xl font-semibold">Em que podemos apoiar?</h1>
          <p className="mt-2 text-slate-600">Seleccione todos os serviços que fazem sentido para a sua empresa.</p>
          <div className="mt-7 grid gap-3">
            {services.map(s=><button type="button" key={s} onClick={()=>toggle(s)} className={`rounded-xl border p-4 text-left transition ${selected.includes(s)?"border-slate-900 bg-slate-50":"border-slate-200"}`}>{s}<span className="float-right">{selected.includes(s)?"✓":"+"}</span></button>)}
          </div>
          <div className="mt-8 flex justify-between"><Link href="/diagnostico/empresa" className="rounded-lg border px-5 py-3">Voltar</Link><Link href="/diagnostico/situacao" className="rounded-lg bg-slate-900 px-5 py-3 text-white">Continuar</Link></div>
        </section>
      </div>
    </main>
  );
}
