// File: src/components/Invoice.jsx
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import gsap from 'gsap';

const Invoice = ({ selectedProducts, selectedClient, discount, paymentMethod, onAnimationComplete, onClose }) => {
  const invoiceRef = useRef();
  const materialRef = useRef();
  const startPosition = [0, -10, -2]; // Start below the viewport
  const endPosition = [0, 0, -2]; // End in view

  // Initial animation when invoice appears
  useEffect(() => {
    // Animate the invoice coming into view
    gsap.to(invoiceRef.current.position, {
      x: endPosition[0],
      y: endPosition[1],
      z: endPosition[2],
      duration: 1.5,
      ease: "elastic.out(1, 0.75)",
      onComplete: () => {
        if (onAnimationComplete) onAnimationComplete();
      }
    });
    
    // Pulse animation for the glow effect
    gsap.to(materialRef.current, {
      emissiveIntensity: 0.8,
      duration: 1,
      repeat: -1,
      yoyo: true
    });
  }, [onAnimationComplete]);

  // Continuous gentle rotation
  useFrame((state, delta) => {
    if (invoiceRef.current) {
      invoiceRef.current.rotation.y += delta * 0.2; // Slow rotation
    }
  });

  // Calculate totals
  const subtotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  
  // Format date
  const now = new Date();
  const dateString = now.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const timeString = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <group ref={invoiceRef} position={startPosition}>
      {/* Invoice background */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[3.5, 5, 0.1]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#1e1e2f" 
          emissive="#00ffcc" 
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Close Button */}
      <group position={[1.5, 2.2, 0.1]} onClick={onClose}>
        <mesh>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial 
            color="#ff00ff" 
            emissive="#ff00ff" 
            emissiveIntensity={0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          X
        </Text>
        <Html position={[0, 0, 0]}>
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              cursor: 'pointer',
              pointerEvents: 'all' // Make sure it's clickable
            }} 
            onClick={onClose}
          ></div>
        </Html>
      </group>

      {/* Invoice Header */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.25}
        color="#00ffcc"
        anchorX="center"
        anchorY="middle"
        fontFamily="Orbitron"
        letterSpacing={0.05}
      >
        FACTURA DIGITAL
      </Text>

      <Text
        position={[0, 1.8, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontFamily="Orbitron"
      >
        {dateString} - {timeString}
      </Text>

      {/* Client Information */}
      <group position={[0, 1.4, 0]}>
        <Text
          position={[-1.5, 0, 0]}
          fontSize={0.12}
          color="#ff00ff"
          anchorX="left"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          CLIENTE:
        </Text>
        <Text
          position={[-0.6, 0, 0]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          {selectedClient ? selectedClient.name : 'No seleccionado'}
        </Text>
        
        {selectedClient && (
          <Text
            position={[-0.6, -0.2, 0]}
            fontSize={0.1}
            color="#00ffcc"
            anchorX="left"
            anchorY="middle"
            fontFamily="Orbitron"
          >
            {selectedClient.rut}
          </Text>
        )}
      </group>

      {/* Products List Header */}
      <group position={[0, 0.9, 0]}>
        <Text
          position={[-1.5, 0, 0]}
          fontSize={0.12}
          color="#ff00ff"
          anchorX="left"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          PRODUCTOS:
        </Text>

        {/* Product Headers */}
        <Text
          position={[-1.5, -0.2, 0]}
          fontSize={0.09}
          color="#00ffcc"
          anchorX="left"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          NOMBRE
        </Text>
        <Text
          position={[1.3, -0.2, 0]}
          fontSize={0.09}
          color="#00ffcc"
          anchorX="right"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          PRECIO
        </Text>
      </group>

      {/* Products List */}
      <group position={[0, 0.5, 0]}>
        {selectedProducts.map((product, index) => (
          <group key={product.id} position={[0, -index * 0.25, 0]}>
            <Text
              position={[-1.5, 0, 0]}
              fontSize={0.08}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
              fontFamily="Orbitron"
              maxWidth={2.5}
            >
              {product.name}
            </Text>
            <Text
              position={[1.3, 0, 0]}
              fontSize={0.08}
              color="#ffffff"
              anchorX="right"
              anchorY="middle"
              fontFamily="Orbitron"
            >
              ${product.price.toFixed(2)}
            </Text>
          </group>
        ))}
      </group>

      {/* Summary */}
      <group position={[0, -1.2 - (selectedProducts.length * 0.25), 0]}>
        <mesh position={[0, 0.1, -0.01]}>
          <boxGeometry args={[3.2, 0.01, 0.01]} />
          <meshStandardMaterial color="#00ffcc" />
        </mesh>
        
        <Text
          position={[-1.5, 0, 0]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          SUBTOTAL:
        </Text>
        <Text
          position={[1.3, 0, 0]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="right"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          ${subtotal.toFixed(2)}
        </Text>

        <Text
          position={[-1.5, -0.25, 0]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          DESCUENTO ({discount}%):
        </Text>
        <Text
          position={[1.3, -0.25, 0]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="right"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          -${discountAmount.toFixed(2)}
        </Text>

        <mesh position={[0, -0.4, -0.01]}>
          <boxGeometry args={[3.2, 0.01, 0.01]} />
          <meshStandardMaterial color="#00ffcc" />
        </mesh>

        <Text
          position={[-1.5, -0.55, 0]}
          fontSize={0.14}
          color="#00ffcc"
          anchorX="left"
          anchorY="middle"
          fontFamily="Orbitron"
          fontWeight="bold"
        >
          TOTAL:
        </Text>
        <Text
          position={[1.3, -0.55, 0]}
          fontSize={0.14}
          color="#00ffcc"
          anchorX="right"
          anchorY="middle"
          fontFamily="Orbitron"
          fontWeight="bold"
        >
          ${total.toFixed(2)}
        </Text>
      </group>

      {/* Payment Method */}
      <group position={[0, -2.0 - (selectedProducts.length * 0.25), 0]}>
        <Text
          position={[-1.5, 0, 0]}
          fontSize={0.1}
          color="#ff00ff"
          anchorX="left"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          MÉTODO DE PAGO:
        </Text>
        <Text
          position={[1.3, 0, 0]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="right"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          {paymentMethod || 'No seleccionado'}
        </Text>
      </group>

      {/* Thank You Message */}
      <Text
        position={[0, -2.4 - (selectedProducts.length * 0.25), 0]}
        fontSize={0.12}
        color="#00ffcc"
        anchorX="center"
        anchorY="middle"
        fontFamily="Orbitron"
      >
        ¡GRACIAS POR SU COMPRA!
      </Text>

      {/* Close Button Instruction */}
      <Text
        position={[0, -2.7 - (selectedProducts.length * 0.25), 0]}
        fontSize={0.08}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
        fontFamily="Orbitron"
      >
        Haga clic en X para cerrar
      </Text>

      {/* HTML overlay for holographic effect */}
      <Html
        position={[0, 0, 0.1]}
        center
        style={{
          width: '500px',
          height: '700px',
          pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(0,255,204,0.1) 0%, rgba(0,0,0,0) 70%)',
          boxShadow: '0 0 20px rgba(0, 255, 204, 0.5)',
          borderRadius: '10px',
          mixBlendMode: 'screen',
        }}
      >
        <div style={{ 
          width: '100%', 
          height: '100%',
          background: 'repeating-linear-gradient(0deg, rgba(0,255,204,0.05) 0px, rgba(0,255,204,0) 1px, rgba(0,255,204,0) 2px)',
          animation: 'scan 2s linear infinite',
        }}>
          <style>{`
            @keyframes scan {
              0% { background-position: 0 0; }
              100% { background-position: 0 100px; }
            }
          `}</style>
        </div>
      </Html>
    </group>
  );
};

export default Invoice;