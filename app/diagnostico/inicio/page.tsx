import Link from "next/link";

export default function InicioDiagnostico() {
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] p-6">
      <div className="mx-auto max-w-2xl pt-10">
        <div className="mb-6 flex gap-2 text-xs text-slate-400"><span>Empresa</span><span>→</span><span>Necessidades</span><span>→</span><span>Operações</span><span>→</span><span>Confirmação</span></div>
        <section className="rounded-2xl bg-white p-8 border border-black/5 shadow-sm">
          <h1 className="text-2xl font-semibold">Antes de começarmos</h1>
          <p className="mt-3 text-slate-600">Este diagnóstico recolhe apenas as informações necessárias para compreender a sua empresa e preparar uma solução adequada.</p>
          <p className="mt-3 text-slate-600">Não é necessário enviar documentos contabilísticos, fiscais ou financeiros nesta etapa.</p>
          <Link href="/diagnostico/empresa" className="mt-8 inline-block rounded-lg bg-slate-900 px-5 py-3 text-white">Continuar</Link>
        </section>
      </div>
    </main>
  );
}
