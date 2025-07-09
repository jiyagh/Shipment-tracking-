import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { shipmentSchema } from '../../utils/validation';
import { PACKAGE_SIZES, RAZORPAY_KEY } from '../../utils/constants';
import { calculateShippingCost, loadRazorpayScript } from '../../utils/helpers';
import { createShipment } from '../../firebase/firestore';
import LoadingSpinner from '../UI/LoadingSpinner';

const CreateShipment = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPackageSize, setSelectedPackageSize] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(shipmentSchema)
  });

  const packageSize = watch('packageSize');
  const shippingCost = packageSize ? calculateShippingCost(packageSize) : 0;

  const handlePayment = async (shipmentData) => {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      toast.error('Payment gateway failed to load');
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: shippingCost * 100, // Amount in paise
      currency: 'INR',
      name: 'ShipFast Delivery',
      description: 'Shipment Delivery Payment',
      handler: async (response) => {
        try {
          setLoading(true);
          const shipment = await createShipment({
            ...shipmentData,
            paymentId: response.razorpay_payment_id,
            amount: shippingCost,
            paymentStatus: 'completed'
          }, user.uid);
          
          toast.success('Shipment created successfully!');
          navigate('/payment-success', { 
            state: { 
              shipment,
              paymentId: response.razorpay_payment_id 
            }
          });
        } catch (error) {
          toast.error('Failed to create shipment');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: user.displayName,
        email: user.email,
      },
      theme: {
        color: '#3b82f6',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmit = async (data) => {
    if (!shippingCost) {
      toast.error('Please select a package size');
      return;
    }
    
    await handlePayment(data);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Shipment</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender Name
              </label>
              <input
                {...register('senderName')}
                type="text"
                className="input-field"
                placeholder="Enter sender name"
              />
              {errors.senderName && (
                <p className="mt-1 text-sm text-red-600">{errors.senderName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receiver Name
              </label>
              <input
                {...register('receiverName')}
                type="text"
                className="input-field"
                placeholder="Enter receiver name"
              />
              {errors.receiverName && (
                <p className="mt-1 text-sm text-red-600">{errors.receiverName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Address
            </label>
            <textarea
              {...register('pickupAddress')}
              rows={3}
              className="input-field"
              placeholder="Enter complete pickup address"
            />
            {errors.pickupAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Address
            </label>
            <textarea
              {...register('deliveryAddress')}
              rows={3}
              className="input-field"
              placeholder="Enter complete delivery address"
            />
            {errors.deliveryAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Size
            </label>
            <select
              {...register('packageSize')}
              className="input-field"
              onChange={(e) => setSelectedPackageSize(e.target.value)}
            >
              <option value="">Select package size</option>
              {PACKAGE_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label} - ₹{size.price}
                </option>
              ))}
            </select>
            {errors.packageSize && (
              <p className="mt-1 text-sm text-red-600">{errors.packageSize.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input-field"
              placeholder="Any special instructions or notes"
            />
          </div>

          {shippingCost > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Shipping Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-900">₹{shippingCost}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !shippingCost}
            className="btn-primary w-full flex justify-center items-center"
          >
            {loading ? <LoadingSpinner size="sm" /> : `Pay ₹${shippingCost} & Create Shipment`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;

