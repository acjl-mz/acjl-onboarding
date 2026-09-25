export function Brand({compact=false}:{compact?:boolean}) {
  return (
    <div className={compact ? "brand brand-compact" : "brand"}>
      <div className="brand-mark">
        <span className="brand-box brand-black">A</span>
        <span className="brand-box brand-blue">C</span>
        <span className="brand-box brand-blue">J</span>
        <span className="brand-box brand-blue">L</span>
      </div>
      {!compact && <div className="brand-tagline">Fiscalidade <i>•</i> Contabilidade <i>•</i> RH <i>•</i> Serviços</div>}
    </div>
  );
}