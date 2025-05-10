import { defineStore } from 'pinia';
import type { Product } from '../types/product';
import type {
  productVariant,
  ProductApiResponse,
} from '../types/product-varient';
import * as productService from '../services/productService';
import { ref } from 'vue';

export const useProductStore = defineStore('productStore', () => {
  // States
  const products = ref<productVariant[]>([]);
  const totalProducts = ref(0);
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const sortBy = ref('');
  const sortOrder = ref<'asc' | 'desc'>('asc');

  // 💡 New Filter States
  const selectedCategories = ref<string[]>([]);
  const minPrice = ref<number | null>(null);
  const maxPrice = ref<number | null>(null);

  // Actions
  const getAllProducts = async (page = currentPage.value) => {
    loading.value = true;
    try {
      const response: ProductApiResponse =
        await productService.fetchAllProducts(
          page,
          pageSize.value,
          sortBy.value,
          sortOrder.value,
          {
            categories: selectedCategories.value,
            minPrice: minPrice.value,
            maxPrice: maxPrice.value,
          },
        );

      products.value = response.data.products;
      totalProducts.value = response.data.totalProducts;
      currentPage.value = page;
      console.log('[product-Store -- Sorting]', sortBy.value, sortOrder.value);
      console.log('[Product store -- totalProducts]', data.totalProducts);
      console.log('[Product store -- all variants]', products.value);
      // return data.products;

      console.log('[Product store -- filters]', {
        categories: selectedCategories.value,
        minPrice: minPrice.value,
        maxPrice: maxPrice.value,
      });
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products';
    } finally {
      loading.value = false;
    }
  };

  const getProductById = async (id: string) => {
    loading.value = true;
    try {
      const { data } = await productService.fetchProductById(id);
      product.value = data.product;
      return data.product;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch product';
    } finally {
      loading.value = false;
    }
  };

  const deleteProductById = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      await getAllProducts(currentPage.value); // Refresh list after deletion
    } catch (err: any) {
      console.error('Delete error:', err);
      error.value = 'Failed to delete product.';
    }
  };
  const addProduct = async (newProduct: Product) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await productService.addProduct(newProduct);
      getAllProducts(1);
      // products.value.push(response.data.data);
      console.log('[Product added]', response.data.data);
    } catch (err: any) {
      console.error('Add product error:', err);
      error.value = err.response?.data?.message || 'Failed to add product.';
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
      error.value = err.message || 'Failed to update product';
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    totalProducts,
    product,
    loading,
    error,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    selectedCategories,
    minPrice,
    maxPrice,
    getAllProducts,
    getProductById,
    deleteProductById,
    addProduct,
    updateProduct,
  };
});
