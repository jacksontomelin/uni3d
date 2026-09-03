/**
 * Logotipo Uni3D — estrela do ecossistema UniController + wordmark.
 * Mesma estrela usada no UNIPROCURAÇÕES / Litoral CRM.
 */
export function Estrela({ size = 26, fill = "#38bdf8", stroke = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l2.6 6.5L21 9.3l-4.8 4.3L17.6 21 12 17.3 6.4 21l1.4-7.4L3 9.3l6.4-.8L12 2z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Cubo({ size = 26, color = "#38bdf8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </svg>
  );
}

export default function Logo({ variant = "sidebar" }) {
  if (variant === "login") {
    return (
      <div className="flex flex-col items-center mb-3">
        <div className="relative w-14 h-14 mb-2">
          <div className="absolute inset-0 rounded-2xl bg-navy" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cubo size={30} color="#38bdf8" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Estrela size={18} fill="#0284c7" stroke="#fff" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-[10px]">
      <div className="relative w-9 h-9 shrink-0">
        <div className="absolute inset-0 rounded-[9px] bg-white/10 border border-white/15" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cubo size={22} color="#38bdf8" />
        </div>
        <div className="absolute -top-[5px] -right-[5px]">
          <Estrela size={14} fill="#38bdf8" stroke="#0f2d4a" />
        </div>
      </div>
      <div className="sidebar__brand-text">
        Uni3D
        <small>UniController</small>
      </div>
    </div>
  );
}
