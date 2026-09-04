// Logo Uni3D — cubo em wireframe com ponto mint (cabeçote de impressão)
export function Mark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3l11 6.35v12.7L16 28.4 5 22.05V9.35L16 3z" stroke="#2a3140" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M16 3l11 6.35L16 15.7 5 9.35 16 3z" stroke="#4a525e" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M16 15.7v12.7M16 15.7L5 9.35M16 15.7l11-6.35" stroke="#4a525e" strokeWidth="1.2"/>
      <circle cx="16" cy="15.7" r="2.4" fill="#00e5a0"/>
      <circle cx="16" cy="15.7" r="4.5" stroke="#00e5a0" strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}

export default function Logo({ variant = "rail" }) {
  if (variant === "full") {
    return (
      <div className="flex items-center gap-2.5">
        <Mark size={30} />
        <div className="leading-none">
          <div className="font-display font-semibold text-[17px] text-ice tracking-tight">Uni3D</div>
          <div className="font-mono text-[10px] text-fog mt-0.5">UNICONTROLLER</div>
        </div>
      </div>
    );
  }
  return <Mark size={30} />;
}
