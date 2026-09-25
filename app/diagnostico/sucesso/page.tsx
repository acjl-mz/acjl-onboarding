import Link from "next/link";

export default function SucessoPage() {
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] flex items-center justify-center p-6">
      <section className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm border border-black/5">
        <p className="text-sm font-semibold text-slate-500">ACJL</p>
        <h1 className="mt-3 text-3xl font-semibold">Diagnóstico recebido</h1>
        <p className="mt-4 text-slate-600">Obrigado. A sua informação foi recebida e encontra-se em análise pela equipa ACJL.</p>
        <p className="mt-4 text-sm text-slate-500">Estado: Em análise</p>
        <Link href="/" className="mt-7 inline-block rounded-lg border px-5 py-3">Voltar</Link>
      </section>
    </main>
  );
}
