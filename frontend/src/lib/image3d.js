import * as THREE from "three";

/**
 * Gerador de malha 3D a partir de imagem — 100% no navegador, sem API.
 *
 * Modos:
 *  - litofania: brilho da imagem vira espessura (claro = fino, escuro = grosso),
 *    aparece contra a luz. Ideal pra fotos.
 *  - relevo: a imagem sobe em alto-relevo sobre uma base sólida. Ideal pra logo.
 *  - chaveiro: base arredondada com furo + logo em relevo por cima.
 */

// ── 1. Imagem → heightmap (0..1 por pixel) ──────────────────────────
export function imageToHeightmap(img, { maxRes = 256, invert = false, threshold = null, useAlpha = false }) {
  const scale = Math.min(1, maxRes / Math.max(img.width, img.height));
  const w = Math.max(2, Math.round(img.width * scale));
  const h = Math.max(2, Math.round(img.height * scale));

  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const height = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3] / 255;
    // luminância perceptual
    let v = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (useAlpha) {
      // pra logo PNG: onde tem tinta (alpha alto) sobe; fundo transparente fica base
      v = a > 0.35 ? 1 : 0;
    } else if (threshold != null) {
      v = v >= threshold ? 1 : 0;
    }
    if (invert) v = 1 - v;
    height[i] = v;
  }
  return { width: w, height: h, data: height };
}

// ── 2. Heightmap → geometria de relevo/litofania ────────────────────
// Gera uma "casca" superior seguindo a altura + paredes + fundo plano => sólido fechado.
function buildHeightGeometry(hm, { widthMM, baseMM, reliefMM, minMM = 0.6 }) {
  const { width: w, height: h, data } = hm;
  const aspect = h / w;
  const depthMM = widthMM * aspect;
  const dx = widthMM / (w - 1);
  const dy = depthMM / (h - 1);

  const positions = [];
  const indices = [];
  const idx = (x, y) => y * w + x;

  // topo: z = base + relevo*altura (litofania usa min..max de espessura)
  const topZ = (x, y) => baseMM + minMM + data[idx(x, y)] * reliefMM;

  // vértices do topo
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      positions.push(x * dx - widthMM / 2, (h - 1 - y) * dy - depthMM / 2, topZ(x, y));
    }
  }
  const topCount = w * h;
  // vértices do fundo (z = 0)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      positions.push(x * dx - widthMM / 2, (h - 1 - y) * dy - depthMM / 2, 0);
    }
  }
  const botOff = topCount;

  // faces do topo
  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const a = idx(x, y), b = idx(x + 1, y), c = idx(x + 1, y + 1), d = idx(x, y + 1);
      indices.push(a, c, b, a, d, c);
    }
  }
  // faces do fundo (invertidas)
  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const a = botOff + idx(x, y), b = botOff + idx(x + 1, y), c = botOff + idx(x + 1, y + 1), d = botOff + idx(x, y + 1);
      indices.push(a, b, c, a, c, d);
    }
  }
  // paredes laterais (costura topo↔fundo nas 4 bordas)
  const wall = (x0, y0, x1, y1) => {
    const t0 = idx(x0, y0), t1 = idx(x1, y1), b0 = botOff + t0, b1 = botOff + t1;
    indices.push(t0, t1, b1, t0, b1, b0);
  };
  for (let x = 0; x < w - 1; x++) { wall(x, 0, x + 1, 0); wall(x + 1, h - 1, x, h - 1); }
  for (let y = 0; y < h - 1; y++) { wall(0, y + 1, 0, y); wall(w - 1, y, w - 1, y + 1); }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// ── 3. Base de chaveiro (retângulo arredondado + furo) ──────────────
function buildKeychainBase({ widthMM, aspect, baseMM, holeR = 3, holePad = 5, radius = 4 }) {
  const depthMM = widthMM * aspect;
  const shape = new THREE.Shape();
  const wHalf = widthMM / 2, hHalf = depthMM / 2, r = Math.min(radius, wHalf, hHalf);
  shape.moveTo(-wHalf + r, -hHalf);
  shape.lineTo(wHalf - r, -hHalf);
  shape.quadraticCurveTo(wHalf, -hHalf, wHalf, -hHalf + r);
  shape.lineTo(wHalf, hHalf - r);
  shape.quadraticCurveTo(wHalf, hHalf, wHalf - r, hHalf);
  shape.lineTo(-wHalf + r, hHalf);
  shape.quadraticCurveTo(-wHalf, hHalf, -wHalf, hHalf - r);
  shape.lineTo(-wHalf, -hHalf + r);
  shape.quadraticCurveTo(-wHalf, -hHalf, -wHalf + r, -hHalf);

  // furo no canto superior esquerdo
  const hole = new THREE.Path();
  const cx = -wHalf + holePad, cy = hHalf - holePad;
  hole.absarc(cx, cy, holeR, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, { depth: baseMM, bevelEnabled: false, curveSegments: 24 });
  geo.computeVertexNormals();
  return geo;
}

