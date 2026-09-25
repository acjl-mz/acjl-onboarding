import Link from "next/link";

export default function Inicio() {
  return <main className="min-h-screen p-6"><div className="mx-auto max-w-2xl pt-16"><div className="rounded-2xl bg-white p-8"><p className="text-sm font-semibold text-slate-500">ETAPA 1 DE 5</p><h1 className="mt-3 text-3xl font-semibold">Empresa</h1><p className="mt-4 text-slate-600">Vamos começar pelos dados essenciais da empresa.</p><Link href="/diagnostico/empresa" className="mt-8 inline-block rounded-lg bg-slate-900 px-5 py-3 text-white">Continuar</Link></div></div></main>;
}
