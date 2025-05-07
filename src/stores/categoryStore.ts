import { defineStore } from 'pinia';
import { capitalize, ref } from 'vue';
import {
  deleteCategory,
  getAllCategories,
  updateCategory,
  createCategory,
  getCategoryById,
} from '../services/categoryService';
import type { Category } from '../types/category.d';

export const useCategoryStore = defineStore('category', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const categories = ref<Category[]>([]);

  const fetchCategories = async () => {
    try {
      loading.value = true;
      error.value = null;
      const data = await getAllCategories();
      categories.value = data.map((cat: Category) => ({
        ...cat,
        name: capitalize(cat.name),
      }));
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || 'Failed to fetch categories';
      console.error('Failed to fetch categories:', err);
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
      await fetchCategories();
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to create category';
      console.error('Failed to create category:', err);
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
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to update category';
      console.error('Failed to update category:', err);
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
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to delete category';
      console.error('Failed to delete category:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    categories,
    fetchCategories,
    fetchCategoryById,
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
  };
});