// ── 4. API principal ────────────────────────────────────────────────
export function generateFromImage(img, opts) {
  const {
    mode = "relevo",           // litofania | relevo | chaveiro
    widthMM = 60,
    baseMM = 2,                // espessura da base sólida
    reliefMM = 1.2,            // altura do relevo (ou faixa da litofania)
    invert = false,
    maxRes = 220,
  } = opts;

  if (mode === "litofania") {
    // litofania: sem base sólida, só a casca de espessura variável.
    // Escuro = mais grosso (bloqueia luz), claro = fino. invert=true padrão visual.
    const hm = imageToHeightmap(img, { maxRes, invert: !invert });
    const geo = buildHeightGeometry(hm, { widthMM, baseMM: 0, reliefMM: Math.max(reliefMM, 2.4), minMM: 0.6 });
    return { geometry: geo, aspect: hm.height / hm.width };
  }

  if (mode === "relevo") {
    // logo/foto em alto-relevo sobre base. Pra logo use PNG com alpha.
    const useAlpha = opts.useAlpha ?? false;
    const threshold = opts.threshold ?? null;
    const hm = imageToHeightmap(img, { maxRes, invert, useAlpha, threshold });
    const geo = buildHeightGeometry(hm, { widthMM, baseMM, reliefMM, minMM: 0 });
    return { geometry: geo, aspect: hm.height / hm.width };
  }

  // chaveiro: base arredondada com furo + relevo do logo por cima
  const useAlpha = opts.useAlpha ?? true;
  const threshold = opts.threshold ?? null;
  const hm = imageToHeightmap(img, { maxRes, invert, useAlpha, threshold });
  const aspect = hm.height / hm.width;

  const base = buildKeychainBase({ widthMM, aspect, baseMM, holeR: opts.holeR ?? 3, holePad: opts.holePad ?? 6, radius: opts.radius ?? 5 });
  // relevo só onde há tinta, empilhado sobre a base
  const relief = buildHeightGeometry(hm, { widthMM: widthMM * 0.82, baseMM, reliefMM, minMM: 0 });

  // junta base + relevo num único BufferGeometry (merge simples)
  const merged = mergeGeometries([base, relief]);
  return { geometry: merged, aspect };
}

// merge manual (sem dependência externa)
function mergeGeometries(geos) {
  let posLen = 0;
  const nonIndexed = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  nonIndexed.forEach((g) => { posLen += g.attributes.position.count * 3; });
  const positions = new Float32Array(posLen);
  let off = 0;
  nonIndexed.forEach((g) => {
    const p = g.attributes.position.array;
    positions.set(p, off); off += p.length;
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  out.computeVertexNormals();
  return out;
}

// ── 5. Exporta STL binário do que foi gerado ────────────────────────
export function geometryToSTL(geometry) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  const pos = g.attributes.position.array;
  const triCount = pos.length / 9;
  const buffer = new ArrayBuffer(84 + triCount * 50);
  const view = new DataView(buffer);
  view.setUint32(80, triCount, true);
  let o = 84;
  const nA = new THREE.Vector3(), nB = new THREE.Vector3(), nC = new THREE.Vector3(), cb = new THREE.Vector3(), ab = new THREE.Vector3();
  for (let i = 0; i < triCount; i++) {
    const a = i * 9;
    nA.set(pos[a], pos[a + 1], pos[a + 2]);
    nB.set(pos[a + 3], pos[a + 4], pos[a + 5]);
    nC.set(pos[a + 6], pos[a + 7], pos[a + 8]);
    cb.subVectors(nC, nB); ab.subVectors(nA, nB); cb.cross(ab).normalize();
    view.setFloat32(o, cb.x, true); view.setFloat32(o + 4, cb.y, true); view.setFloat32(o + 8, cb.z, true); o += 12;
    for (const v of [nA, nB, nC]) { view.setFloat32(o, v.x, true); view.setFloat32(o + 4, v.y, true); view.setFloat32(o + 8, v.z, true); o += 12; }
    view.setUint16(o, 0, true); o += 2;
  }
  return new Blob([buffer], { type: "application/octet-stream" });
}
