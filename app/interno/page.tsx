"use client";
import { useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { SiteFooter } from "@/components/SiteChrome";

export default function InternoPage(){
  const [identifier,setIdentifier]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  async function login(e:React.FormEvent){
    e.preventDefault();setLoading(true);setError("");
    const r=await fetch("/api/interno/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifier,password})});
    if(r.ok){window.location.href="/interno/balcao";return}
    setError("Dados de acesso inválidos.");
    setLoading(false);
  }
  return <main className="acjl-page">
    <header className="acjl-top"><Link href="/" aria-label="ACJL - página inicial"><Brand compact/></Link><Link href="/" className="internal-back">Voltar</Link></header>
    <div className="acjl-wrap internal-login-wrap">
      <section className="acjl-card internal-login-card">
        <div className="internal-login-mark">A</div>
        <h1>Acesso</h1>
        <form onSubmit={login}>
          <label>E-mail ou celular<input type="text" value={identifier} onChange={e=>setIdentifier(e.target.value)} autoComplete="username" required/></label>
          <label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>
          {error&&<div className="form-error" role="alert">{error}</div>}
          <button className="acjl-button acjl-primary" disabled={loading}>{loading?"A entrar…":"Entrar"}</button>
        </form>
      </section>
    </div>
    <SiteFooter/>
  </main>}
