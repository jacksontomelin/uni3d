import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Icon from "../components/Icon";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const nav = useNavigate();

  const load = async () => { const { data } = await api.get("/projects/"); setProjects(data); };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try { const { data } = await api.post("/projects/", { name: name.trim() }); nav(`/projeto/${data.id}`); }
    finally { setCreating(false); }
  };
  const remove = async (id) => { if (!confirm("Remover este projeto?")) return; await api.delete(`/projects/${id}`); load(); };
  const filtered = projects.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <p className="comment text-[13px] mb-4">{"// projetos — array de modelos 3D"}</p>

      <div className="flex flex-wrap gap-3 items-end mb-5">
        <div className="flex-1 min-w-[240px]">
          <label className="lab">buscar</label>
          <div className="relative">
            <Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-vsdim" />
            <input className="inp pl-9" placeholder="filtrar por nome" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="w-[240px]">
          <label className="lab">novo projeto</label>
          <input className="inp" placeholder="nome do projeto" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} />
        </div>
        <button className="btn btn--go" onClick={create} disabled={creating}><Icon name="plus" size={15} /> criar</button>
      </div>

      <div className="card">
        <div className="card__h"><span className="flex items-center gap-2"><Icon name="cube" size={14} className="text-vscyan" /> projetos.json</span><span className="chip chip--dim">{filtered.length} itens</span></div>
        <div className="card__b !p-0">
          {filtered.length === 0 ? (
            <p className="comment p-4 m-0">{"// nenhum projeto — crie o primeiro acima"}</p>
          ) : (
            <table className="grid">
              <thead><tr><th>projeto</th><th>descrição</th><th>criado</th><th>atualizado</th><th></th></tr></thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="cursor-pointer" onClick={() => nav(`/projeto/${p.id}`)}>
                    <td><span className="flex items-center gap-2"><Icon name="cube" size={14} className="text-vscyan" /><span className="text-vstext">{p.name}</span></span></td>
                    <td className="text-vsdim">{p.description || <span className="comment">// sem descrição</span>}</td>
                    <td className="text-vsdim">{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
                    <td className="text-vsdim">{new Date(p.updated_at).toLocaleDateString("pt-BR")}</td>
                    <td className="text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button className="btn btn--line !h-7 text-[12px] mr-1" onClick={() => nav(`/projeto/${p.id}`)}>abrir →</button>
                      <button className="btn btn--ghost !h-7 !px-2 text-red-400" onClick={() => remove(p.id)}><Icon name="trash" size={13} /></button>
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
