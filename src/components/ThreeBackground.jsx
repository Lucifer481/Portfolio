import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

const ParticleField = (props) => {
  const ref = useRef();
  
  const [sphere] = useState(() => {
    const points = new Float32Array(3000);
    for (let i = 0; i < 3000; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 1.5; // Radius up to 1.5
      points[i] = r * Math.sin(phi) * Math.cos(theta);
      points[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      points[i + 2] = r * Math.cos(phi);
    }
    return points;
  });

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#a855f7"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const InteractiveShape = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.pointer;
    // Rotate object naturally
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    // Shift slightly toward pointer coordinates for mouse follow
    meshRef.current.position.x = x * 0.5;
    meshRef.current.position.y = y * 0.5;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial 
        color="#00ffff" 
        wireframe 
        transparent
        opacity={0.15}
      />
    </mesh>
  );
};

const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 2.5] }} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <InteractiveShape />
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
