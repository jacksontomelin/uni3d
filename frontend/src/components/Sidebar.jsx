import { NavLink } from "react-router-dom";
import Icon from "./Icon";

// File explorer — cada rota é um "arquivo" aberto no editor
const files = [
  { to: "/", label: "painel.jsx", icon: "fileicon", color: "text-vsyellow" },
  { to: "/projetos", label: "projetos.json", icon: "fileicon", color: "text-vsorange" },
  { to: "/imagem-3d", label: "imagem_3d.py", icon: "fileicon", color: "text-vsblue2" },
  { to: "/fatiador", label: "fatiador.gcode", icon: "fileicon", color: "text-vscyan" },
  { to: "/impressoras", label: "impressoras.cfg", icon: "fileicon", color: "text-vspurple" },
  { to: "/perfis", label: "perfis.ini", icon: "fileicon", color: "text-vsgreen" },
];

export default function Sidebar() {
  return (
    <aside className="explorer">
      <div className="explorer__h">Explorer: UNI3D</div>
      <div className="flex items-center gap-1 px-3 py-1 text-[12px] text-vstext">
        <Icon name="chevron" size={12} className="text-vsdim" /> src
      </div>
      {files.map((f) => (
        <NavLink key={f.to} to={f.to} end={f.to === "/"} className={({ isActive }) => `explorer__i pl-8 ${isActive ? "active" : ""}`}>
          <Icon name="fileicon" size={14} className={f.color} />
          <span>{f.label}</span>
        </NavLink>
      ))}
    </aside>
  );
}
