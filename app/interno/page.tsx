"use client";

import { useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { SiteFooter } from "@/components/SiteChrome";

export default function InternoPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const r = await fetch("/api/interno/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (r.ok) {
        window.location.href = "/interno/balcao";
        return;
      }

      setError("Dados de acesso inválidos.");
    } catch {
      setError("Não foi possível validar o acesso.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="acjl-page internal-page">
      <header className="acjl-top internal-login-top">
        <Link href="/" aria-label="ACJL - página inicial">
          <Brand compact />
        </Link>
        <Link href="/" className="internal-back">
          ← Voltar
        </Link>
      </header>

      <div className="acjl-wrap internal-login-wrap">
        <section className="internal-login-card">
          <div className="internal-login-card-top">
            <div className="internal-login-mark" aria-hidden="true">A</div>
            <div className="acjl-eyebrow">ÁREA INTERNA</div>
          </div>

          <h1>Acesso Restrito</h1>
          <div className="internal-login-rule" />

          <form onSubmit={login}>
            <div className="internal-field">
              <label htmlFor="identifier">E-mail ou celular</label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="internal-field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <button className="acjl-button acjl-primary internal-login-button" disabled={loading}>
              {loading ? "A entrar…" : "Entrar"}
            </button>
          </form>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
