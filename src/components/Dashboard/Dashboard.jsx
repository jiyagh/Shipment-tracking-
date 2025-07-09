import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShipment } from '../../context/ShipmentContext';
import { getUserShipments } from '../../firebase/firestore';
import ShipmentCard from './ShipmentCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Plus, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { shipments, setShipments, loading, setLoading } = useShipment();

  useEffect(() => {
    const fetchShipments = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const userShipments = await getUserShipments(user.uid);
        setShipments(userShipments);
      } catch (error) {
        toast.error('Failed to fetch shipments');
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [user, setShipments, setLoading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.displayName || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your shipments and track deliveries
          </p>
        </div>
        <Link
          to="/create-shipment"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Create Shipment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'Delivered').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => ['In Transit', 'Out for Delivery'].includes(s.status)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Shipments</h2>
        {shipments.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new shipment.
            </p>
            <div className="mt-6">
              <Link to="/create-shipment" className="btn-primary">
                Create Shipment
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shipments.map((shipment) => (
              <ShipmentCard key={shipment.id} shipment={shipment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;