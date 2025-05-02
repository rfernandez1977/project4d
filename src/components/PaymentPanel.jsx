// File: src/components/PaymentPanel.jsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';

function PaymentPanel({ onSetPaymentMethod }) {
  const paymentRef = useRef();
  const [hoveredMethod, setHoveredMethod] = useState(null);
  
  const paymentMethods = [
    { id: 1, name: 'Efectivo', position: [0, -2, -2], color: '#00ff66' },
    { id: 2, name: 'Tarjeta Débito', position: [0, -2, -1], color: '#00ccff' },
    { id: 3, name: 'Tarjeta Crédito', position: [0, -2, 0], color: '#0066ff' },
    { id: 4, name: 'Transferencia', position: [0.8, -2, -1.5], color: '#ff00cc' },
    { id: 5, name: 'PayPal', position: [0.8, -2, -0.5], color: '#0099cc' },
    { id: 6, name: 'Criptomoneda', position: [-0.8, -2, -1.5], color: '#ffcc00' },
    { id: 7, name: 'Cheque', position: [-0.8, -2, -0.5], color: '#cc00ff' },
  ];

  useFrame(() => {
    paymentRef.current.rotation.y += 0.005;
  });

  return (
    <group ref={paymentRef}>
      {paymentMethods.map((method) => (
        <group key={method.id}>
          <mesh
            position={method.position}
            onClick={() => onSetPaymentMethod(method.name)}
            onPointerOver={() => setHoveredMethod(method.id)}
            onPointerOut={() => setHoveredMethod(null)}
          >
            <torusGeometry args={[0.3, 0.1, 16, 32]} />
            <meshStandardMaterial
              color={method.color}
              emissive="#ff00ff"
              emissiveIntensity={hoveredMethod === method.id ? 0.8 : 0.5}
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
                  border: `1px solid ${method.color}`,
                }}
              >
                {method.name}
              </div>
            </Html>
          </mesh>
        </group>
      ))}
      
      <Text
        position={[0, -3, -1]}
        fontSize={0.2}
        color="#00ffcc"
        anchorX="center"
        anchorY="middle"
        fontFamily="Orbitron"
      >
        MÉTODOS DE PAGO
      </Text>
    </group>
  );
}

export default PaymentPanel;