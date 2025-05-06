import axios from 'axios';
import type { Order, OrderStatus } from '../types/order';
import { useAuth } from '../composables/useAuth';

const API_BASE = 'http://localhost:5000/orders';

// Utility to get headers with the current token
const getAuthHeaders = () => {
  const { getToken } = useAuth();
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Fetch all orders with optional filters/pagination
export const fetchAllOrders = async (params: Record<string, any>) => {
  try {
    const { data } = await axios.get(`${API_BASE}/all`, {
      headers: getAuthHeaders(),
      params,
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};

// Fetch a single order by its ID
export const fetchOrderById = async (id: string): Promise<Order> => {
  try {
    const { data } = await axios.get(`${API_BASE}/${id}`, {
      headers: getAuthHeaders(),
    });
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch order with ID ${id}:`, error);
    throw error;
  }
};

// Update the status of a specific order
export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus,
) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/${orderId}/status`,
      { status: newStatus },
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update order status for ID ${orderId}:`, error);
    throw error;
  }
};

// Fetch analytics for orders
export const fetchOrderAnalytics = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/analytics`, {
      headers: getAuthHeaders(),
      params: { range: 'this-month' },
    });
    return data.data;
  } catch (error) {
    console.error('Failed to fetch order analytics:', error);
    throw error;
  }
};
