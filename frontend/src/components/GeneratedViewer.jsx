import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Center } from "@react-three/drei";
import * as THREE from "three";
import Icon from "./Icon";

function Mesh({ geometry, litofania }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current && geometry) {
      geometry.computeBoundingBox();
    }
  }, [geometry]);
  if (!geometry) return null;
  return (
    <Center top>
      <mesh ref={ref} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={litofania ? "#f8fafc" : "#0284c7"}
          roughness={litofania ? 0.9 : 0.5}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Center>
  );
}

function Mesa({ size = 120 }) {
  return (
    <>
      <Grid args={[size, size]} cellSize={10} cellThickness={0.6} cellColor="#2a3140" sectionSize={50} sectionThickness={1.1} sectionColor="#00b37e" fadeDistance={400} fadeStrength={1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#0d1117" roughness={1} />
      </mesh>
    </>
  );
}

export default function GeneratedViewer({ geometry, litofania = false, empty }) {
  return (
    <div className="viewer-wrap h-full min-h-[420px]">
      <Canvas shadows camera={{ position: [90, 80, 90], fov: 40, near: 0.1, far: 3000 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <color attach="background" args={["#0a0e14"]} />
        <ambientLight intensity={litofania ? 0.4 : 0.75} />
        <directionalLight position={[80, 160, 80]} intensity={1.1} castShadow shadow-mapSize={[2048, 2048]} />
        {litofania && <pointLight position={[0, -40, 0]} intensity={2.2} color="#fff8e1" />}
        <directionalLight position={[-80, 60, -80]} intensity={0.3} />
        <Mesa size={140} />
        <Suspense fallback={null}><Mesh geometry={geometry} litofania={litofania} /></Suspense>
        <OrbitControls makeDefault enableDamping dampingFactor={0.1} minDistance={20} maxDistance={600} target={[0, 15, 0]} />
      </Canvas>
      {empty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-mint !w-14 !h-14 mb-3"><Icon name="cubo" size={28} /></div>
          <p className="text-ice font-semibold m-0">Envie uma imagem para gerar o modelo</p>
          <p className="text-fog text-[13px] m-0">PNG, JPG ou WEBP · logo com fundo transparente funciona melhor</p>
        </div>
      )}
    </div>
  );
}
