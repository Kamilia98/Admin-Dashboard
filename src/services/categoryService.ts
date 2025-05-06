// src/services/categoryService.ts
import axios from 'axios';

const API_BASE = 'http://localhost:5000/categories';

export const getAllCategories = async () => {
  const { data } = await axios.get(API_BASE);
  return data.data.categories;
};

export const getCategoryById = async (id: string) => {
  const { data } = await axios.get(`${API_BASE}/${id}`);
  console.log(data);
  return data.data.category;
};

export const createCategory = async (payload: {
  name: string;
  description: string;
  image: string;
}) => {
  const { data } = await axios.post(API_BASE, payload);
  return data.data.category;
};

export const updateCategory = async (
  id: string,
  payload: { name: string; description: string; image: string },
) => {
  const { data } = await axios.patch(`${API_BASE}/${id}`, payload);
  return data.data.category;
};

export const deleteCategory = async (id: string) => {
  return await axios.delete(`${API_BASE}/${id}`);
};
