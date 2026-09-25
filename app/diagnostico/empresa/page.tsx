"use client";

import { useState } from "react";
import Link from "next/link";

export default function EmpresaPage() {
  const [form, setForm] = useState({name:"", trade:"", sector:"", activity:"", location:"", employees:""});
  const set = (key:string, value:string) => setForm({...form,[key]:value});
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] p-6">
      <div className="mx-auto max-w-2xl pt-8">
        <p className="text-sm text-slate-500">1 de 5 · Empresa</p>
        <section className="mt-3 rounded-2xl bg-white p-8 border border-black/5 shadow-sm">
          <h1 className="text-2xl font-semibold">Sobre a sua empresa</h1>
          <p className="mt-2 text-slate-600">Começamos por algumas informações básicas.</p>
          <div className="mt-7 space-y-5">
            {[
              ["name","Nome da empresa","text"],
              ["trade","Nome comercial","text"],
              ["sector","Sector de actividade","text"],
              ["activity","Descreva brevemente a actividade","text"],
              ["location","Localização","text"]
            ].map(([key,label,type]) => <label key={key} className="block text-sm font-medium">{label}<input type={type} value={(form as any)[key]} onChange={e=>set(key,e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-slate-200" /></label>)}
            <label className="block text-sm font-medium">Número de trabalhadores<select value={form.employees} onChange={e=>set("employees",e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3"><option value="">Seleccione</option><option>1–5</option><option>6–10</option><option>11–25</option><option>26–50</option><option>51–100</option><option>&gt;100</option></select></label>
          </div>
          <div className="mt-8 flex justify-between"><Link href="/diagnostico/inicio" className="rounded-lg border px-5 py-3">Voltar</Link><Link href="/diagnostico/necessidades" className="rounded-lg bg-slate-900 px-5 py-3 text-white">Continuar</Link></div>
        </section>
      </div>
    </main>
  );
}
