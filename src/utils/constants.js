export const SHIPMENT_STATUS = {
  CREATED: 'Created',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered'
};

export const PACKAGE_SIZES = [
  { value: 'small', label: 'Small (up to 1kg)', price: 50 },
  { value: 'medium', label: 'Medium (up to 5kg)', price: 100 },
  { value: 'large', label: 'Large (up to 10kg)', price: 200 },
  { value: 'extra_large', label: 'Extra Large (up to 20kg)', price: 350 }
];

export const RAZORPAY_KEY = 'your_razorpay_key_here';