
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getShipmentByTrackingId } from '../../firebase/firestore';
import { formatDate, getStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Search, Package, Clock, MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';

const TrackShipment = () => {
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await getShipmentByTrackingId(data.trackingId.toUpperCase());
      if (result) {
        setShipment(result);
      } else {
        toast.error('Shipment not found');
        setShipment(null);
      }
    } catch (error) {
      toast.error('Failed to track shipment');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (status) => {
    const statusMap = {
      'Created': 20,
      'Picked Up': 40,
      'In Transit': 60,
      'Out for Delivery': 80,
      'Delivered': 100
    };
    return statusMap[status] || 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Track Your Shipment</h1>
        <p className="text-gray-600 mt-2">Enter your tracking ID to see real-time updates</p>
      </div>

      <div className="card p-6 mb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
          <div className="flex-1">
            <input
              {...register('trackingId', { required: true })}
              type="text"
              placeholder="Enter tracking ID (e.g., SHP12345678)"
              className="input-field"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : <Search size={20} />}
            Track
          </button>
        </form>
      </div>

      {shipment && (
        <div className="space-y-6">
          {/* Shipment Overview */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Tracking ID: {shipment.trackingId}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                {shipment.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{getProgressPercentage(shipment.status)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(shipment.status)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-medium">{shipment.senderName}</p>
                  <p className="text-sm text-gray-500">{shipment.pickupAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">To</p>
                  <p className="font-medium">{shipment.receiverName}</p>
                  <p className="text-sm text-gray-500">{shipment.deliveryAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-medium">{formatDate(shipment.estimatedDelivery)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Shipment History</h3>
            <div className="space-y-4">
              {shipment.statusHistory?.map((entry, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{entry.status}</h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackShipment;