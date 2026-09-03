import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";
import { useAuthStore } from "../lib/store";

const links = [
  { to: "/", label: "Painel", icon: "painel" },
  { to: "/projetos", label: "Projetos", icon: "projetos" },
  { to: "/imagem-3d", label: "Imagem → 3D", icon: "regua" },
  { to: "/fatiador", label: "Fatiador", icon: "fatiador" },
  { to: "/impressoras", label: "Impressoras", icon: "impressora" },
  { to: "/perfis", label: "Perfis de impressão", icon: "ajustes" },
];

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Logo />
      </div>

      <nav className="sidebar__nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => `sidebar__link ${isActive ? "active" : ""}`}
          >
            <Icon name={l.icon} size={17} />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__foot">
        <div className="text-white font-medium truncate">{user?.name || "Usuário"}</div>
        <div className="text-slate-400 truncate">{user?.email || ""}</div>
        <button onClick={logout} className="mt-3 flex items-center gap-2 text-slate-300 hover:text-white text-[12px]">
          <Icon name="sair" size={14} /> Sair
        </button>
      </div>
    </aside>
  );
}
