import Link from "next/link";

export default function RevisaoPage() {
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] p-6">
      <div className="mx-auto max-w-2xl pt-8">
        <p className="text-sm text-slate-500">5 de 5 · Confirmação</p>
        <section className="mt-3 rounded-2xl bg-white p-8 border border-black/5 shadow-sm">
          <h1 className="text-2xl font-semibold">Confirme as informações</h1>
          <p className="mt-3 text-slate-600">Reveja os dados antes de enviar. Depois da submissão, a equipa ACJL fará a análise.</p>
          <label className="mt-7 flex gap-3 text-sm"><input type="checkbox" /> Confirmo que as informações fornecidas são verdadeiras de acordo com o meu conhecimento.</label>
          <div className="mt-8 flex justify-between"><Link href="/diagnostico/objectivos" className="rounded-lg border px-5 py-3">Voltar</Link><Link href="/diagnostico/sucesso" className="rounded-lg bg-slate-900 px-5 py-3 text-white">Enviar diagnóstico</Link></div>
        </section>
      </div>
    </main>
  );
}
