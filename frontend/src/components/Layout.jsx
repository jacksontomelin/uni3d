import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Icon from "./Icon";
import { useAuthStore } from "../lib/store";

const titles = { "/": "Painel", "/projetos": "Projetos", "/imagem-3d": "Imagem para 3D", "/fatiador": "Fatiador", "/impressoras": "Impressoras", "/perfis": "Perfis de impressão" };

export default function Layout() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { pathname } = useLocation();
  if (!token) return <Navigate to="/login" replace />;
  const title = titles[pathname] || (pathname.startsWith("/projeto/") ? "Projeto" : "Uni3D");
  const path = pathname === "/" ? "~/painel" : "~" + pathname;

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <div className="bar">
          <div className="bar__title">{title}</div>
          <div className="bar__path">{path}</div>
          <div className="ml-auto flex items-center gap-3">
            <span className="chip chip--mint"><span className="dot bg-mint" style={{boxShadow:"0 0 8px #00e5a0"}} />online</span>
            <div className="text-right leading-tight hidden sm:block">
              <div className="text-[13px] text-ice font-medium">{user?.name || "Usuário"}</div>
              <div className="font-mono text-[10px] text-fog">{user?.email}</div>
            </div>
            <button onClick={logout} className="btn btn--ghost btn--sm" title="Sair"><Icon name="exit" size={16} /></button>
          </div>
        </div>
        <div className="content"><Outlet /></div>
      </div>
    </div>
  );
}
