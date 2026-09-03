import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Icon from "../components/Icon";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    const { data } = await api.get("/projects/");
    setProjects(data);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post("/projects/", { name: name.trim() });
      navigate(`/projeto/${data.id}`);
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Remover este projeto e todos os arquivos?")) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="flex flex-wrap gap-3 items-end justify-between mb-4">
        <div className="form-row !mb-0 w-full sm:w-[320px]">
          <label>Buscar</label>
          <input placeholder="Nome do projeto" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-2 items-end">
          <div className="form-row !mb-0 w-[240px]">
            <label>Novo projeto</label>
            <input placeholder="Ex.: Suporte câmera" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} />
          </div>
          <button className="btn btn--primary" onClick={create} disabled={creating}>
            <Icon name="mais" size={15} /> Criar
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card__body !p-0">
          {filtered.length === 0 ? (
            <div className="p-10 text-center">
              <div className="upro-ic mx-auto mb-3 !w-12 !h-12"><Icon name="cubo" size={24} /></div>
              <p className="text-navy font-semibold m-0 mb-1">Nenhum projeto por aqui</p>
              <p className="text-muted m-0 text-[13px]">Crie um projeto acima e envie seus arquivos STL, OBJ ou 3MF.</p>
            </div>
          ) : (
            <table className="data">
              <thead>
                <tr><th>Projeto</th><th>Descrição</th><th>Criado</th><th>Atualizado</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="cursor-pointer" onClick={() => navigate(`/projeto/${p.id}`)}>
                    <td className="font-semibold text-navy">
                      <span className="inline-flex items-center gap-2"><Icon name="cubo" size={15} className="text-azure" />{p.name}</span>
                    </td>
                    <td className="text-muted">{p.description || "Não informado"}</td>
                    <td>{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
                    <td>{new Date(p.updated_at).toLocaleDateString("pt-BR")}</td>
                    <td className="text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button className="btn btn--ghost btn--sm mr-1" onClick={() => navigate(`/projeto/${p.id}`)}>Abrir</button>
                      <button className="btn btn--danger btn--sm" onClick={() => remove(p.id)}><Icon name="lixeira" size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
