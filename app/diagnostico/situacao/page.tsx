import Link from "next/link";

export default function SituacaoPage() {
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] p-6">
      <div className="mx-auto max-w-2xl pt-8">
        <p className="text-sm text-slate-500">3 de 5 · Situação actual</p>
        <section className="mt-3 rounded-2xl bg-white p-8 border border-black/5 shadow-sm">
          <h1 className="text-2xl font-semibold">Como está a empresa actualmente?</h1>
          <div className="mt-7 space-y-5">
            <label className="block text-sm font-medium">Já trabalha com algum prestador?<select className="mt-2 w-full rounded-lg border border-slate-300 p-3"><option>Seleccione</option><option>Sim</option><option>Não</option><option>Parcialmente</option></select></label>
            <label className="block text-sm font-medium">O que motivou a procura de apoio?<textarea rows={4} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label>
            <label className="block text-sm font-medium">Existem assuntos pendentes que gostaria de resolver?<textarea rows={4} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label>
          </div>
          <div className="mt-8 flex justify-between"><Link href="/diagnostico/necessidades" className="rounded-lg border px-5 py-3">Voltar</Link><Link href="/diagnostico/objectivos" className="rounded-lg bg-slate-900 px-5 py-3 text-white">Continuar</Link></div>
        </section>
      </div>
    </main>
  );
}
