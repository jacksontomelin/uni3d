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
    { k: "Projetos", v: projects.length, u: "", ic: "cube" },
    { k: "Modelos 3D", v: projects.reduce((s, p) => s + (p.file_count || 0), 0), u: "", ic: "layers" },
    { k: "Fatiados", v: 0, u: "/mês", ic: "sliders" },
    { k: "Impressoras", v: 0, u: "", ic: "printer" },
  ];

  return (
    <>
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-[26px] font-semibold tracking-tight">{nome ? `Olá, ${nome}` : "Bancada"}</h1>
          <p className="text-fog text-[14px] mt-1">Envie um modelo, confira a malha e gere o G-code.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/projetos" className="btn btn--go"><Icon name="plus" size={16} /> Novo projeto</Link>
          <Link to="/imagem-3d" className="btn btn--line"><Icon name="ruler" size={16} /> Imagem → 3D</Link>
        </div>
      </div>

      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
        {metrics.map((m) => (
          <div className="metric" key={m.k}>
            <Icon name={m.ic} size={18} className="metric__spark" />
            <div className="metric__k">{m.k}</div>
            <div className="metric__v">{m.v}<span className="metric__u">{m.u}</span></div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="panel">
          <div className="panel__head">
            <span className="panel__title"><Icon name="clock" size={15} className="text-mint" /> Projetos recentes</span>
            <Link to="/projetos" className="btn btn--ghost btn--sm">Ver todos</Link>
          </div>
          <div className="panel__body !p-0">
            {projects.length === 0 ? (
              <p className="text-fog p-5 m-0 font-mono text-[12px]">Nenhum projeto ainda. Crie o primeiro em Projetos.</p>
            ) : (
              <table className="grid">
                <thead><tr><th>Projeto</th><th>Atualizado</th><th></th></tr></thead>
                <tbody>
                  {projects.slice(0, 6).map((p) => (
                    <tr key={p.id}>
                      <td><span className="flex items-center gap-2.5"><Icon name="cube" size={15} className="text-mint" /><span className="text-ice">{p.name}</span></span></td>
                      <td className="font-mono text-fog text-[12px]">{new Date(p.updated_at).toLocaleDateString("pt-BR")}</td>
                      <td className="text-right"><Link to={`/projeto/${p.id}`} className="btn btn--ghost btn--sm">Abrir →</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel__head"><span className="panel__title"><Icon name="check" size={15} className="text-mint" /> Fluxo</span></div>
          <div className="panel__body space-y-1">
            {["Enviar STL, OBJ ou 3MF", "Conferir malha e dimensões", "Escolher perfil e fatiar", "Baixar G-code e imprimir"].map((t, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <span className="w-7 h-7 rounded-lg bg-graphite-600 border border-edge font-mono text-[12px] text-mint flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-[13px] text-ice">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
