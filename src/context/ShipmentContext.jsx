import { createContext, useContext, useState } from 'react';

const ShipmentContext = createContext();

export const useShipment = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipment must be used within a ShipmentProvider');
  }
  return context;
};

export const ShipmentProvider = ({ children }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);

  const addShipment = (shipment) => {
    setShipments(prev => [shipment, ...prev]);
  };

  const updateShipment = (shipmentId, updates) => {
    setShipments(prev => prev.map(shipment => 
      shipment.id === shipmentId ? { ...shipment, ...updates } : shipment
    ));
  };

  const value = {
    shipments,
    setShipments,
    loading,
    setLoading,
    addShipment,
    updateShipment
  };

  return (
    <ShipmentContext.Provider value={value}>
      {children}
    </ShipmentContext.Provider>
  );
};