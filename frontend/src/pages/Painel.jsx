import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import Icon from "../components/Icon";
import { useAuthStore } from "../lib/store";

export default function Painel() {
  const [projects, setProjects] = useState([]);
  const user = useAuthStore((s) => s.user);
  useEffect(() => { api.get("/projects/").then((r) => setProjects(r.data)).catch(() => {}); }, []);
  const primeiro = (user?.name || "").split(" ")[0];

  return (
    <>
      <div className="hero-banner">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2>{primeiro ? `Olá, ${primeiro}.` : "Bem-vindo ao Uni3D."} Pronto pra imprimir?</h2>
            <p>Envie um STL, OBJ ou 3MF, confira a malha na mesa e gere o G-code sem sair do navegador.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/projetos" className="btn bg-white text-navy hover:bg-slate-100"><Icon name="mais" size={15} /> Novo projeto</Link>
            <Link to="/fatiador" className="btn border-white/40 text-white hover:bg-white/10"><Icon name="camadas" size={15} /> Fatiador</Link>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat"><div className="stat__icon stat__icon--azure"><Icon name="projetos" size={20} /></div><div><div className="stat__label">Projetos</div><div className="stat__value">{projects.length}</div></div></div>
        <div className="stat"><div className="stat__icon stat__icon--navy"><Icon name="cubo" size={20} /></div><div><div className="stat__label">Modelos 3D</div><div className="stat__value">{projects.reduce((s, p) => s + (p.file_count || 0), 0)}</div></div></div>
        <div className="stat"><div className="stat__icon stat__icon--ok"><Icon name="camadas" size={20} /></div><div><div className="stat__label">Fatiados no mês</div><div className="stat__value">0</div></div></div>
        <div className="stat"><div className="stat__icon stat__icon--warn"><Icon name="impressora" size={20} /></div><div><div className="stat__label">Impressoras</div><div className="stat__value">0</div></div></div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="card">
          <div className="card__head"><span className="flex items-center gap-2"><Icon name="relogio" size={15} className="text-azure" /> Últimos projetos</span><Link to="/projetos" className="btn btn--ghost btn--sm">Ver todos</Link></div>
          <div className="card__body !p-0">
            {projects.length === 0 ? <p className="text-muted p-[18px] m-0">Nenhum projeto ainda. Crie o primeiro em Projetos.</p> : (
              <table className="data"><thead><tr><th>Projeto</th><th>Atualizado</th><th></th></tr></thead><tbody>
                {projects.slice(0, 6).map((p) => (
                  <tr key={p.id}><td><span className="flex items-center gap-3"><span className="row-ic"><Icon name="cubo" size={15} /></span><span className="font-semibold text-navy">{p.name}</span></span></td>
                  <td className="text-muted">{new Date(p.updated_at).toLocaleDateString("pt-BR")}</td>
                  <td className="text-right"><Link to={`/projeto/${p.id}`} className="btn btn--ghost btn--sm">Abrir</Link></td></tr>
                ))}
              </tbody></table>
            )}
          </div>
        </div>
        <div className="space-y-5">
          <div className="card"><div className="card__body">
            <div className="upro-head"><div className="upro-ic"><Icon name="check" /></div><span className="upro-tt">Fluxo de impressão</span></div>
            {["Enviar o modelo (STL, OBJ, 3MF)", "Conferir a malha e as dimensões na mesa", "Escolher o perfil e fatiar", "Baixar o G-code e imprimir"].map((t, i) => (
              <div key={i} className="upro-campo flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span><span className="text-[13.5px]">{t}</span></div>
            ))}
          </div></div>
          <div className="card"><div className="card__body">
            <div className="upro-head"><div className="upro-ic"><Icon name="ajustes" /></div><span className="upro-tt">Atalhos</span></div>
            <div className="space-y-2">
              <Link to="/perfis" className="btn btn--ghost w-full justify-start"><Icon name="ajustes" size={15} /> Perfis de impressão</Link>
              <Link to="/impressoras" className="btn btn--ghost w-full justify-start"><Icon name="impressora" size={15} /> Impressoras</Link>
            </div>
          </div></div>
        </div>
      </div>
    </>
  );
}
