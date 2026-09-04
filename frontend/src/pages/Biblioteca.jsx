import { useState } from "react";
import Icon from "../components/Icon";

// Catálogos open-source/gratuitos — busca abre direto no site (sem API/chave)
const CATALOGOS = [
  { id: "printables", nome: "Printables", cor: "text-vsorange", desc: "Prusa · print-ready, alta qualidade, 3MF", url: (q) => `https://www.printables.com/search/models?q=${encodeURIComponent(q)}`, home: "https://www.printables.com" },
  { id: "thingiverse", nome: "Thingiverse", cor: "text-vscyan", desc: "Maior acervo · 4M+ modelos funcionais", url: (q) => `https://www.thingiverse.com/search?q=${encodeURIComponent(q)}&type=things`, home: "https://www.thingiverse.com" },
  { id: "makerworld", nome: "MakerWorld", cor: "text-vsyellow", desc: "Bambu · modelos práticos e recentes", url: (q) => `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(q)}`, home: "https://makerworld.com" },
  { id: "thangs", nome: "Thangs", cor: "text-vspurple", desc: "Busca geométrica em vários sites", url: (q) => `https://thangs.com/search/${encodeURIComponent(q)}`, home: "https://thangs.com" },
  { id: "myminifactory", nome: "MyMiniFactory", cor: "text-vsblue2", desc: "Miniaturas testadas e curadas", url: (q) => `https://www.myminifactory.com/search/?query=${encodeURIComponent(q)}`, home: "https://www.myminifactory.com" },
  { id: "grabcad", nome: "GrabCAD", cor: "text-vsgreen", desc: "Peças de engenharia e CAD", url: (q) => `https://grabcad.com/library?query=${encodeURIComponent(q)}`, home: "https://grabcad.com/library" },
];

// Coleções open-source no GitHub (STL direto no repo, licença aberta)
const GITHUB = [
  { nome: "Voron Design", desc: "Impressoras CoreXY open-source · STLs oficiais", url: "https://github.com/VoronDesign", tag: "impressora" },
  { nome: "Prusa Research", desc: "Peças e acessórios das Prusa (MK3/MK4/Mini)", url: "https://github.com/prusa3d/Original-Prusa-i3", tag: "peças" },
  { nome: "Gridfinity", desc: "Sistema modular de organização de bancada", url: "https://github.com/kennetek/gridfinity-rebuilt-openscad", tag: "organização" },
  { nome: "Honeycomb Storage Wall", desc: "Parede modular de organização (HSW)", url: "https://github.com/DaveCiv/HoneycombStorageWall", tag: "organização" },
  { nome: "Klipper Mounts", desc: "Suportes de câmera, sensores e mods", url: "https://github.com/topics/klipper?l=openscad", tag: "mods" },
  { nome: "OpenSCAD Parametric", desc: "Modelos paramétricos (gera STL customizado)", url: "https://github.com/topics/openscad-library", tag: "paramétrico" },
];

const SUGESTOES = ["suporte celular", "organizador gaveta", "vaso", "gancho parede", "caixa com tampa", "engrenagem", "chaveiro", "porta cabo"];

export default function Biblioteca() {
  const [q, setQ] = useState("");
  const buscar = (site) => { if (!q.trim()) return; window.open(site.url(q.trim()), "_blank", "noopener"); };
  const buscarTodos = () => { if (!q.trim()) return; CATALOGOS.slice(0, 3).forEach((s) => window.open(s.url(q.trim()), "_blank", "noopener")); };

  return (
    <>
      <p className="comment text-[13px] mb-4">{"// biblioteca — fontes open-source de STL prontos"}</p>

      {/* Busca global */}
      <div className="card mb-5">
        <div className="card__h"><span className="flex items-center gap-2"><Icon name="search" size={14} className="text-vscyan" /> buscar_stl()</span></div>
        <div className="card__b">
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-vsdim" />
              <input className="inp pl-9" placeholder="o que você quer imprimir? ex: suporte de fone" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && buscarTodos()} />
            </div>
            <button className="btn btn--go" onClick={buscarTodos}><Icon name="search" size={15} /> buscar</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="comment text-[12px]">{"// sugestões:"}</span>
            {SUGESTOES.map((s) => (
              <button key={s} className="chip chip--dim hover:text-vscyan" onClick={() => setQ(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Catálogos */}
      <p className="comment text-[13px] mb-3">{"// catálogos — clique para buscar no site"}</p>
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
        {CATALOGOS.map((c) => (
          <div className="card" key={c.id}>
            <div className="card__h">
              <span className={`flex items-center gap-2 ${c.cor}`}><Icon name="cube" size={14} /> {c.nome}</span>
              <a href={c.home} target="_blank" rel="noopener" className="text-vsdim hover:text-vstext"><Icon name="chevron" size={14} /></a>
            </div>
            <div className="card__b">
              <p className="text-vsdim text-[12px] mb-3">{c.desc}</p>
              <button className="btn btn--line w-full justify-center !h-8 text-[12px]" onClick={() => buscar(c)} disabled={!q.trim()}>
                {q.trim() ? `buscar "${q.trim().slice(0, 18)}"` : "digite acima"} →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* GitHub open-source */}
      <p className="comment text-[13px] mb-3">{"// github — coleções open-source (STL no repo, licença aberta)"}</p>
      <div className="card">
        <div className="card__b !p-0">
          <table className="grid">
            <thead><tr><th>coleção</th><th>descrição</th><th>categoria</th><th></th></tr></thead>
            <tbody>
              {GITHUB.map((g) => (
                <tr key={g.nome} className="cursor-pointer" onClick={() => window.open(g.url, "_blank", "noopener")}>
                  <td><span className="flex items-center gap-2 text-vstext"><Icon name="files" size={14} className="text-vsgreen" /> {g.nome}</span></td>
                  <td className="text-vsdim">{g.desc}</td>
                  <td><span className="chip chip--dim">{g.tag}</span></td>
                  <td className="text-right"><span className="text-vsblue2 text-[12px]">abrir ↗</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="comment text-[12px] mt-4">{"/* Sempre confira a licença do modelo antes de vender prints — CC BY e CC BY-SA permitem, CC BY-NC não. */"}</p>
    </>
  );
}
