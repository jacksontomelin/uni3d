import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./lib/store";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Painel from "./pages/Painel";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import { Slicer, Impressoras, Perfis } from "./pages/Extras";

export default function App() {
  const token = useAuthStore((s) => s.token);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => { if (token) fetchMe(); }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Painel />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/projeto/:id" element={<ProjectDetail />} />
          <Route path="/fatiador" element={<Slicer />} />
          <Route path="/impressoras" element={<Impressoras />} />
          <Route path="/perfis" element={<Perfis />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
