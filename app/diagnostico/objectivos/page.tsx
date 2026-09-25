import Link from "next/link";

export default function ObjectivosPage() {
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] p-6">
      <div className="mx-auto max-w-2xl pt-8">
        <p className="text-sm text-slate-500">4 de 5 · Objectivos</p>
        <section className="mt-3 rounded-2xl bg-white p-8 border border-black/5 shadow-sm">
          <h1 className="text-2xl font-semibold">O que pretende alcançar?</h1>
          <textarea placeholder="Conte-nos, com as suas palavras, o principal resultado que procura." rows={7} className="mt-6 w-full rounded-lg border border-slate-300 p-3" />
          <label className="mt-5 flex gap-3 text-sm"><input type="checkbox" /> Gostaria de receber recomendação da ACJL sobre o modelo de contratação.</label>
          <div className="mt-8 flex justify-between"><Link href="/diagnostico/situacao" className="rounded-lg border px-5 py-3">Voltar</Link><Link href="/diagnostico/revisao" className="rounded-lg bg-slate-900 px-5 py-3 text-white">Continuar</Link></div>
        </section>
      </div>
    </main>
  );
}
