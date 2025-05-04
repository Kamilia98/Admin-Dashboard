// services/ordersService.ts
import axios from 'axios';
import type { Order, OrderStatus } from '../types/order';

const API_BASE = 'http://localhost:5000/orders';

export const fetchAllOrders = async (params: any) => {
  const { data } = await axios.get(`${API_BASE}/all`, { params });
  return data;
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  const { data } = await axios.get(`${API_BASE}/${id}`);
  return data.data;
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus,
) => {
  return axios.patch(`${API_BASE}/${orderId}/status`, { status: newStatus });
};

export const fetchOrderAnalytics = async () => {
  const response = await fetch(`${API_BASE}/analytics?range=this-month`);
  if (!response.ok) throw new Error('Failed to fetch order analytics');
  const json = await response.json();
  return json.data;
};
