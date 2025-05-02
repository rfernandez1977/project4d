// File: src/App.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useState } from 'react';
import * as THREE from 'three';
import { Howl } from 'howler';
import CentralSphere from './components/CentralSphere';
import ProductPanel from './components/ProductPanel';
import ClientPanel from './components/ClientPanel';
import DiscountPanel from './components/DiscountPanel';
import PaymentPanel from './components/PaymentPanel';
import Invoice from './components/Invoice';
import './App.css';

function App() {
  const [isSaleCompleted, setIsSaleCompleted] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [isInvoiceOnlyView, setIsInvoiceOnlyView] = useState(false);

  const sound = new Howl({
    src: ['/sounds/futuristic-beep.mp3'],
    volume: 0.5,
  });

  const handleCompleteSale = () => {
    if (selectedProducts.length && selectedClient && paymentMethod) {
      setIsSaleCompleted(true);
      sound.play();
      
      // Show invoice after a short delay
      setTimeout(() => {
        setShowInvoice(true);
        setIsInvoiceOnlyView(true); // Show only the invoice
      }, 500);
      
      // We no longer auto-hide the invoice - the user will close it manually
    }
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    setIsInvoiceOnlyView(false);
    
    // Reset all states after closing the invoice
    setIsSaleCompleted(false);
    setSelectedProducts([]);
    setSelectedClient(null);
    setDiscount(0);
    setPaymentMethod(null);
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(product => product.id !== productId));
  };

  const calculateTotal = () => {
    // Assuming each product has a price property (we'll add that to ProductPanel)
    const subtotal = selectedProducts.reduce((sum, product) => sum + (product.price || 0), 0);
    const discountAmount = subtotal * (discount / 100);
    return (subtotal - discountAmount).toFixed(2);
  };

  return (
    <div style={{ height: '100vh', background: 'linear-gradient(135deg, #1e1e2f, #2a1a3c)' }}>
      {/* Only show UI elements when not in invoice-only view */}
      {!isInvoiceOnlyView && (
        <>
          {/* Client Search Input */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '20px', 
              left: '20px', 
              background: 'rgba(0, 0, 0, 0.7)', 
              padding: '10px 15px', 
              borderRadius: '10px', 
              boxShadow: '0 0 15px rgba(0, 255, 204, 0.3)',
              border: '1px solid #00ffcc',
              zIndex: 100,
              width: '250px'
            }}
          >
            <div style={{ color: '#00ffcc', fontFamily: 'Orbitron, sans-serif', marginBottom: '5px', fontSize: '14px' }}>
              Buscar Cliente
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={clientSearchTerm}
                onChange={(e) => setClientSearchTerm(e.target.value)}
                placeholder="Nombre o RUT..."
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid #ff00ff',
                  borderRadius: '5px',
                  padding: '8px 30px 8px 10px',
                  color: '#ffffff',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {clientSearchTerm && (
                <button
                  onClick={() => setClientSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#ff00ff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            {selectedClient && (
              <div style={{ 
                marginTop: '10px', 
                padding: '8px', 
                background: 'rgba(255, 0, 255, 0.1)', 
                borderRadius: '5px',
                border: '1px solid #ff00ff'
              }}>
                <div style={{ color: '#00ffcc', fontWeight: 'bold', fontSize: '12px' }}>Cliente Seleccionado:</div>
                <div style={{ color: 'white', fontSize: '12px' }}>{selectedClient.name}</div>
                <div style={{ color: '#ff00ff', fontSize: '10px' }}>{selectedClient.rut}</div>
              </div>
            )}
          </div>
          
          {/* Product Search Input */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '300px', 
              background: 'rgba(0, 0, 0, 0.7)', 
              padding: '10px 15px', 
              borderRadius: '10px', 
              boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)',
              border: '1px solid #ff00ff',
              zIndex: 100,
              width: '250px'
            }}
          >
            <div style={{ color: '#ff00ff', fontFamily: 'Orbitron, sans-serif', marginBottom: '5px', fontSize: '14px' }}>
              Buscar Producto
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                placeholder="Nombre de producto..."
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid #00ffcc',
                  borderRadius: '5px',
                  padding: '8px 30px 8px 10px',
                  color: '#ffffff',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {productSearchTerm && (
                <button
                  onClick={() => setProductSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#00ffcc',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Selected Items Panel */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              background: 'rgba(0, 0, 0, 0.7)', 
              padding: '15px', 
              borderRadius: '10px', 
              color: '#00ffcc', 
              fontFamily: 'Orbitron, sans-serif',
              zIndex: 100,
              minWidth: '250px',
              boxShadow: '0 0 15px rgba(0, 255, 204, 0.3)',
              border: '1px solid #00ffcc'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #00ffcc', paddingBottom: '5px' }}>
              Carrito de Compra
            </h3>
            
            {selectedProducts.length === 0 ? (
              <p style={{ color: '#ff00ff', fontSize: '0.9em' }}>Ningún producto seleccionado</p>
            ) : (
              <>
                <ul style={{ padding: '0', margin: '0 0 10px 0', listStyle: 'none' }}>
                  {selectedProducts.map((product) => (
                    <li key={product.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      margin: '5px 0',
                      padding: '5px',
                      background: 'rgba(255, 0, 255, 0.1)',
                      borderRadius: '5px'
                    }}>
                      <span>{product.name}</span>
                      <span>${product.price || 0}</span>
                      <button 
                        onClick={() => removeProduct(product.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff00ff',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '0 5px'
                        }}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div style={{ borderTop: '1px solid #00ffcc', paddingTop: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cliente:</span>
                    <span>{selectedClient ? selectedClient.name : 'No seleccionado'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Descuento:</span>
                    <span>{discount}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Método de pago:</span>
                    <span>{paymentMethod || 'No seleccionado'}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '10px',
                    fontWeight: 'bold'
                  }}>
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <motion.div
        className="overlay"
        animate={{ opacity: isSaleCompleted ? 0.7 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isSaleCompleted && (
          <motion.h1
            style={{ color: '#00ffcc', fontFamily: 'Orbitron', textAlign: 'center' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            ¡Venta Exitosa!
          </motion.h1>
        )}
      </motion.div>

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Only show these elements when not in invoice-only view */}
        {!isInvoiceOnlyView && (
          <>
            <CentralSphere onCompleteSale={handleCompleteSale} isSaleCompleted={isSaleCompleted} />
            <ProductPanel 
              onSelectProduct={(product) => setSelectedProducts([...selectedProducts, product])} 
              searchTerm={productSearchTerm}
            />
            <ClientPanel 
              onSelectClient={(client) => setSelectedClient(client)} 
              searchTerm={clientSearchTerm}
            />
            <DiscountPanel onSetDiscount={(value) => setDiscount(value)} />
            <PaymentPanel onSetPaymentMethod={(method) => setPaymentMethod(method)} />
          </>
        )}
        
        {showInvoice && (
          <Invoice 
            selectedProducts={selectedProducts}
            selectedClient={selectedClient}
            discount={discount}
            paymentMethod={paymentMethod}
            onClose={handleCloseInvoice}
          />
        )}
        
        <OrbitControls enableZoom={false} />
        {isSaleCompleted && !isInvoiceOnlyView && <Sparkles count={100} scale={5} size={10} speed={0.5} color="#00ffcc" />}
      </Canvas>
    </div>
  );
}

export default App;