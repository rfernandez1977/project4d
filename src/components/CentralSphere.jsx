// File: src/components/CentralSphere.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function CentralSphere({ onCompleteSale, isSaleCompleted }) {
  const sphereRef = useRef();

  useFrame(() => {
    sphereRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={sphereRef} onClick={onCompleteSale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#ff00ff"
        emissive="#00ffcc"
        emissiveIntensity={isSaleCompleted ? 1 : 0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

export default CentralSphere;