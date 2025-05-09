import axios from 'axios';
import type { Product } from '../types/product';
import type {
  productVariant,
  ProductApiResponse,
} from '../types/product-varient';
const BASE_URL = 'http://localhost:5000/products';

/ * * * Api calls * * * /;

export const fetchAllProducts = async (
  page = 1,
  limit = 10,
  sortBy = '',
  order: 'asc' | 'desc' = 'asc',
  filters?: {
    categories?: string[];
    minPrice?: number | null;
    maxPrice?: number | null;
  },
) => {
  const params: Record<string, any> = {
    page,
    limit,
    sortBy,
    order,
  };

  if (filters?.categories?.length) {
    params.categories = filters.categories.join(',');
  }

  if (filters?.minPrice != null) {
    params.minPrice = filters.minPrice;
  }

  if (filters?.maxPrice != null) {
    params.maxPrice = filters.maxPrice;
  }

  const response = await axios.get<ProductApiResponse>(`${BASE_URL}/color`, {
    params,
  });

  console.log('[Product Service -- URL]', response.config.url);
  console.log('[Product Service -- Params]', params);
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
export const deleteProduct = (id: string) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

export const createProduct = (newProduct: Product) => {
  return axios.post<Product>(`${BASE_URL}`, newProduct);
};

export const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
  return axios.put<Product>(`${BASE_URL}/update/${id}`, updatedProduct);
};
