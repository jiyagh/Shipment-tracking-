import { formatDate, getStatusColor } from '../../utils/helpers';
import { Package, Clock, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShipmentCard = ({ shipment }) => {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{shipment.trackingId}</p>
            <p className="text-sm text-gray-500">
              {formatDate(shipment.createdAt)}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
          {shipment.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
          <div className="text-sm">
            <p className="text-gray-600">From: <span className="text-gray-900">{shipment.senderName}</span></p>
            <p className="text-gray-600">To: <span className="text-gray-900">{shipment.receiverName}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <p className="text-sm text-gray-600">
            Est. Delivery: {formatDate(shipment.estimatedDelivery)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">
          ₹{shipment.amount}
        </span>
        <Link
          to={`/track/${shipment.trackingId}`}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <Eye className="h-4 w-4" />
          Track
        </Link>
      </div>
    </div>
  );
};

export default ShipmentCard;