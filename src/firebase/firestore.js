import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './config';
import { v4 as uuidv4 } from 'uuid';

export const createShipment = async (shipmentData, userId) => {
  try {
    const trackingId = `SHP${uuidv4().substring(0, 8).toUpperCase()}`;
    
    const shipment = {
      ...shipmentData,
      trackingId,
      userId,
      status: 'Created',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      statusHistory: [
        {
          status: 'Created',
          timestamp: new Date().toISOString(),
          description: 'Shipment created successfully'
        }
      ]
    };
    
    const docRef = await addDoc(collection(db, 'shipments'), shipment);
    return { id: docRef.id, ...shipment };
  } catch (error) {
    throw error;
  }
};

export const getUserShipments = async (userId) => {
  try {
    const q = query(
      collection(db, 'shipments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const getShipmentByTrackingId = async (trackingId) => {
  try {
    const q = query(
      collection(db, 'shipments'),
      where('trackingId', '==', trackingId)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw error;
  }
};

export const updateShipmentStatus = async (shipmentId, newStatus, description = '') => {
  try {
    const shipmentRef = doc(db, 'shipments', shipmentId);
    const shipmentDoc = await getDoc(shipmentRef);
    
    if (!shipmentDoc.exists()) {
      throw new Error('Shipment not found');
    }
    
    const currentData = shipmentDoc.data();
    const newStatusEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      description: description || `Status updated to ${newStatus}`
    };
    
    await updateDoc(shipmentRef, {
      status: newStatus,
      statusHistory: [...currentData.statusHistory, newStatusEntry],
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    throw error;
  }
};