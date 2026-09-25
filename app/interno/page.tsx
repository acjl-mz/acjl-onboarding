"use client";
import { useState } from "react";
import { Brand } from "@/components/Brand";

export default function InternoPage(){
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  async function login(e:React.FormEvent){
    e.preventDefault();setLoading(true);setError("");
    const r=await fetch("/api/interno/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});
    if(r.ok){window.location.href="/interno/balcao";return}
    setError("Credenciais de acesso inválidas.");
    setLoading(false);
  }
  return <main className="acjl-page"><header className="acjl-top"><Brand compact/></header><div className="acjl-wrap internal-login-wrap"><section className="acjl-card internal-login-card"><div className="acjl-eyebrow">ACESSO INTERNO</div><h1>Balcão ACJL</h1><p>Área reservada para acompanhamento dos diagnósticos e oportunidades recebidas.</p><form onSubmit={login}><label>Senha de acesso<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>{error&&<div className="form-error" role="alert">{error}</div>}<button className="acjl-button acjl-primary" disabled={loading}>{loading?"A entrar…":"Entrar no balcão"}</button></form></section></div></main>}
