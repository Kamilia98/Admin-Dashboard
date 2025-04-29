import axios from "axios";
import type { Product } from "../types/product";

const BASE_URL = "http://localhost:5000/products";

/ * * * Api calls * * * /;

const fetchAllProducts = () => axios.get<Product[]>(`${BASE_URL}`);
export const fetchProductById = (id: string) =>
  axios.get<Product>(`${BASE_URL}/${id}`);
export const deleteProduct = (id: string) => axios.delete(`${BASE_URL}/${id}`);
export const createProduct = () => axios.get<Product>(`${BASE_URL}/create`);
export const updateProduct = (id: string) =>
  axios.get<Product>(`${BASE_URL}/update/${id}`);
