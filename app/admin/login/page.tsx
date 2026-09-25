export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[var(--acjl-surface)] flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-black/5">
        <p className="text-sm font-semibold text-slate-500">ACJL</p>
        <h1 className="mt-2 text-2xl font-semibold">Área ACJL</h1>
        <p className="mt-3 text-slate-600">Autenticação interna será ligada ao Supabase Auth na próxima fase.</p>
      </section>
    </main>
  );
}
