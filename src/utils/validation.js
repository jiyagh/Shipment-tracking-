import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

export const signupSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

export const shipmentSchema = yup.object({
  senderName: yup.string().required('Sender name is required'),
  receiverName: yup.string().required('Receiver name is required'),
  pickupAddress: yup.string().required('Pickup address is required'),
  deliveryAddress: yup.string().required('Delivery address is required'),
  packageSize: yup.string().required('Package size is required'),
  notes: yup.string()
});