import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import ModelViewer from "../components/ModelViewer";
import SlicerPanel from "../components/SlicerPanel";
import Icon from "../components/Icon";

const fmtKB = (b) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);
const fmtTempo = (s) => { if (!s) return "Não informado"; const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60); return h ? `${h}h ${m}min` : `${m}min`; };

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [active, setActive] = useState(null);
  const [activeUrl, setActiveUrl] = useState(null);
  const [meshInfo, setMeshInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState("viewer");
  const [flash, setFlash] = useState(null);

  const load = async () => {
    const [p, f] = await Promise.all([api.get(`/projects/${id}`), api.get(`/projects/${id}/files/`)]);
    setProject(p.data);
    setFiles(f.data);
  };
  useEffect(() => { load(); }, [id]);

  const notify = (msg, kind = "notice") => { setFlash({ msg, kind }); setTimeout(() => setFlash(null), 3500); };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await api.post(`/projects/${id}/files/upload`, form);
      await load();
      notify("Arquivo enviado.");
    } catch (err) {
      notify(err.response?.data?.detail || "Falha no envio.", "alert");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const select = async (f) => {
    setActive(f);
    setMeshInfo(null);
    const { data } = await api.get(`/projects/${id}/files/${f.id}/download`);
    setActiveUrl(data.url);
  };

  const remove = async (f) => {
    if (!confirm(`Remover ${f.original_name}?`)) return;
    await api.delete(`/projects/${id}/files/${f.id}`);
    if (active?.id === f.id) { setActive(null); setActiveUrl(null); }
    await load();
    notify("Arquivo removido.");
  };

  const baixar = () => activeUrl && window.open(activeUrl, "_blank");

  const onGcode = useCallback((gcode) => {
    const blob = new Blob([gcode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(active?.original_name || "modelo").replace(/\.[^.]+$/, "")}.gcode`;
    a.click();
    URL.revokeObjectURL(url);
    notify("G-code gerado e baixado.");
  }, [active]);

  if (!project) return null;

  return (
    <>
      {flash && <div className={`flash flash--${flash.kind}`}>{flash.msg}</div>}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button className="btn btn--ghost btn--sm" onClick={() => navigate("/projetos")}><Icon name="voltar" size={14} /> Projetos</button>
        <h2 className="text-navy text-[18px] font-bold m-0">{project.name}</h2>
        <div className="ml-auto flex rounded-lg border border-line overflow-hidden bg-white">
          <button onClick={() => setTab("viewer")} className={`px-4 py-[7px] text-[13px] font-semibold flex items-center gap-1.5 ${tab === "viewer" ? "bg-azure text-white" : "text-navy hover:bg-slate-50"}`}><Icon name="olho" size={14} /> Visualizar</button>
          <button onClick={() => setTab("slicer")} className={`px-4 py-[7px] text-[13px] font-semibold flex items-center gap-1.5 ${tab === "slicer" ? "bg-azure text-white" : "text-navy hover:bg-slate-50"}`}><Icon name="camadas" size={14} /> Fatiar</button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* Coluna esquerda */}
        <div className="space-y-5">
          <div className="card">
            <div className="card__head">
              <span className="flex items-center gap-2"><Icon name="arquivo" size={15} className="text-azure" /> Arquivos</span>
              <span className="pill pill--neutro">{files.length}</span>
            </div>
            <div className="card__body">
              <label className={`btn btn--primary w-full justify-center cursor-pointer ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                <Icon name="upload" size={15} /> {uploading ? "Enviando…" : "Enviar arquivo"}
                <input type="file" className="hidden" accept=".stl,.obj,.3mf,.gcode" onChange={upload} />
              </label>
              <p className="text-[11px] text-muted mt-2 mb-3">STL, OBJ, 3MF ou G-code · até 200 MB</p>

              <div className="space-y-1 max-h-[340px] overflow-y-auto -mx-1 px-1">
                {files.length === 0 && <p className="text-muted text-[13px] m-0">Nenhum arquivo ainda.</p>}
                {files.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => select(f)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-colors ${active?.id === f.id ? "bg-azure-soft border-azure/40" : "border-transparent hover:bg-slate-50"}`}
                  >
                    <Icon name={f.format === "gcode" ? "camadas" : "cubo"} size={15} className={active?.id === f.id ? "text-azure" : "text-muted"} />
                    <span className="flex-1 truncate text-[13px] text-ink">{f.original_name}</span>
                    <span className="pill pill--neutro !text-[10px] uppercase">{f.format}</span>
                    <button className="text-muted hover:text-danger" onClick={(e) => { e.stopPropagation(); remove(f); }} title="Remover"><Icon name="x" size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {active && (
            <div className="card">
              <div className="card__body">
                <div className="upro-head">
                  <div className="upro-ic"><Icon name="info" /></div>
                  <span className="upro-tt">Ficha do modelo</span>
                </div>
                <div className="upro-campo"><span className="upro-lb">Arquivo</span><span className="upro-vl break-all">{active.original_name}</span></div>
                <div className="upro-campo"><span className="upro-lb">Formato</span><span className="upro-vl uppercase">{active.format}</span></div>
                <div className="upro-campo"><span className="upro-lb">Tamanho</span><span className="upro-vl">{fmtKB(active.file_size)}</span></div>
                <div className="upro-campo"><span className="upro-lb">Vértices</span><span className="upro-vl">{meshInfo?.vertices?.toLocaleString("pt-BR") || active.vertex_count?.toLocaleString("pt-BR") || "Não informado"}</span></div>
                <div className="upro-campo"><span className="upro-lb">Faces</span><span className="upro-vl">{meshInfo?.faces ? Math.round(meshInfo.faces).toLocaleString("pt-BR") : active.face_count?.toLocaleString("pt-BR") || "Não informado"}</span></div>
                <div className="upro-campo"><span className="upro-lb">Dimensões (mm)</span><span className="upro-vl">{meshInfo?.dims ? meshInfo.dims.map((d) => d.toFixed(1)).join(" × ") : "Não informado"}</span></div>
                <div className="upro-campo"><span className="upro-lb">Malha fechada</span>
                  <span className="upro-vl">
                    {active.is_manifold === "yes" ? <span className="pill pill--ok">Sim</span> : active.is_manifold === "no" ? <span className="pill pill--danger">Não</span> : <span className="pill pill--neutro">Não verificado</span>}
                  </span>
                </div>
                {active.print_time_seconds && <div className="upro-campo"><span className="upro-lb">Tempo estimado</span><span className="upro-vl">{fmtTempo(active.print_time_seconds)}</span></div>}
                {active.filament_grams && <div className="upro-campo"><span className="upro-lb">Filamento</span><span className="upro-vl">{active.filament_grams.toFixed(1)} g</span></div>}

                <div className="flex gap-2 mt-4">
                  <button className="btn btn--ghost btn--sm flex-1 justify-center" onClick={baixar}><Icon name="download" size={13} /> Baixar</button>
                  <button className="btn btn--primary btn--sm flex-1 justify-center" onClick={() => setTab("slicer")}><Icon name="camadas" size={13} /> Fatiar</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Coluna direita */}
        <div className="min-h-[560px]">
          {tab === "viewer"
            ? <ModelViewer fileUrl={activeUrl} format={active?.format} fileName={active?.original_name} onInfo={setMeshInfo} />
            : <SlicerPanel fileUrl={activeUrl} onGcodeReady={onGcode} />}
        </div>
      </div>
    </>
  );
}
