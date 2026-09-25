import Link from "next/link";
import { Brand } from "@/components/Brand";

function RestrictedAccess(){return <Link href="/interno" className="internal-access" aria-label="Acesso Restrito"><svg className="internal-access-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3M6 10h12v10H6z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 14v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg><span>Acesso Restrito</span></Link>}

export function SiteHeader({ step }: { step?: string }) {
  return (
    <header className="acjl-top">
      <Link href="/" aria-label="ACJL - página inicial">
        <Brand compact />
      </Link>
      <RestrictedAccess />{step && <div className="acjl-label acjl-step-label">{step}</div>}
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