<script setup lang="ts">
import { capitalize, onMounted, ref } from 'vue';
import { ElIcon } from 'element-plus';
import { Edit, Delete, Plus, View } from '@element-plus/icons-vue';
import Table from '../components/common/Table.vue';
import Button from '../components/common/Button.vue';
import Modal from '../components/common/Modal.vue';
import Dropzone from './common/Dropzone.vue';
import type { Category } from '../types/category.d';
import {
  deleteCategory,
  getAllCategories,
  updateCategory,
  createCategory,
} from '../services/categoryService';

// State
const loading = ref(false);
const error = ref<string | null>(null);
const categories = ref<Category[]>([]);

// Modal States
const isCategoryAddModalOpen = ref(false);
const isCategoryEditModalOpen = ref(false);

// Form States
const formState = ref({
  add: {
    name: '',
    description: '',
    image: '',
  },
  edit: {
    id: '',
    name: '',
    description: '',
    image: '',
  },
});

// Reset form state
const resetFormState = (type: 'add' | 'edit') => {
  if (type === 'add') {
    formState.value.add = {
      name: '',
      description: '',
      image: '',
    };
  } else {
    formState.value.edit = {
      id: '',
      name: '',
      description: '',
      image: '',
    };
  }
};

// Modal Handlers
const handleAddModalClose = () => {
  isCategoryAddModalOpen.value = false;
  resetFormState('add');
};

const handleEditModalClose = () => {
  isCategoryEditModalOpen.value = false;
  resetFormState('edit');
};

// Form Validation
const validateForm = (type: 'add' | 'edit'): boolean => {
  const form = type === 'add' ? formState.value.add : formState.value.edit;
  if (!form.name || !form.image) {
    error.value = 'Please fill in all required fields.';
    return false;
  }
  return true;
};

// CRUD Operations
const handleAddModalSave = async () => {
  try {
    if (!validateForm('add')) return;

    const payload = {
      name: formState.value.add.name,
      description: formState.value.add.description,
      image: formState.value.add.image,
    };

    await createCategory(payload);
    await fetchCategories();
    handleAddModalClose();
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to create category';
    console.error('Failed to create category:', err);
  }
};

const handleEditModalSave = async () => {
  try {
    if (!validateForm('edit')) return;

    const payload = {
      name: formState.value.edit.name,
      description: formState.value.edit.description,
      image: formState.value.edit.image,
    };

    await updateCategory(formState.value.edit.id, payload);
    await fetchCategories();
    handleEditModalClose();
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to update category';
    console.error('Failed to update category:', err);
  }
};

const onEdit = (category: Category) => {
  formState.value.edit = {
    id: category._id,
    name: category.name,
    description: category.description,
    image: category.image,
  };
  isCategoryEditModalOpen.value = true;
};

const onDelete = async (id: string) => {
  const confirmed = confirm('Are you sure you want to delete this category?');
  if (!confirmed) return;

  try {
    await deleteCategory(id);
    await fetchCategories();
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to delete category';
    console.error('Failed to delete category:', err);
  }
};

const onAdd = () => {
  isCategoryAddModalOpen.value = true;
};

// Data Fetching
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
    error.value = err?.response?.data?.message || 'Failed to fetch categories';
    console.error('Failed to fetch categories:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="space-y-4">
    <!-- Error Alert -->
    <div v-if="error" class="rounded-lg bg-red-50 p-4 text-red-500">
      {{ error }}
    </div>

    <Table
      caption="Categories"
      :items="categories"
      :headers="[
        { key: 'name', label: 'Name', sortable: false },
        { key: 'image', label: 'Image', sortable: false },
        { key: 'productCount', label: 'Products', sortable: false },
        { key: 'actions', label: 'Actions', sortable: false },
      ]"
      :loading="loading"
    >
      <template #column-image="{ item }">
        <img
          :src="item.image"
          :alt="item.name"
          class="h-15 w-15 rounded-lg object-cover"
        />
      </template>

      <template #column-actions="{ item }">
        <div class="flex gap-2">
          <Button
            tag="router-link"
            :to="{
              name: 'category-details',
              params: { id: item._id },
            }"
          >
            <template #icon>
              <el-icon><View /></el-icon>
            </template>
          </Button>
          <Button variant="primary" @click="onEdit(item)">
            <template #icon>
              <el-icon><Edit /></el-icon>
            </template>
          </Button>
          <Button variant="danger" @click="onDelete(item._id)">
            <template #icon>
              <el-icon><Delete /></el-icon>
            </template>
          </Button>
        </div>
      </template>

      <template #actions>
        <button
          @click="onAdd"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          <el-icon><Plus /></el-icon>
          Add Category
        </button>
      </template>
    </Table>

    <!-- Edit Modal -->
    <Modal v-if="isCategoryEditModalOpen" @close="handleEditModalClose">
      <template #body>
        <div class="flex flex-col gap-4">
          <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Category
          </h4>
          <form
            class="flex flex-col gap-4"
            @submit.prevent="handleEditModalSave"
          >
            <div class="flex custom-scrollbar flex-col gap-4 overflow-y-auto">
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Name
                </label>
                <input
                  type="text"
                  v-model="formState.edit.name"
                  class="custom-input"
                  required
                />
              </div>

              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Description
                </label>
                <textarea
                  placeholder="Enter a description..."
                  v-model="formState.edit.description"
                  rows="3"
                  class="custom-input custom-scrollbar h-auto"
                ></textarea>
              </div>

              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Image
                </label>
                <Dropzone
                  v-model="formState.edit.image"
                  :initialImage="formState.edit.image"
                  uploadUrl="https://api.cloudinary.com/v1_1/dddhappm3/image/upload"
                />
              </div>
            </div>
            <div class="flex items-center gap-3 lg:justify-end">
              <Button @click="handleEditModalClose">Close</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!-- Add Modal -->
    <Modal v-if="isCategoryAddModalOpen" @close="handleAddModalClose">
      <template #body>
        <div class="flex flex-col gap-4">
          <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add Category
          </h4>
          <form
            class="flex flex-col gap-4"
            @submit.prevent="handleAddModalSave"
          >
            <div class="flex custom-scrollbar flex-col gap-4 overflow-y-auto">
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Name
                </label>
                <input
                  type="text"
                  v-model="formState.add.name"
                  class="custom-input"
                  required
                />
              </div>

              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Description
                </label>
                <textarea
                  placeholder="Enter a description..."
                  v-model="formState.add.description"
                  rows="3"
                  class="custom-input custom-scrollbar h-auto"
                ></textarea>
              </div>

              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Image
                </label>
                <Dropzone
                  v-model="formState.add.image"
                  uploadUrl="https://api.cloudinary.com/v1_1/dddhappm3/image/upload"
                />
              </div>
            </div>
            <div class="flex items-center gap-3 lg:justify-end">
              <Button @click="handleAddModalClose">Close</Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>
