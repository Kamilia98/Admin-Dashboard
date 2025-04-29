import { defineStore } from "pinia";
import type { Product } from "../types/product";
import * as productService from "../services/productService";
import { ref } from "vue";

export const useProductStore = defineStore("productStore", () => {
  // States
  const products = ref<Product[]>([]);
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const getAllProducts = async () => {
    loading.value = true;
    try {
      const { data } = await productService.fetchAllProducts();
      products.value = data.products;
      console.log("[Product store -- all data]", products.value);
    } catch (err: any) {
      error.value = err.message || "Failed to fetch products";
    } finally {
      loading.value = false;
    }
  };

  const getProductById = async (id: string) => {
    loading.value = true;
    try {
      const { data } = await productService.fetchProductById(id);
      product.value = data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch product";
    } finally {
      loading.value = false;
    }
  };

  const removeProduct = async (id: string) => {
    loading.value = true;
    try {
      await productService.deleteProduct(id);
      products.value = products.value.filter((item) => item._id !== id);
    } catch (err: any) {
      error.value = err.message || "Failed to delete product";
    } finally {
      loading.value = false;
    }
  };

  const addProduct = async (newProduct: Product) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await productService.createProduct(newProduct);
      products.value.push(data);
    } catch (err: any) {
      error.value = err.message || "Failed to create product";
    } finally {
      loading.value = false;
    }
  };

  const updateProduct = async (
    id: string,
    updatedProduct: Partial<Product>,
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await productService.updateProduct(id, updatedProduct);
      // locally update the product in the store
      const index = products.value.findIndex((item) => item._id === id);
      if (index !== -1) {
        products.value[index] = data;
      }
    } catch (err: any) {
      error.value = err.message || "Failed to update product";
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    product,
    loading,
    error,
    getAllProducts,
    getProductById,
    removeProduct,
    addProduct,
    updateProduct,
  };
});
