// src/services/categoryService.ts
import axios from 'axios';
import { useAuth } from '../composables/useAuth';

const API_BASE = 'http://localhost:5000/categories';

// Utility to get headers with the current token
const getAuthHeaders = () => {
  const { getToken } = useAuth();
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const fetchCategories = async (params: Record<string, any>) => {
  const { data } = await axios.get(API_BASE, {
    headers: getAuthHeaders(),
    params,
  });
  return data.data;
};

export const fetchCategory = async (id: string) => {
  const { data } = await axios.get(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
  return data.data.category;
};

export const fetchCategoriesAnalytics = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/analytics`, {
      headers: getAuthHeaders(),
    });
    return data.data;
  } catch (error) {
    console.error('Failed to fetch categories analytics:', error);
    throw error;
  }
};

export const createCategory = async (payload: {
  name: string;
  description: string;
  image: string;
}) => {
  const { data } = await axios.post(API_BASE, payload, {
    headers: getAuthHeaders(),
  });
  return data.data.category;
};

export const updateCategory = async (
  id: string,
  payload: { name: string; description: string; image: string },
) => {
  const { data } = await axios.patch(`${API_BASE}/${id}`, payload, {
    headers: getAuthHeaders(),
  });
  return data.data.category;
};

export const deleteCategory = async (id: string) => {
  return await axios.delete(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
};
