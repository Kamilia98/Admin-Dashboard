<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Button from '../components/common/Button.vue';
import Dropzone from '../components/common/Dropzone.vue';

import { ElIcon } from 'element-plus';

import { Edit, Delete } from '@element-plus/icons-vue';
import { BoxCubeIcon } from '../icons';
import Card from '../components/common/Card.vue';
import Modal from '../components/common/Modal.vue';

interface Color {
  name: string;
  hex: string;
  images: Array<{
    url: string;
    public_id: string;
    _id: string;
  }>;
  quantity: number;
  sku?: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  colors: Color[];
  description: string;
  price: number;
  sale: number;
  subtitle: string;
  additionalInformation: {
    general: {
      salesPackage: string;
      modelNumber: string;
      configuration: string;
      upholsteryMaterial: string;
      upholsteryColor: string;
    };
    dimensions: {
      width: number;
      height: number;
      depth: number;
      seatHeight: number;
      legHeight: number;
    };
  };
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

const route = useRoute();
const category = ref<Category | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const editedCategoryName = ref('');
const editedCategoryDescription = ref('');
const editedCategoryImage = ref('');

const isCategoryEditModalOpen = ref(false);

onMounted(async () => {
  const id = route.params.id as string;
  await fetchCategoryDetails(id);
});

const fetchCategoryDetails = async (id: string) => {
  try {
    loading.value = true;
    const { data } = await axios.get(`http://localhost:5000/categories/${id}`);
    category.value = data.data.category;
  } catch (err) {
    error.value = 'Failed to fetch category details';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const onEdit = () => {
  if (category.value) {
    editedCategoryName.value = category.value.name;
    editedCategoryDescription.value = category.value.description;
    editedCategoryImage.value = category.value.image;
    isCategoryEditModalOpen.value = true;
  }
};

const handleModalClose = () => {
  isCategoryEditModalOpen.value = false;
};

const handleModalSave = async () => {
  if (!category.value) return;

  try {
    const updatedCategory = {
      name: editedCategoryName.value,
      description: editedCategoryDescription.value,
      image: editedCategoryImage.value,
    };

    const { data } = await axios.patch(
      `http://localhost:5000/categories/${category.value._id}`,
      updatedCategory,
    );

    category.value = data.data.category;
    isCategoryEditModalOpen.value = false;
  } catch (err) {
    console.error('Failed to update category:', err);
  }
};

const onDelete = async () => {
  if (!category.value) return;
  const confirmed = confirm('Are you sure you want to delete this category?');
  if (confirmed) {
    try {
      await axios.delete(
        `http://localhost:5000/categories/${category.value._id}`,
      );
      alert('Category deleted successfully');
      // Possibly redirect or update the UI
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category');
    }
  }
};
</script>

<template>
  <div class="text-gray-800 dark:text-gray-100">
    <!-- Loading State -->
    <div v-if="loading" class="flex min-h-[400px] items-center justify-center">
      <div
        class="border-t-primary border-b-primary h-12 w-12 animate-spin rounded-full border-4 border-r-transparent border-l-transparent dark:border-t-indigo-400 dark:border-b-indigo-400"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="py-8 text-center text-red-500 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- Content -->
    <div
      v-else-if="category"
      class="space-y-8 rounded-lg bg-white dark:bg-white/[0.03]"
    >
      <!-- Category Header -->
      <div class="p-6">
        <!-- Edit/Delete Buttons -->

        <div class="flex flex-col gap-6 md:flex-row">
          <div class="md:w-1/3">
            <img
              :src="
                category.image ||
                'https://via.placeholder.com/300x300?text=No+Image'
              "
              :alt="category.name"
              class="h-64 w-full rounded-lg object-cover"
            />
          </div>
          <div class="flex flex-col justify-between gap-4 md:w-2/3">
            <div>
              <div class="mb-2 flex justify-between">
                <h1
                  class="text-3xl font-bold text-gray-900 capitalize dark:text-gray-100"
                >
                  {{ category.name }}
                </h1>

                <div class="flex gap-2">
                  <Button variant="primary" @click="onEdit">
                    Edit
                    <template #icon>
                      <el-icon>
                        <Edit />
                      </el-icon>
                    </template>
                  </Button>
                  <Button variant="danger" @click="onDelete">
                    Delete
                    <template #icon>
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </template>
                  </Button>
                </div>
              </div>
              <p class="max-w-lg text-gray-700 dark:text-gray-300">
                {{ category.description }}
              </p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
              <Card title="Products" value="5" :icon="BoxCubeIcon" />
              <Card title="Sales" value="5" :icon="BoxCubeIcon" />
            </div>
          </div>
        </div>
      </div>

      ProductsManager
    </div>
  </div>

  <template v-if="isCategoryEditModalOpen">
    <Modal @close="handleModalClose">
      <template #body>
        <!-- close btn -->

        <div class="flex flex-col gap-4">
          <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Category
          </h4>
          <form class="flex flex-col gap-4">
            <div class="flex custom-scrollbar flex-col gap-4 overflow-y-auto">
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Name
                </label>
                <input
                  type="text"
                  v-model="editedCategoryName"
                  class="custom-input"
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
                  v-model="editedCategoryDescription"
                  rows="6"
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
                  :initialImage="category?.image"
                  uploadUrl="https://api.cloudinary.com/v1_1/dddhappm3/image/upload"
                ></Dropzone>
              </div>
            </div>
            <div class="flex items-center gap-3 lg:justify-end">
              <Button @click="handleModalClose">Close</Button>
              <Button @click="handleModalSave">Save Changes</Button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </template>
</template>

<style scoped>
.primary {
  color: #4f46e5;
}
</style>
