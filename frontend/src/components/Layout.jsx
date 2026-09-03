import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../lib/store";

const titles = {
  "/": "Painel",
  "/projetos": "Projetos",
  "/fatiador": "Fatiador",
  "/impressoras": "Impressoras",
  "/perfis": "Perfis de impressão",
};

export function Footer() {
  return (
    <div className="footer">
      UniController · Dev Jackson Tomelin © {new Date().getFullYear()} Todos os direitos reservados
    </div>
  );
}

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
          <div className="topbar__title">{pageTitle}</div>
          <div className="topbar__user">
            <span className="hidden sm:inline">{user?.email}</span>
            <span className="pill pill--azul">Unindo tudo. Controlando tudo.</span>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
