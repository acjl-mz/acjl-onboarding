import Link from "next/link";

export default function DiagnosticoPage() {
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] p-6">
      <div className="mx-auto max-w-2xl pt-16">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-black/5">
          <p className="text-sm font-semibold text-slate-500">ACJL</p>
          <h1 className="mt-3 text-3xl font-semibold">
            Conheça a realidade da sua empresa
          </h1>
          <p className="mt-4 text-slate-600">
            Para prepararmos uma solução adequada às necessidades da sua empresa,
            precisamos conhecer alguns aspectos da sua actividade, operações e organização.
          </p>
          <p className="mt-5 text-sm text-slate-500">
            Tempo estimado: 5–10 minutos.
          </p>
          <Link
            href="/diagnostico/inicio"
            className="mt-8 inline-block rounded-lg bg-slate-900 px-5 py-3 text-white"
          >
            Começar diagnóstico
          </Link>
        </div>
      </div>
    </main>
  );
}
