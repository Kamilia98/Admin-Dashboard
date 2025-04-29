import axios from "axios";
import type { Product } from "../types/product";

const BASE_URL = "http://localhost:5000/products";

/ * * * Api calls * * * /;

export const fetchAllProducts = () => {
  return axios
    .get<{ status: string; data: { products: Product[] } }>(`${BASE_URL}`)
    .then((response) => response.data); // returns the whole response including status and data
};

export const fetchProductById = (id: string) => {
  return axios.get<Product>(`${BASE_URL}/${id}`);
};

export const deleteProduct = (id: string) => axios.delete(`${BASE_URL}/${id}`);

export const createProduct = (newProduct: Product) => {
  return axios.post<Product>(`${BASE_URL}`, newProduct);
};

export const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
  return axios.put<Product>(`${BASE_URL}/update/${id}`, updatedProduct);
};
