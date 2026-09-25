import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] p-6">
      <div className="mx-auto max-w-3xl pt-16">
        <div className="rounded-2xl bg-white p-10 shadow-sm border border-black/5">
          <p className="text-sm font-semibold tracking-wider text-slate-500">ACJL</p>
          <p className="mt-8 text-xs font-semibold tracking-widest text-slate-400">SISTEMA DE DIAGNÓSTICO</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Conheça a realidade da sua empresa</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Uma base estruturada para compreender necessidades, dimensionar o esforço de atendimento e preparar uma solução adequada.
          </p>
          <Link href="/diagnostico" className="mt-8 inline-block rounded-lg bg-slate-900 px-5 py-3 font-medium text-white">
            Iniciar diagnóstico
          </Link>
        </div>
      </div>
    </main>
  );
}
