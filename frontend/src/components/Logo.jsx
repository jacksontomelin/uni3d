export function Mark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3l11 6.35v12.7L16 28.4 5 22.05V9.35L16 3z" stroke="#4ec9b0" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M16 15.7v12.7M16 15.7L5 9.35M16 15.7l11-6.35" stroke="#3e3e42" strokeWidth="1.2"/>
      <circle cx="16" cy="15.7" r="2.2" fill="#007acc"/>
    </svg>
  );
}
export default function Logo() { return <Mark />; }
