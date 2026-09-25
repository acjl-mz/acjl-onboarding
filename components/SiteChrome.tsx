import Link from "next/link";
import { Brand } from "@/components/Brand";

export function SiteHeader({ step }: { step?: string }) {
  return (
    <header className="acjl-top">
      <Link href="/" aria-label="ACJL - página inicial">
        <Brand compact />
      </Link>
      <Link href="/interno" className="internal-access" aria-label="Acesso interno ACJL" title="Acesso interno ACJL"><svg className="internal-access-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 10V7a5 5 0 0 1 10 0v3M6 10h12a1 1 0 0 1 1 1v9H5v-9a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>{step && <div className="acjl-label">{step}</div>}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="acjl-footer">
      <div className="acjl-footer-inner">
        <div className="acjl-footer-text">Fiscalidade <span>•</span> Contabilidade <span>•</span> RH <span>•</span> Serviços</div>
        <div className="acjl-footer-note">Todos os direitos reservados a ACJL - Contabilidade &amp; Serviços</div>
      </div>
    </footer>
  );
}