import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Icon from "./Icon";
import { useAuthStore } from "../lib/store";

const titles = { "/": "Painel", "/projetos": "Projetos", "/fatiador": "Fatiador", "/impressoras": "Impressoras", "/perfis": "Perfis de impressão" };

export function Footer() {
  return <div className="footer">UniController · Dev Jackson Tomelin © {new Date().getFullYear()} Todos os direitos reservados</div>;
}

const initials = (n) => (n || "U").split(" ").filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join("");

export default function Layout({ title }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();
  if (!token) return <Navigate to="/login" replace />;
  const pageTitle = title || titles[pathname] || (pathname.startsWith("/projeto/") ? "Projeto" : "Uni3D");

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <div className="flex items-center gap-5">
            <div className="topbar__title">{pageTitle}</div>
            <div className="topbar__search"><Icon name="busca" size={15} /><input placeholder="Buscar projeto, arquivo ou perfil" /></div>
          </div>
          <div className="topbar__user">
            <span className="pill pill--azul hidden xl:inline">Unindo tudo. Controlando tudo.</span>
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block leading-tight">
                <div className="text-ink font-semibold text-[13px]">{user?.name || "Usuário"}</div>
                <div className="text-muted text-[11.5px]">{user?.email}</div>
              </div>
              <div className="avatar">{initials(user?.name)}</div>
            </div>
          </div>
        </div>
        <div className="content"><Outlet /></div>
        <Footer />
      </div>
    </div>
  );
}
