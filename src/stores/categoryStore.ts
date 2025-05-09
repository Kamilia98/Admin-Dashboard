import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

import {
  fetchCategories,
  fetchCategory,
  fetchCategoriesAnalytics,
  deleteCategory,
  updateCategory,
  createCategory,
} from '../services/categoryService';

import type { Category } from '../types/category.d';

const CATEGORY_LIMIT = 3;

export const useCategoryStore = defineStore('category', () => {
  const router = useRouter();

  // State
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');
  const categories = ref<Category[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalFilteredCategories = ref(0);
  const totalCategories = ref(0);
  const bestSelled = ref('');
  const leastSelled = ref('');
  const limits = ref(CATEGORY_LIMIT);
  const sortBy = ref('createdAt');
  const sortOrder = ref<'asc' | 'desc'>('desc');
  const isCategoryEditModalOpen = ref(false);
  const isCategoryAddModalOpen = ref(false);

  const formState = ref<{
    add: { name: string; description: string; image: string };
    edit: { id: string; name: string; description: string; image: string };
  }>({
    add: { name: '', description: '', image: '' },
    edit: { id: '', name: '', description: '', image: '' },
  });

  // Utility
  const resetForm = (type: 'add' | 'edit') => {
    if (type === 'add') {
      formState.value.add = { name: '', description: '', image: '' };
    } else {
      formState.value.edit = { id: '', name: '', description: '', image: '' };
    }
  };

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    loading.value = true;
    error.value = null;
    try {
      return await fn();
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || 'An error occurred';
      ElMessage.error(error.value || 'An unknown error occurred');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Validation
  const isFormValid = (type: 'add' | 'edit') => {
    const form = formState.value[type];
    return !!form.name && !!form.image;
  };

  // Modal handlers
  const openEditModal = (cat: Category) => {
    formState.value.edit = {
      id: cat._id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
    };
    isCategoryEditModalOpen.value = true;
  };

  const closeEditModal = () => {
    isCategoryEditModalOpen.value = false;
    resetForm('edit');
  };

  const closeAddModal = () => {
    isCategoryAddModalOpen.value = false;
    resetForm('add');
  };

  const saveEdit = async () => {
    if (!isFormValid('edit')) return;

    await updateCategoryHandler(formState.value.edit.id, {
      name: formState.value.edit.name,
      description: formState.value.edit.description,
      image: formState.value.edit.image,
    });

    closeEditModal();
  };

  const saveAdd = async () => {
    if (!isFormValid('add')) return;

    await createCategoryHandler({
      name: formState.value.add.name,
      description: formState.value.add.description,
      image: formState.value.add.image,
    });

    closeAddModal();
  };

  // CRUD operations
  const getCategories = async (page = currentPage.value) =>
    withLoading(async () => {
      const data = await fetchCategories({
        page,
        limit: limits.value,
        searchQuery: searchQuery.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
      });
      currentPage.value = page;
      totalPages.value = data.totalPages;
      totalFilteredCategories.value = data.totalCategories;
      categories.value = data.categories;
    });

  const getCategory = async (id: string): Promise<Category | null> =>
    await withLoading(async () => {
      return await fetchCategory(id);
    });

  const getCategoriesAnalytics = async () => {
    try {
      const data = await fetchCategoriesAnalytics();
      console.log(data);
      totalCategories.value = data.totalCategories;
      bestSelled.value = data.mostSalledCategory.name;
      leastSelled.value = data.leastSalledCategory.name;
    } catch (err) {
      console.error('[Analytics Error]:', err);
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    }
  };

  const createCategoryHandler = async (categoryData: {
    name: string;
    description: string;
    image: string;
  }) =>
    withLoading(async () => {
      await createCategory(categoryData);
      await getCategories(1);
      ElMessage.success('Category created successfully!');
    });

  const updateCategoryHandler = async (
    id: string,
    categoryData: { name: string; description: string; image: string },
  ) =>
    withLoading(async () => {
      await updateCategory(id, categoryData);
      await getCategories();
      ElMessage.success('Category updated successfully!');
    });

  const deleteCategoryHandler = async (id: string) =>
    withLoading(async () => {
      await deleteCategory(id);
      await getCategories(1);
      ElMessage.success('Category deleted successfully!');
    });

  const confirmDelete = async (id: string) => {
    try {
      await ElMessageBox.confirm(
        'Are you sure you want to delete this category?',
        'Confirm Deletion',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
          confirmButtonClass: 'el-button--danger el-button--plain',
        },
      );

      await deleteCategoryHandler(id);
      router.push({ name: 'categories' });
    } catch {
      // Cancelled
    }
  };

  const handleSort = ({
    key,
    direction,
  }: {
    key: string;
    direction: 'asc' | 'desc';
  }) => {
    sortBy.value = key;
    sortOrder.value = direction;
    getCategories(1);
  };

  return {
    // state
    loading,
    error,
    searchQuery,
    categories,
    currentPage,
    totalPages,
    totalFilteredCategories,
    totalCategories,
    bestSelled,
    leastSelled,
    limits,
    CATEGORY_LIMIT,

    // modal & form state
    isCategoryEditModalOpen,
    isCategoryAddModalOpen,
    formState,

    // modal actions
    openEditModal,
    closeEditModal,
    closeAddModal,
    saveEdit,
    saveAdd,

    // handlers
    getCategories,
    getCategory,
    getCategoriesAnalytics,
    confirmDelete,
    handleSort,
  };
});
