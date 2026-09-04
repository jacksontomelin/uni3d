import { useState, useRef, useCallback, useEffect } from "react";
import { generateFromImage, geometryToSTL } from "../lib/image3d";
import GeneratedViewer from "../components/GeneratedViewer";
import Icon from "../components/Icon";
import api from "../lib/api";

const MODOS = [
  { id: "relevo", nome: "Relevo", desc: "Logo em alto-relevo sobre uma base sólida.", icon: "camadas" },
  { id: "chaveiro", nome: "Chaveiro", desc: "Base arredondada com furo + logo em relevo.", icon: "cubo" },
  { id: "litofania", nome: "Litofania", desc: "Foto que aparece contra a luz.", icon: "olho" },
];

export default function ImageTo3D() {
  const [img, setImg] = useState(null);
  const [imgName, setImgName] = useState("");
  const [mode, setMode] = useState("relevo");
  const [geometry, setGeometry] = useState(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");

  // parâmetros
  const [widthMM, setWidthMM] = useState(60);
  const [baseMM, setBaseMM] = useState(2);
  const [reliefMM, setReliefMM] = useState(1.5);
  const [invert, setInvert] = useState(false);
  const [useAlpha, setUseAlpha] = useState(true);

  const fileRef = useRef(null);

  useEffect(() => { api.get("/projects/").then((r) => setProjects(r.data)).catch(() => {}); }, []);

  const notify = (msg, kind = "notice") => { setFlash({ msg, kind }); setTimeout(() => setFlash(null), 3500); };

  const loadImage = (file) => {
    if (!file) return;
    setImgName(file.name);
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { setImg(image); URL.revokeObjectURL(url); };
    image.src = url;
  };

  const gerar = useCallback(() => {
    if (!img) return;
    setBusy(true);
    setTimeout(() => {
      try {
        const { geometry: geo } = generateFromImage(img, { mode, widthMM, baseMM, reliefMM, invert, useAlpha });
        setGeometry(geo);
      } catch (e) {
        notify("Não foi possível gerar. Tente outra imagem.", "alert");
      } finally {
        setBusy(false);
      }
    }, 30);
  }, [img, mode, widthMM, baseMM, reliefMM, invert, useAlpha]);

  // regenera automático ao mudar parâmetros (com imagem carregada)
  useEffect(() => { if (img) gerar(); /* eslint-disable-next-line */ }, [mode, widthMM, baseMM, reliefMM, invert, useAlpha, img]);

  const baixarSTL = () => {
    if (!geometry) return;
    const blob = geometryToSTL(geometry);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(imgName || "modelo").replace(/\.[^.]+$/, "")}_${mode}.stl`;
    a.click();
    URL.revokeObjectURL(url);
    notify("STL gerado e baixado.");
  };

  const salvarNoProjeto = async () => {
    if (!geometry || !projectId) { notify("Escolha um projeto primeiro.", "alert"); return; }
    setBusy(true);
    try {
      const blob = geometryToSTL(geometry);
      const form = new FormData();
      const fname = `${(imgName || "modelo").replace(/\.[^.]+$/, "")}_${mode}.stl`;
      form.append("file", new File([blob], fname, { type: "application/octet-stream" }));
      await api.post(`/projects/${projectId}/files/upload`, form);
      notify("Modelo salvo no projeto.");
    } catch {
      notify("Falha ao salvar no projeto.", "alert");
    } finally {
      setBusy(false);
    }
  };

  const litofania = mode === "litofania";

  return (
    <>
      {flash && <div className={`flash flash--${flash.kind}`}>{flash.msg}</div>}

      <p className="text-fog m-0 mb-4 text-[13.5px]">Transforme um logotipo ou uma foto em modelo 3D pronto pra imprimir — tudo processado aqui no navegador.</p>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        {/* Controles */}
        <div className="space-y-5">
          <div className="panel"><div className="panel__body">
            <div className="panel__title"><div className="text-mint"><Icon name="upload" /></div><span className="panel__title">Imagem de origem</span></div>

            <label
              className="block border-2 border-dashed border-line rounded-xl p-6 text-center cursor-pointer hover:border-azure hover:bg-azure-soft/40 transition-colors"
              onDrop={(e) => { e.preventDefault(); loadImage(e.dataTransfer.files?.[0]); }}
              onDragOver={(e) => e.preventDefault()}
            >
              {img ? (
                <img src={img.src} alt="Prévia" className="max-h-28 mx-auto rounded-lg" />
              ) : (
                <div className="text-fog">
                  <div className="text-mint !w-12 !h-12 mx-auto mb-2"><Icon name="upload" size={22} /></div>
                  <p className="m-0 text-[13px] font-medium text-ice">Arraste a imagem aqui</p>
                  <p className="m-0 text-[11.5px]">PNG, JPG ou WEBP</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => loadImage(e.target.files?.[0])} />
            </label>
            {imgName && <p className="text-[12px] text-fog mt-2 mb-0 truncate">{imgName}</p>}
          </div></div>

          <div className="panel"><div className="panel__body">
            <div className="panel__title"><div className="text-mint"><Icon name="camadas" /></div><span className="panel__title">Modo de geração</span></div>
            <div className="space-y-2">
              {MODOS.map((m) => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${mode === m.id ? "border-azure bg-azure-soft" : "border-line hover:bg-slate-50"}`}>
                  <span className={`text-mint shrink-0 ${mode === m.id ? "" : "!bg-slate-100 !text-ice"}`}><Icon name={m.icon} /></span>
                  <span>
                    <span className="block text-[13.5px] font-semibold text-ice">{m.nome}</span>
                    <span className="block text-[12px] text-fog">{m.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div></div>

          <div className="panel"><div className="panel__body">
            <div className="panel__title"><div className="text-mint"><Icon name="ajustes" /></div><span className="panel__title">Parâmetros</span></div>

            <div className=" !mb-3">
              <label className="lab">Largura: {widthMM} mm</label>
              <input type="range" min="20" max="150" value={widthMM} onChange={(e) => setWidthMM(+e.target.value)} className="w-full" />
            </div>
            <div className=" !mb-3">
              <label className="lab">Base: {baseMM.toFixed(1)} mm</label>
              <input type="range" min="0.8" max="5" step="0.2" value={baseMM} onChange={(e) => setBaseMM(+e.target.value)} className="w-full" />
            </div>
            <div className=" !mb-3">
              <label className="lab">{litofania ? "Espessura máx." : "Altura do relevo"}: {reliefMM.toFixed(1)} mm</label>
              <input type="range" min="0.4" max="6" step="0.1" value={reliefMM} onChange={(e) => setReliefMM(+e.target.value)} className="w-full" />
            </div>

            <label className="flex items-center gap-2 text-[13px] text-ink mb-2 cursor-pointer">
              <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} className="!w-auto" /> Inverter altura
            </label>
            {!litofania && (
              <label className="flex items-center gap-2 text-[13px] text-ink cursor-pointer">
                <input type="checkbox" checked={useAlpha} onChange={(e) => setUseAlpha(e.target.checked)} className="!w-auto" /> Usar transparência (logo PNG)
              </label>
            )}
          </div></div>
        </div>

        {/* Prévia + ações */}
        <div className="space-y-4">
          <div className="relative">
            <GeneratedViewer geometry={geometry} litofania={litofania} empty={!img} />
            {busy && <div className="absolute top-3 right-3 chip chip--mint">Gerando…</div>}
          </div>

          <div className="panel"><div className="panel__body flex flex-wrap items-end gap-3">
            <div className=" !mb-0 flex-1 min-w-[200px]">
              <label className="lab">Salvar no projeto</label>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="">Selecione um projeto…</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <button className="btn btn--line" onClick={salvarNoProjeto} disabled={!geometry || busy}><Icon name="arquivo" size={15} /> Salvar no projeto</button>
            <button className="btn btn--go" onClick={baixarSTL} disabled={!geometry}><Icon name="download" size={15} /> Baixar STL</button>
          </div></div>

          <div className="panel"><div className="panel__body">
            <div className="panel__title"><div className="text-mint"><Icon name="info" /></div><span className="panel__title">Dicas</span></div>
            <div className="field"><span className="field__k">Logo</span><span className="field__v text-[13px] !font-normal">Use PNG com fundo transparente e marque "Usar transparência". Modo Relevo ou Chaveiro.</span></div>
            <div className="field"><span className="field__k">Foto</span><span className="field__v text-[13px] !font-normal">Use o modo Litofania. Imagens com bom contraste ficam melhores. Espessura máx. 3–4 mm.</span></div>
            <div className="field"><span className="field__k">Impressão</span><span className="field__v text-[13px] !font-normal">Litofania imprime deitada, sem preenchimento e camada fina (0.1 mm). Chaveiro imprime em pé na base.</span></div>
          </div></div>
        </div>
      </div>
    </>
  );
}
