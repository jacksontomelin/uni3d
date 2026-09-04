import { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Icon from "./Icon";
import { Mark } from "./Logo";
import { useAuthStore } from "../lib/store";

const meta = {
  "/": { tab: "painel.jsx" }, "/projetos": { tab: "projetos.json" }, "/imagem-3d": { tab: "imagem_3d.py" },
  "/fatiador": { tab: "fatiador.gcode" }, "/impressoras": { tab: "impressoras.cfg" }, "/perfis": { tab: "perfis.ini" },
};

export default function Layout() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [drawer, setDrawer] = useState(false);
  if (!token) return <Navigate to="/login" replace />;
  const m = meta[pathname] || { tab: pathname.startsWith("/projeto/") ? "projeto.stl" : "uni3d" };
  const go = (to) => { nav(to); setDrawer(false); };

  return (
    <div className="ide">
      {/* Activity bar (barra inferior no mobile) */}
      <div className="actbar">
        <div className="actbar__i active md:!text-white" title="Arquivos" onClick={() => setDrawer((d) => !d)}><Icon name="files" size={22} /></div>
        <div className="actbar__i" title="Painel" onClick={() => go("/")}><Icon name="fileicon" size={22} /></div>
        <div className="actbar__i" title="Projetos" onClick={() => go("/projetos")}><Icon name="cube" size={22} /></div>
        <div className="actbar__i" title="Imagem 3D" onClick={() => go("/imagem-3d")}><Icon name="ruler" size={22} /></div>
        <div className="flex-1" />
        <div className="actbar__i" title="Sair" onClick={logout}><Icon name="exit" size={22} /></div>
      </div>

      {/* Explorer (drawer no mobile) */}
      {drawer && <div className="explorer-backdrop" onClick={() => setDrawer(false)} />}
      <div className={drawer ? "explorer open" : "explorer"} onClick={(e) => { if (e.target.closest("a")) setDrawer(false); }}>
        <Sidebar />
      </div>

      <div className="editor">
        <div className="tabs">
          {/* botão de menu só no mobile */}
          <div className="tab md:hidden !px-3" onClick={() => setDrawer(true)}><Icon name="files" size={16} /></div>
          <div className="tab active border-t-2 border-vsblue relative">
            <Icon name="fileicon" size={13} className="text-vscyan" /> {m.tab}
          </div>
        </div>

        <div className="crumb hidden sm:flex">
          <Mark size={14} /> uni3d <Icon name="chevron" size={11} /> {m.tab}
        </div>

        <div className="work"><Outlet /></div>

        <div className="statusbar">
          <span className="statusbar__i"><span className="dot bg-vscyan" /> main</span>
          <span className="statusbar__i hide-sm"><Icon name="check" size={12} /> pronto</span>
          <div className="ml-auto flex items-center gap-4">
            <span className="statusbar__i hide-sm">{user?.email || "usuário"}</span>
            <span className="hide-sm">UTF-8</span>
            <span>Uni3D v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
