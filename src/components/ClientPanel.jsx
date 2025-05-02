// File: src/components/ClientPanel.jsx
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';

function ClientPanel({ onSelectClient, searchTerm }) {
  const clientRef = useRef();
  const [hoveredClient, setHoveredClient] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const clients = [
    { id: 1, name: 'Juan Pérez', rut: '12.345.678-9', address: 'Calle Falsa 123', position: [-2, 1.5, 0], type: 'Premium' },
    { id: 2, name: 'María García', rut: '98.765.432-1', address: 'Avenida Siempreviva 742', position: [-2, 0.75, 0], type: 'Regular' },
    { id: 3, name: 'Carlos López', rut: '11.223.344-5', address: 'Pasaje El Olivo 456', position: [-2, 0, 0], type: 'Premium' },
    { id: 4, name: 'Ana Martín', rut: '55.667.788-9', address: 'Camino Los Aromos 789', position: [-2, -0.75, 0], type: 'Regular' },
    { id: 5, name: 'Roberto Santos', rut: '44.332.211-0', address: 'Ruta del Sol 1011', position: [-2, -1.5, 0], type: 'New' },
    { id: 6, name: 'Laura Gómez', rut: '66.778.899-1', address: 'Boulevard de las Estrellas 1213', position: [-2.8, 1.25, 0], type: 'Premium' },
    { id: 7, name: 'Miguel Torres', rut: '88.990.011-2', address: 'Vereda de la Luna 1415', position: [-2.8, 0.5, 0], type: 'Regular' },
    { id: 8, name: 'Carmen Ruiz', rut: '22.334.455-6', address: 'Sendero del Bosque 1617', position: [-2.8, -0.25, 0], type: 'Premium' },
    { id: 9, name: 'David Moreno', rut: '77.889.900-3', address: 'Plaza de la Libertad 1819', position: [-2.8, -1.0, 0], type: 'New' },
  ];

  // Filter clients when search term changes
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      setFilteredClients(clients);
      setIsSearchActive(false);
      return;
    }
    
    setIsSearchActive(true);
    const filtered = clients.filter(client => 
      client.name.toLowerCase().includes(term) || 
      client.rut.replace(/[.-]/g, '').includes(term.replace(/[.-]/g, ''))
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  useFrame(() => {
    clientRef.current.rotation.y += 0.005;
  });

  const getClientColor = (type) => {
    switch(type) {
      case 'Premium': return '#ffcc00';
      case 'Regular': return '#00ffcc';
      case 'New': return '#ff00ff';
      default: return '#00ffcc';
    }
  };

  return (
    <group ref={clientRef}>
      {filteredClients.map((client) => (
        <group key={client.id}>
          <mesh
            position={client.position}
            onClick={() => onSelectClient(client)}
            onPointerOver={() => setHoveredClient(client.id)}
            onPointerOut={() => setHoveredClient(null)}
          >
            <cylinderGeometry args={[0.3, 0.3, 0.5, 32]} />
            <meshStandardMaterial
              color={getClientColor(client.type)}
              emissive="#ff00ff"
              emissiveIntensity={hoveredClient === client.id ? 0.8 : 0.5}
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
                  padding: '4px 8px',
                  borderRadius: '4px',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  fontSize: '0.8em',
                  fontFamily: 'Orbitron, sans-serif',
                  border: `1px solid ${getClientColor(client.type)}`,
                  maxWidth: '200px',
                  boxShadow: isSearchActive ? `0 0 10px ${getClientColor(client.type)}` : 'none',
                }}
              >
                <div style={{ 
                  fontWeight: 'bold',
                  borderBottom: `1px solid ${getClientColor(client.type)}`,
                  paddingBottom: '2px',
                  marginBottom: '2px'
                }}>
                  {client.name}
                </div>
                <span style={{ 
                  display: 'block', 
                  fontSize: '0.7em',
                  color: getClientColor(client.type),
                  marginBottom: '2px'
                }}>
                  {client.type}
                </span>
                <span style={{ 
                  display: 'block', 
                  fontSize: '0.7em'
                }}>
                  <strong>RUT:</strong> {client.rut}
                </span>
                <span style={{ 
                  display: 'block', 
                  fontSize: '0.7em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <strong>Dirección:</strong> {client.address}
                </span>
              </div>
            </Html>
          </mesh>
        </group>
      ))}
      
      <Text
        position={[-2.4, 2.2, 0]}
        fontSize={0.2}
        color="#00ffcc"
        anchorX="center"
        anchorY="middle"
        fontFamily="Orbitron"
      >
        CLIENTES {isSearchActive ? `(${filteredClients.length})` : ''}
      </Text>
      
      {isSearchActive && filteredClients.length === 0 && (
        <Text
          position={[-2.4, 1, 0]}
          fontSize={0.15}
          color="#ff00ff"
          anchorX="center"
          anchorY="middle"
          fontFamily="Orbitron"
        >
          No se encontraron clientes
        </Text>
      )}
    </group>
  );
}

export default ClientPanel;