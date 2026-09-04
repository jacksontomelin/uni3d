import SlicerPanel from "../components/SlicerPanel";
import Icon from "../components/Icon";

export function Slicer() {
  return (
    <div className="panel">
      <div className="panel__head">
        <span className="flex items-center gap-2"><Icon name="camadas" size={15} className="text-mint" /> Fatiador Kiri:Moto</span>
        <span className="chip chip--mint">Roda 100% no navegador</span>
      </div>
      <div className="panel__body !p-0 h-[calc(100vh-230px)] min-h-[600px]">
        <SlicerPanel />
      </div>
    </div>
  );
}

const impressoras = [
  { nome: "Ender 3 V3 SE", mesa: "220 × 220 × 250", bico: "0.4 mm", status: "ok" },
  { nome: "Bambu Lab A1 mini", mesa: "180 × 180 × 180", bico: "0.4 mm", status: "ok" },
];

export function Impressoras() {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-fog m-0 text-[13px]">Cadastre suas impressoras para usar as dimensões da mesa no visualizador e no fatiador.</p>
        <button className="btn btn--go"><Icon name="mais" size={15} /> Nova impressora</button>
      </div>
      <div className="panel"><div className="panel__body !p-0">
        <table className="grid">
          <thead><tr><th>Impressora</th><th>Volume (mm)</th><th>Bico</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {impressoras.map((p) => (
              <tr key={p.nome}>
                <td className="font-semibold text-ice"><span className="inline-flex items-center gap-2"><Icon name="impressora" size={15} className="text-mint" />{p.nome}</span></td>
                <td>{p.mesa}</td>
                <td>{p.bico}</td>
                <td><span className="pill pill--ok">Pronta</span></td>
                <td className="text-right"><button className="btn btn--line btn--sm">Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </>
  );
}

const perfis = [
  { nome: "PLA padrão 0.2", camada: "0.20 mm", infill: "15%", temp: "210 / 60 °C", vel: "60 mm/s" },
  { nome: "PLA rápido 0.28", camada: "0.28 mm", infill: "10%", temp: "215 / 60 °C", vel: "100 mm/s" },
  { nome: "PETG 0.2", camada: "0.20 mm", infill: "20%", temp: "240 / 80 °C", vel: "45 mm/s" },
];

export function Perfis() {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-fog m-0 text-[13px]">Perfis de fatiamento reutilizáveis. Travados por cliente no plano multi-loja.</p>
        <button className="btn btn--go"><Icon name="mais" size={15} /> Novo perfil</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {perfis.map((p) => (
          <div className="panel" key={p.nome}>
            <div className="panel__body">
              <div className="panel__title">
                <div className="text-mint"><Icon name="ajustes" /></div>
                <span className="panel__title">{p.nome}</span>
              </div>
              <div className="field"><span className="field__k">Altura de camada</span><span className="field__v">{p.camada}</span></div>
              <div className="field"><span className="field__k">Preenchimento</span><span className="field__v">{p.infill}</span></div>
              <div className="field"><span className="field__k">Temperatura bico / mesa</span><span className="field__v">{p.temp}</span></div>
              <div className="field"><span className="field__k">Velocidade</span><span className="field__v">{p.vel}</span></div>
              <div className="flex gap-2 mt-4">
                <button className="btn btn--line btn--sm flex-1 justify-center">Editar</button>
                <button className="btn btn--go btn--sm flex-1 justify-center">Usar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
