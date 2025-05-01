import type { User } from './user';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  image: string;
  color: { name: string; hex: string };
}

export interface ShippingAddress {
  address: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  zipCode: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  totalAmount: string;
  user: User;
  orderItems: OrderItem[];
}

export enum OrderStatus {
  pending = 'Pending',
  processing = 'Processing',
  shipped = 'Shipped',
  canceled = 'Canceled',
  delivered = 'Delivered',
}
