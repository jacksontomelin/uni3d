import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Icon from "./Icon";
import { Mark } from "./Logo";
import { useAuthStore } from "../lib/store";

const meta = {
  "/": { tab: "painel.jsx", crumb: "src › painel.jsx" },
  "/projetos": { tab: "projetos.json", crumb: "src › projetos.json" },
  "/imagem-3d": { tab: "imagem_3d.py", crumb: "src › imagem_3d.py" },
  "/fatiador": { tab: "fatiador.gcode", crumb: "src › fatiador.gcode" },
  "/impressoras": { tab: "impressoras.cfg", crumb: "src › impressoras.cfg" },
  "/perfis": { tab: "perfis.ini", crumb: "src › perfis.ini" },
};

export default function Layout() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { pathname } = useLocation();
  const nav = useNavigate();
  if (!token) return <Navigate to="/login" replace />;
  const m = meta[pathname] || { tab: pathname.startsWith("/projeto/") ? "projeto.stl" : "uni3d", crumb: "src › " + pathname.slice(1) };

  return (
    <div className="ide">
      {/* Activity bar */}
      <div className="actbar">
        <div className="actbar__i active" title="Explorer"><Icon name="files" size={22} /></div>
        <div className="actbar__i" title="Buscar" onClick={() => nav("/projetos")}><Icon name="search" size={22} /></div>
        <div className="flex-1" />
        <div className="actbar__i" title="Sair" onClick={logout}><Icon name="exit" size={22} /></div>
      </div>

      <Sidebar />

      <div className="editor">
        {/* Abas */}
        <div className="tabs">
          <div className="tab active border-t-2 border-vsblue relative">
            <Icon name="fileicon" size={13} className="text-vscyan" /> {m.tab}
            <Icon name="x" size={13} className="ml-1 text-vsdim hover:text-vstext" />
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="crumb">
          <Mark size={14} /> uni3d <Icon name="chevron" size={11} /> {m.crumb.split(" › ").slice(1).join(" › ")}
        </div>

        {/* Conteúdo */}
        <div className="work"><Outlet /></div>

        {/* Status bar */}
        <div className="statusbar">
          <span className="statusbar__i"><span className="dot bg-vscyan" /> main</span>
          <span className="statusbar__i"><Icon name="check" size={12} /> pronto</span>
          <div className="ml-auto flex items-center gap-4">
            <span className="statusbar__i">{user?.email || "usuário"}</span>
            <span>UTF-8</span>
            <span>Uni3D v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
