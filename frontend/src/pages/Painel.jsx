import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import Icon from "../components/Icon";
import { useAuthStore } from "../lib/store";

export default function Painel() {
  const [projects, setProjects] = useState([]);
  const user = useAuthStore((s) => s.user);
  useEffect(() => { api.get("/projects/").then((r) => setProjects(r.data)).catch(() => {}); }, []);
  const nome = (user?.name || "").split(" ")[0];

  const metrics = [
    { k: "projetos", v: projects.length },
    { k: "modelos_3d", v: projects.reduce((s, p) => s + (p.file_count || 0), 0) },
    { k: "fatiados_mes", v: 0 },
    { k: "impressoras", v: 0 },
  ];

  return (
    <>
      <div className="mb-6">
        <p className="comment text-[13px]">{`// Uni3D — painel de controle`}</p>
        <h1 className="text-[22px] text-vstext mt-1">
          <span className="kw">const</span> <span className="text-vscyan">bemVindo</span> = <span className="str">"{nome || "Bancada"}"</span>
        </h1>
      </div>

      <div className="flex gap-2 mb-6">
        <Link to="/projetos" className="btn btn--go"><Icon name="plus" size={15} /> novo projeto</Link>
        <Link to="/imagem-3d" className="btn btn--line"><Icon name="ruler" size={15} /> imagem → 3D</Link>
      </div>

      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))" }}>
        {metrics.map((m) => (
          <div className="metric" key={m.k}>
            <div className="metric__k">{m.k}</div>
            <div className="metric__v">{m.v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="card">
          <div className="card__h"><span className="flex items-center gap-2"><Icon name="cube" size={14} className="text-vscyan" /> projetos_recentes.log</span><Link to="/projetos" className="btn btn--ghost !h-6 text-[12px]">ver todos</Link></div>
          <div className="card__b !p-0">
            {projects.length === 0 ? (
              <p className="comment p-4 m-0">{`// nenhum projeto ainda — crie o primeiro em projetos.json`}</p>
            ) : (
              <table className="grid">
                <thead><tr><th>projeto</th><th>atualizado</th><th></th></tr></thead>
                <tbody>
                  {projects.slice(0, 6).map((p) => (
                    <tr key={p.id}>
                      <td><span className="flex items-center gap-2"><Icon name="cube" size={14} className="text-vscyan" /><span className="text-vstext">{p.name}</span></span></td>
                      <td className="text-vsdim">{new Date(p.updated_at).toLocaleDateString("pt-BR")}</td>
                      <td className="text-right"><Link to={`/projeto/${p.id}`} className="text-vsblue2 hover:underline">abrir →</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card__h"><span className="flex items-center gap-2"><Icon name="check" size={14} className="text-vsgreen" /> fluxo.md</span></div>
          <div className="card__b space-y-1">
            {["enviar STL, OBJ ou 3MF", "conferir malha e dimensões", "escolher perfil e fatiar", "baixar G-code e imprimir"].map((t, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <span className="text-vsdim text-[12px] w-6 text-right">{i + 1}</span>
                <span className="text-vsblue2">›</span>
                <span className="text-[13px] text-vstext">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
