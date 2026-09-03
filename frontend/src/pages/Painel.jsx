import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import Icon from "../components/Icon";

export default function Painel() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects/").then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  const totalArquivos = projects.reduce((s, p) => s + (p.file_count || 0), 0);

  return (
    <>
      <div className="stat-grid">
        <div className="stat"><div className="stat__label">Projetos</div><div className="stat__value">{projects.length}</div></div>
        <div className="stat"><div className="stat__label">Modelos 3D</div><div className="stat__value">{totalArquivos}</div></div>
        <div className="stat"><div className="stat__label">Fatiados no mês</div><div className="stat__value">0</div></div>
        <div className="stat"><div className="stat__label">Impressoras</div><div className="stat__value">0</div></div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="card">
          <div className="card__head">
            <span>Últimos projetos</span>
            <Link to="/projetos" className="btn btn--ghost btn--sm">Ver todos</Link>
          </div>
          <div className="card__body !p-0">
            {projects.length === 0 ? (
              <p className="text-muted p-[18px] m-0">Nenhum projeto ainda. Crie o primeiro em Projetos.</p>
            ) : (
              <table className="data">
                <thead><tr><th>Projeto</th><th>Atualizado</th><th></th></tr></thead>
                <tbody>
                  {projects.slice(0, 6).map((p) => (
                    <tr key={p.id}>
                      <td className="font-medium text-navy">{p.name}</td>
                      <td className="text-muted">{new Date(p.updated_at).toLocaleDateString("pt-BR")}</td>
                      <td className="text-right"><Link to={`/projeto/${p.id}`} className="text-azure font-semibold">Abrir</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card__head">Atalhos</div>
          <div className="card__body space-y-2">
            <Link to="/projetos" className="btn btn--primary w-full justify-center"><Icon name="mais" size={15} /> Novo projeto</Link>
            <Link to="/fatiador" className="btn btn--ghost w-full justify-center"><Icon name="fatiador" size={15} /> Abrir fatiador</Link>
            <Link to="/perfis" className="btn btn--ghost w-full justify-center"><Icon name="ajustes" size={15} /> Perfis de impressão</Link>
          </div>
        </div>
      </div>
    </>
  );
}
