import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  deleteCategory,
  getAllCategories,
  updateCategory,
  createCategory,
  getCategoryById,
} from '../services/categoryService';
import type { Category } from '../types/category.d';

import { ElMessage } from 'element-plus';

const CATEGORY_LIMIT = 3;

export const useCategoryStore = defineStore('category', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref<string>('');
  const categories = ref<Category[]>([]);

  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalCategories = ref(0);
  const limits = ref(CATEGORY_LIMIT);

  const fetchCategories = async (page = currentPage.value) => {
    try {
      loading.value = true;
      error.value = null;

      const data = await getAllCategories({
        page,
        limit: limits.value,
        searchQuery: searchQuery.value,
      });

      currentPage.value = page;
      totalPages.value = data.totalPages;
      totalCategories.value = data.totalCategories;
      categories.value = data.categories;

    } catch (err: any) {
      error.value =
        err?.response?.data?.message || 'Failed to fetch categories';
      console.error('Failed to fetch categories:', err);
      ElMessage.error(error.value || 'An unknown error occurred');
    } finally {
      loading.value = false;
    }
  };

  const fetchCategoryById = async (id: string): Promise<Category | null> => {
    try {
      loading.value = true;
      error.value = null;
      return await getCategoryById(id);
    } catch (err) {
      console.error('[Fetch Order Error]:', err);
      error.value = err instanceof Error ? err.message : String(err);
      ElMessage.error(error.value || 'An unknown error occurred');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createCategoryHandler = async (categoryData: {
    name: string;
    description: string;
    image: string;
  }) => {
    try {
      loading.value = true;
      error.value = null;
      await createCategory(categoryData);
      await fetchCategories(1);
      ElMessage.success('Category created successfully!');
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to create category';
      console.error('Failed to create category:', err);
      ElMessage.error(error.value || 'An unknown error occurred');
    } finally {
      loading.value = false;
    }
  };

  const updateCategoryHandler = async (
    id: string,
    categoryData: { name: string; description: string; image: string },
  ) => {
    try {
      loading.value = true;
      error.value = null;
      await updateCategory(id, categoryData);
      await fetchCategories();
      ElMessage.success('Category updated successfully!');
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to update category';
      console.error('Failed to update category:', err);
      ElMessage.error(error.value || 'An unknown error occurred');
    } finally {
      loading.value = false;
    }
  };

  const deleteCategoryHandler = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;
      await deleteCategory(id);
      await fetchCategories();
      ElMessage.success('Category deleted successfully!');
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to delete category';
      console.error('Failed to delete category:', err);
      ElMessage.error(error.value || 'An unknown error occurred');
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    searchQuery,
    categories,
    currentPage,
    totalPages,
    totalCategories,
    CATEGORY_LIMIT,
    fetchCategories,
    fetchCategoryById,
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
  };
});
