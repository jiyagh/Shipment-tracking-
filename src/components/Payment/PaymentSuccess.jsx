import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const { shipment, paymentId } = location.state || {};

  if (!shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Payment information not found</h1>
          <Link to="/dashboard" className="btn-primary mt-4">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your shipment has been created successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Tracking ID:</span>
              <span className="font-mono font-bold text-blue-600">{shipment.trackingId}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Payment ID:</span>
              <span className="font-mono text-sm text-gray-900">{paymentId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Amount Paid:</span>
              <span className="font-bold text-green-600">₹{shipment.amount}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to={`/track/${shipment.trackingId}`}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Package className="h-4 w-4" />
              Track Shipment
            </Link>
            
            <Link
              to="/dashboard"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;