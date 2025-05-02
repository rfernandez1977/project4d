// File: src/components/DiscountPanel.jsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';

function DiscountPanel({ onSetDiscount }) {
  const discountRef = useRef();
  const [hoveredDiscount, setHoveredDiscount] = useState(null);
  
  const discounts = [
    { id: 1, value: 5, position: [0, 2, -2], color: '#00ffcc' },
    { id: 2, value: 10, position: [0, 2, -1], color: '#00ccff' },
    { id: 3, value: 15, position: [0, 2, 0], color: '#0099ff' },
    { id: 4, value: 20, position: [0.8, 2, -1.5], color: '#ff00cc' },
    { id: 5, value: 25, position: [0.8, 2, -0.5], color: '#ff0066' },
    { id: 6, value: 30, position: [-0.8, 2, -1.5], color: '#ffcc00' },
    { id: 7, value: 40, position: [-0.8, 2, -0.5], color: '#ff9900' },
  ];

  useFrame(() => {
    discountRef.current.rotation.y += 0.005;
  });

  return (
    <group ref={discountRef}>
      {discounts.map((discount) => (
        <group key={discount.id}>
          <mesh
            position={discount.position}
            onClick={() => onSetDiscount(discount.value)}
            onPointerOver={() => setHoveredDiscount(discount.id)}
            onPointerOut={() => setHoveredDiscount(null)}
          >
            <tetrahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial
              color={discount.color}
              emissive="#ff00ff"
              emissiveIntensity={hoveredDiscount === discount.id ? 0.8 : 0.5}
              roughness={0.3}
              metalness={0.7}
            />
            <Html
              position={[0, 0, 0.3]}
              center
              distanceFactor={10}
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  fontSize: '0.8em',
                  fontFamily: 'Orbitron, sans-serif',
                  border: `1px solid ${discount.color}`,
                }}
              >
                {discount.value}%
              </div>
            </Html>
          </mesh>
        </group>
      ))}
      
      <Text
        position={[0, 3, -1]}
        fontSize={0.2}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
        fontFamily="Orbitron"
      >
        DESCUENTOS
      </Text>
    </group>
  );
}

export default DiscountPanel;