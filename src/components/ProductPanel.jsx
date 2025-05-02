// File: src/components/ProductPanel.jsx
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';

function ProductPanel({ onSelectProduct, searchTerm }) {
  const productRef = useRef();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const products = [
    { id: 1, name: 'Smartphone X12', price: 1299.99, position: [2, 1.5, 0] },
    { id: 2, name: 'Laptop Pro', price: 2499.50, position: [2, 0.75, 0] },
    { id: 3, name: 'Smartwatch V3', price: 349.99, position: [2, 0, 0] },
    { id: 4, name: 'Tablet Air', price: 899.00, position: [2, -0.75, 0] },
    { id: 5, name: 'Auriculares FX', price: 199.95, position: [2, -1.5, 0] },
    { id: 6, name: 'Cámara 4K', price: 799.99, position: [2.8, 1.25, 0] },
    { id: 7, name: 'Altavoz BT', price: 149.50, position: [2.8, 0.5, 0] },
    { id: 8, name: 'Monitor UHD', price: 599.00, position: [2.8, -0.25, 0] },
    { id: 9, name: 'Teclado RGB', price: 129.99, position: [2.8, -1.0, 0] },
  ];

  // Filter products when search term changes
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      setFilteredProducts(products);
      setIsSearchActive(false);
      return;
    }
    
    setIsSearchActive(true);
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useFrame(() => {
    productRef.current.rotation.y += 0.005;
  });

  return (
    <group ref={productRef}>
      {filteredProducts.map((product) => (
        <group key={product.id}>
          <mesh
            position={product.position}
            onClick={() => onSelectProduct(product)}
            onPointerOver={() => setHoveredProduct(product.id)}
            onPointerOut={() => setHoveredProduct(null)}
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#00ffcc"
              emissiveIntensity={hoveredProduct === product.id ? 0.8 : 0.5}
              roughness={0.3}
              metalness={0.7}
            />
            <Html
              position={[0, 0, 0.26]}
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
                  border: '1px solid #00ffcc',
                  boxShadow: isSearchActive ? '0 0 10px #00ffcc' : 'none',
                }}
              >
                {product.name}
              </div>
            </Html>
          </mesh>
          <Text
            position={[product.position[0], product.position[1] - 0.4, product.position[2]]}
            fontSize={0.1}
            color="#00ffcc"
            anchorX="center"
            anchorY="middle"
            fontFamily="Orbitron"
          >
            ${product.price}
          </Text>
        </group>
      ))}
      
      <Text
        position={[2.4, 2.2, 0]}
        fontSize={0.2}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
        fontFamily="Orbitron"
      >
        PRODUCTOS {isSearchActive ? `(${filteredProducts.length})` : ''}
      </Text>
      
      {isSearchActive && filteredProducts.length === 0 && (
        <Text
          position={[2.4, 1, 0]}
          fontSize={0.15}
          color="#00ffcc"
          anchorX="center"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          No se encontraron productos
        </Text>
      )}
    </group>
  );
}

export default ProductPanel;