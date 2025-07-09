export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    'Created': 'bg-blue-100 text-blue-800',
    'Picked Up': 'bg-yellow-100 text-yellow-800',
    'In Transit': 'bg-orange-100 text-orange-800',
    'Out for Delivery': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const calculateShippingCost = (packageSize, distance = 100) => {
  const baseCosts = {
    'small': 50,
    'medium': 100,
    'large': 200,
    'extra_large': 350
  };
  
  const distanceMultiplier = Math.max(1, distance / 100);
  return Math.round(baseCosts[packageSize] * distanceMultiplier);
};

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};