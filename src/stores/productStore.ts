import { defineStore } from 'pinia';
import type { Product } from '../types/product';
import type {
  productVariant,
  ProductApiResponse,
} from '../types/product-varient';
import * as productService from '../services/productService';
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { router } from '../router';

export const useProductStore = defineStore('productStore', () => {
  // States
  const products = ref<productVariant[]>([]);
  const totalProducts = ref(0);
  const searchQuery = ref<string>('');
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

  const AnaylticsTotalProducts = ref(0);
  const lowStockCount = ref(0);
  const bestSellingProductName = ref('');

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
          searchQuery.value,
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

  // const deleteProductById = async (id: string) => {
  //   try {
  //     await productService.deleteProduct(id);
  //     await getAllProducts(currentPage.value);
  //   } catch (err: any) {
  //     console.error('Delete error:', err);
  //     error.value = 'Failed to delete product.';
  //   }
  // };

  const deleteProductById = async (id: string) => {
    try {
      await ElMessageBox.confirm(
        'Are you sure you want to delete this product?',
        'Confirm Deletion',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
          confirmButtonClass: 'el-button--danger el-button--plain',
        },
      );

      await productService.deleteProduct(id);
      ElMessage.success('Product deleted successfully!');
      await getAllProducts(currentPage.value);

      setTimeout(() => {
        router.push({ name: 'products' });
      }, 500);
    } catch (err) {
      // cancel
      console.error('Delete failed:', err);
      // ElMessage.error('Failed to delete this product');
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

      const updated = data.data;

      const index = products.value.findIndex((item) => item._id === id);
      if (index !== -1) {
        products.value[index] = updated;
      }
      console.log('[Product-service--updated-product]', updateProduct);

      ElMessage.success('Product updated successfully!');
    } catch (err: any) {
      console.error('Update error:', err);
      error.value = err.response?.data?.message || 'Failed to update product';
    } finally {
      loading.value = false;
    }
  };

  const getProductsAnalytics = async () => {
    try {
      const { data } = await productService.fetchProductAnalytics();

      AnaylticsTotalProducts.value = data.data.totalProducts;
      lowStockCount.value = data.data.lowStockCount;
      bestSellingProductName.value = data.data.bestSellingProduct.name;
    } catch (err) {
      error.value =
        (err instanceof Error ? err.message : 'Unknown error') ||
        'Failed to get anayltics ';
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
    searchQuery,
    AnaylticsTotalProducts,
    lowStockCount,
    bestSellingProductName,
    getAllProducts,
    getProductById,
    getProductsAnalytics,
    deleteProductById,
    addProduct,
    updateProduct,
  };
});
