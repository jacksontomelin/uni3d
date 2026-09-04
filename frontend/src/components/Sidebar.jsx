import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";

const links = [
  { to: "/", label: "Painel", icon: "grid" },
  { to: "/projetos", label: "Projetos", icon: "cube" },
  { to: "/imagem-3d", label: "Imagem → 3D", icon: "ruler" },
  { to: "/fatiador", label: "Fatiador", icon: "layers" },
  { to: "/impressoras", label: "Impressoras", icon: "printer" },
  { to: "/perfis", label: "Perfis", icon: "sliders" },
];

export default function Sidebar() {
  return (
    <aside className="rail">
      <NavLink to="/" className="rail__logo"><Logo /></NavLink>
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => `rail__link ${isActive ? "active" : ""}`}>
          <Icon name={l.icon} size={20} />
          <span className="rail__tip">{l.label}</span>
        </NavLink>
      ))}
    </aside>
  );
}
