import axios from 'axios';
import type { Product } from '../types/product';
import type {
  productVariant,
  ProductApiResponse,
} from '../types/product-varient';
const BASE_URL = 'http://localhost:5000/products';

/ * * * Api calls * * * /;

export const fetchAllProducts = async (page = 1, limit = 10) => {
  const response = await axios.get<ProductApiResponse>(
    `${BASE_URL}/color?page=${page}&limit=${limit}`,
  );
  console.log('[Product Service -- all data]', response.data);
  return response.data;
};

export const fetchProductById = async (id: string) => {
  const response = await axios.get<{
    status: string;
    data: { product: Product };
  }>(`${BASE_URL}/${id}`);
  return response.data;
};
export const deleteProduct = (id: string) => axios.delete(`${BASE_URL}/${id}`);

export const createProduct = (newProduct: Product) => {
  return axios.post<Product>(`${BASE_URL}`, newProduct);
};

export const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
  return axios.put<Product>(`${BASE_URL}/update/${id}`, updatedProduct);
};
