import Link from "next/link";

export default function Empresa() {
  return <main className="min-h-screen p-6"><div className="mx-auto max-w-2xl pt-16"><div className="rounded-2xl bg-white p-8"><p className="text-sm font-semibold text-slate-500">EMPRESA</p><h1 className="mt-3 text-3xl font-semibold">Sobre a empresa</h1><div className="mt-6 space-y-4"><input className="w-full rounded-lg border p-3" placeholder="Nome da empresa" /><input className="w-full rounded-lg border p-3" placeholder="Sector de actividade" /><input className="w-full rounded-lg border p-3" placeholder="Localização" /></div><Link href="/diagnostico/necessidades" className="mt-8 inline-block rounded-lg bg-slate-900 px-5 py-3 text-white">Continuar</Link></div></div></main>;
}
