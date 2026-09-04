import { Suspense, useState, useMemo, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Grid, Center, Html } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader";
import * as THREE from "three";
import Icon from "./Icon";

function STLModel({ url, wireframe, onInfo }) {
  const geometry = useLoader(STLLoader, url);
  useEffect(() => {
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox;
    onInfo?.({
      vertices: geometry.attributes.position.count,
      faces: geometry.attributes.position.count / 3,
      dims: bb ? [bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z] : null,
    });
  }, [geometry]);
  return (
    <Center top>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#00e5a0" roughness={0.45} metalness={0.15} wireframe={wireframe} />
      </mesh>
    </Center>
  );
}

function OBJModel({ url, wireframe }) {
  const obj = useLoader(OBJLoader, url);
  useEffect(() => {
    obj.traverse((c) => {
      if (c.isMesh) c.material = new THREE.MeshStandardMaterial({ color: "#0284c7", roughness: 0.45, metalness: 0.15, wireframe });
    });
  }, [obj, wireframe]);
  return <Center top><primitive object={obj} rotation={[-Math.PI / 2, 0, 0]} /></Center>;
}

function ThreeMFModel({ url, wireframe }) {
  const obj = useLoader(ThreeMFLoader, url);
  useEffect(() => {
    obj.traverse((c) => {
      if (c.isMesh) c.material = new THREE.MeshStandardMaterial({ color: "#0284c7", roughness: 0.45, metalness: 0.15, wireframe });
    });
  }, [obj, wireframe]);
  return <Center top><primitive object={obj} rotation={[-Math.PI / 2, 0, 0]} /></Center>;
}

function Loading() {
  return <Html center><div className="text-mint text-[13px] font-semibold">Carregando modelo…</div></Html>;
}

function Mesa({ size = 220 }) {
  return (
    <>
      <Grid
        args={[size, size]}
        cellSize={10}
        cellThickness={0.6}
        cellColor="#2a3140"
        sectionSize={50}
        sectionThickness={1.1}
        sectionColor="#00b37e"
        fadeDistance={600}
        fadeStrength={1}
        position={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#0d1117" roughness={1} />
      </mesh>
    </>
  );
}

export default function ModelViewer({ fileUrl, format = "stl", fileName, onInfo }) {
  const [wireframe, setWireframe] = useState(false);
  const [mesa, setMesa] = useState(220);
  const [info, setInfo] = useState(null);

  const handleInfo = (i) => { setInfo(i); onInfo?.(i); };

  const Model = useMemo(() => {
    if (!fileUrl) return null;
    const f = (format || "").toLowerCase();
    if (f === "obj") return <OBJModel url={fileUrl} wireframe={wireframe} />;
    if (f === "3mf") return <ThreeMFModel url={fileUrl} wireframe={wireframe} />;
    return <STLModel url={fileUrl} wireframe={wireframe} onInfo={handleInfo} />;
  }, [fileUrl, format, wireframe]);

  return (
    <div className="viewer-wrap h-full min-h-[560px]">
      <div className="viewer-bar">
        <button className="btn btn--line btn--sm" onClick={() => setWireframe((w) => !w)}>
          <Icon name="malha" size={14} /> {wireframe ? "Sólido" : "Wireframe"}
        </button>
        <select className="btn btn--line btn--sm !pr-7" value={mesa} onChange={(e) => setMesa(Number(e.target.value))}>
          <option value={180}>Mesa 180×180</option>
          <option value={220}>Mesa 220×220</option>
          <option value={250}>Mesa 250×250</option>
          <option value={300}>Mesa 300×300</option>
        </select>
      </div>

      <Canvas
        shadows
        camera={{ position: [180, 160, 180], fov: 40, near: 0.1, far: 5000 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={["#0a0e14"]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[120, 220, 120]} intensity={1.1} castShadow shadow-mapSize={[2048, 2048]} />
        <directionalLight position={[-120, 100, -120]} intensity={0.35} />
        <Mesa size={mesa} />
        <Suspense fallback={<Loading />}>{Model}</Suspense>
        <OrbitControls makeDefault enableDamping dampingFactor={0.1} minDistance={20} maxDistance={1200} target={[0, 20, 0]} />
      </Canvas>

      {!fileUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-mint !w-14 !h-14 mb-3"><Icon name="cubo" size={28} /></div>
          <p className="text-ice font-semibold m-0">Nenhum modelo selecionado</p>
          <p className="text-fog text-[13px] m-0">Selecione um arquivo ao lado ou envie um STL, OBJ ou 3MF</p>
        </div>
      )}

      <div className="viewer-hud">
        <span>{fileName || "—"}{info ? ` · ${info.vertices.toLocaleString("pt-BR")} vértices` : ""}</span>
        <span>Arrastar: girar · Scroll: zoom · Botão direito: mover</span>
      </div>
    </div>
  );
}
