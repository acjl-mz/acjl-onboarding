import Link from "next/link";
import { Brand } from "@/components/Brand";

export function SiteHeader({ step }: { step?: string }) {
  return (
    <header className="acjl-top">
      <Link href="/" aria-label="ACJL - página inicial">
        <Brand compact />
      </Link>
      <Link href="/interno" className="internal-access" aria-label="Acesso interno ACJL" title="Acesso interno ACJL"><span className="internal-access-icon" aria-hidden="true">🔒</span></Link>{step && <div className="acjl-label">{step}</div>}
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