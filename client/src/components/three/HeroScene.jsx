import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, ContactShadows, Text, OrbitControls } from '@react-three/drei';
import { Compass, Sparkles } from 'lucide-react';

// 3D Model: Floating Smartphone
function PhoneItem({ position, rotation }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    meshRef.current.rotation.x = rotation[0] + Math.cos(state.clock.elapsedTime * 0.7) * 0.1;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Phone body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.8, 0.1]} />
        <meshStandardMaterial color="#1e1e2f" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Phone Screen */}
      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[0.8, 1.65]} />
        <meshStandardMaterial color="#6366f1" emissive="#4338ca" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
      {/* Camera notch */}
      <mesh position={[0, 0.75, 0.06]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

// 3D Model: Floating Keys
function KeysItem({ position, rotation }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 1.1) * 0.3;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Key ring */}
      <mesh castShadow>
        <torusGeometry args={[0.35, 0.05, 16, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Key 1 */}
      <mesh position={[0.2, -0.4, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.12, 0.7, 0.04]} />
        <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Key 2 */}
      <mesh position={[-0.15, -0.45, 0.05]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.1, 0.65, 0.04]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

// 3D Model: Floating Smartwatch
function WatchItem({ position, rotation }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = rotation[1] + Math.cos(state.clock.elapsedTime * 0.9) * 0.25;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Watch dial */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.12, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Watch display */}
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 32]} />
        <meshStandardMaterial color="#14b8a6" emissive="#0d9488" emissiveIntensity={0.5} />
      </mesh>
      {/* Watch strap */}
      <mesh position={[0, 0, -0.55]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.7]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.55]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.7]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 3D Model: Backpack
function BackpackItem({ position, rotation }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Main pack */}
      <mesh castShadow>
        <boxGeometry args={[1.1, 1.4, 0.7]} />
        <meshStandardMaterial color="#4f46e5" roughness={0.6} />
      </mesh>
      {/* Front pocket */}
      <mesh position={[0, -0.2, 0.42]} castShadow>
        <boxGeometry args={[0.8, 0.7, 0.25]} />
        <meshStandardMaterial color="#3730a3" roughness={0.7} />
      </mesh>
      {/* Straps / Handle */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <torusGeometry args={[0.2, 0.04, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.8} />
      </mesh>
    </group>
  );
}

// 3D Model: Floating Book / Notepad
function BookItem({ position, rotation }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.75) * 0.2;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Book cover */}
      <mesh castShadow>
        <boxGeometry args={[1.1, 1.5, 0.2]} />
        <meshStandardMaterial color="#e11d48" roughness={0.4} />
      </mesh>
      {/* Pages interior */}
      <mesh position={[0.03, 0, 0]}>
        <boxGeometry args={[1.02, 1.44, 0.16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Complete 3D Scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#818cf8" />

      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <PhoneItem position={[-1.7, 0.8, 0]} rotation={[0.2, 0.4, -0.1]} />
      </Float>

      <Float speed={2.0} rotationIntensity={0.8} floatIntensity={1.0}>
        <BackpackItem position={[0.2, -0.2, -0.2]} rotation={[0.1, -0.3, 0]} />
      </Float>

      <Float speed={3.0} rotationIntensity={0.7} floatIntensity={1.4}>
        <KeysItem position={[1.8, 1.1, 0.2]} rotation={[0.4, 0.2, 0.3]} />
      </Float>

      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={1.1}>
        <WatchItem position={[-1.6, -1.1, 0.3]} rotation={[0.8, 0.4, -0.3]} />
      </Float>

      <Float speed={2.6} rotationIntensity={0.6} floatIntensity={1.3}>
        <BookItem position={[1.7, -0.9, -0.1]} rotation={[-0.3, 0.5, 0.2]} />
      </Float>

      <ContactShadows position={[0, -2.4, 0]} opacity={0.35} scale={9} blur={2.5} far={4} />
    </>
  );
}

export default function HeroScene() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    // Accessible, lightweight fallback for unsupported devices or reduced motion
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-50 to-teal-50 rounded-3xl p-8 border border-indigo-100 text-center">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <h4 className="text-base font-bold text-slate-800">Campus Recovery Radar</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Interactive 3D canvas active in hardware-accelerated browsers.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] sm:h-[500px] relative">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 48 }}
          dpr={[1, 1.5]} // Cap device pixel ratio for smooth performance
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      {/* Floating interactive tooltip */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[11px] font-semibold text-slate-600 shadow-xs flex items-center gap-1.5 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        Interactive 3D Campus Belongings
      </div>
    </div>
  );
}
