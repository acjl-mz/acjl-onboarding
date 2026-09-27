"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { SiteFooter } from "@/components/SiteChrome";

export default function InternoPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("error");
    if (value === "unauthorized") setError("Esta conta Google não está autorizada.");
    else if (value) setError("Não foi possível validar o acesso.");
  }, []);

  function loginWithGoogle() {
    setLoading(true);
    window.location.href = "/api/interno/google";
  }

  return (
    <main className="acjl-page internal-page">
      <header className="acjl-top internal-login-top">
        <Link href="/" aria-label="ACJL - página inicial"><Brand compact /></Link>
        <Link href="/" className="internal-back">← Voltar</Link>
      </header>

      <div className="acjl-wrap internal-login-wrap">
        <section className="internal-login-card">
          <div className="internal-login-card-top">
            <div className="internal-login-mark" aria-hidden="true">A</div>
            <div className="acjl-eyebrow">ÁREA INTERNA</div>
          </div>
          <h1>Acesso Restrito</h1>
          <div className="internal-login-rule" />

          <p style={{margin: "0 0 20px", color: "var(--muted, #666)"}}>
            Entre com a conta Google autorizada.
          </p>

          {error && <div className="form-error" role="alert">{error}</div>}

          <button
            type="button"
            onClick={loginWithGoogle}
            className="acjl-button acjl-primary internal-login-button"
            disabled={loading}
          >
            {loading ? "A abrir Google…" : "Continuar com Google"}
          </button>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
