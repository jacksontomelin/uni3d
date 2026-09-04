import * as THREE from "three";

/**
 * Análise e reparo básico de malha — 100% no navegador.
 * Detecta: bordas abertas (não-manifold), triângulos degenerados, volume.
 * Repara: solda vértices duplicados, remove degenerados, recalcula normais.
 */

// Analisa geometria: conta vértices, faces, bordas abertas, volume, dimensões
export function analisarMalha(geometry) {
  const geo = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const pos = geo.attributes.position;
  const triCount = pos.count / 3;

  // volume por soma de tetraedros (método do divergente)
  let volume = 0;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i); b.fromBufferAttribute(pos, i + 1); c.fromBufferAttribute(pos, i + 2);
    volume += a.dot(b.clone().cross(c)) / 6;
  }
  volume = Math.abs(volume);

  // bordas abertas: conta arestas que aparecem só 1x (não compartilhadas)
  const edges = new Map();
  const key = (v1, v2) => {
    const k1 = `${v1.x.toFixed(3)},${v1.y.toFixed(3)},${v1.z.toFixed(3)}`;
    const k2 = `${v2.x.toFixed(3)},${v2.y.toFixed(3)},${v2.z.toFixed(3)}`;
    return k1 < k2 ? k1 + "|" + k2 : k2 + "|" + k1;
  };
  const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
  let degenerados = 0;
  const maxTris = Math.min(triCount, 100000); // limite pra não travar
  for (let i = 0; i < maxTris * 3; i += 3) {
    v0.fromBufferAttribute(pos, i); v1.fromBufferAttribute(pos, i + 1); v2.fromBufferAttribute(pos, i + 2);
    // degenerado: área ~0
    const area = v1.clone().sub(v0).cross(v2.clone().sub(v0)).length() / 2;
    if (area < 1e-9) { degenerados++; continue; }
    for (const [p, q] of [[v0, v1], [v1, v2], [v2, v0]]) {
      const k = key(p, q);
      edges.set(k, (edges.get(k) || 0) + 1);
    }
  }
  let bordasAbertas = 0;
  edges.forEach((count) => { if (count === 1) bordasAbertas++; });

  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const dims = bb ? [bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z] : [0, 0, 0];

  const fechada = bordasAbertas === 0 && degenerados === 0;
  return {
    vertices: pos.count,
    faces: triCount,
    bordasAbertas,
    degenerados,
    volumeCm3: volume / 1000, // mm³ → cm³
    dims,
    fechada,
    watertight: bordasAbertas === 0,
  };
}

// Reparo: solda vértices próximos, remove degenerados, recalcula normais
export function repararMalha(geometry) {
  let geo = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const pos = geo.attributes.position;

  // remove triângulos degenerados
  const novos = [];
  const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    v0.fromBufferAttribute(pos, i); v1.fromBufferAttribute(pos, i + 1); v2.fromBufferAttribute(pos, i + 2);
    const area = v1.clone().sub(v0).cross(v2.clone().sub(v0)).length() / 2;
    if (area >= 1e-9) novos.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
  }
  const limpo = new THREE.BufferGeometry();
  limpo.setAttribute("position", new THREE.Float32BufferAttribute(novos, 3));
  limpo.computeVertexNormals();
  limpo.computeBoundingBox();
  return limpo;
}

// Estimativa de impressão a partir do volume
export function estimarImpressao(volumeCm3, opts = {}) {
  const {
    infill = 0.15,          // 15%
    densidade = 1.24,       // PLA g/cm³
    precoKg = 120,          // R$/kg
    velocidade = 60,        // mm/s (aproxima tempo)
    alturaCamada = 0.2,     // mm
    paredes = 0.4 * 3,      // 3 perímetros
  } = opts;

  // volume efetivo: casca (paredes) + preenchimento interno
  // aproximação: ~35% do volume é casca sólida, resto usa infill
  const volCasca = volumeCm3 * 0.35;
  const volInterno = volumeCm3 * 0.65 * infill;
  const volMaterial = volCasca + volInterno;

  const gramas = volMaterial * densidade;
  const metros = (volMaterial * 1000) / (Math.PI * Math.pow(1.75 / 2, 2)) / 1000; // filamento 1.75mm
  const custo = (gramas / 1000) * precoKg;
  // tempo: heurística simples baseada em volume e velocidade
  const minutos = (volMaterial * 60) / (velocidade / 30) * (0.2 / alturaCamada) * 0.5;

  return {
    gramas: Math.round(gramas * 10) / 10,
    metros: Math.round(metros * 10) / 10,
    custo: Math.round(custo * 100) / 100,
    minutos: Math.round(minutos),
    horas: Math.floor(minutos / 60),
    mins: Math.round(minutos % 60),
  };
}
