import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] flex items-center justify-center p-6">
      <section className="w-full max-w-3xl rounded-2xl bg-white p-10 shadow-sm border border-black/5">
        <p className="text-sm font-semibold tracking-wide text-slate-500">ACJL — CONTABILIDADE & SERVIÇOS</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Diagnóstico, dimensionamento e precificação</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Fundação técnica do sistema ACJL para transformar a realidade de cada empresa
          numa solução de serviços dimensionada.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/diagnostico" className="rounded-lg bg-slate-900 px-5 py-3 text-white">
            Iniciar diagnóstico
          </Link>
          <Link href="/admin/login" className="rounded-lg border border-slate-300 px-5 py-3">
            Área ACJL
          </Link>
        </div>
      </section>
    </main>
  );
}
