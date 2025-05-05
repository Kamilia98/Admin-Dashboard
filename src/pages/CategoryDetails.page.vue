<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Button from '../components/common/Button.vue';

import { ElIcon } from 'element-plus';

import { Edit, Delete } from '@element-plus/icons-vue';

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
  console.log('Edit clicked', category.value?._id);
  // Navigate or show modal for editing
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
      <div class="relative p-6">
        <!-- Edit/Delete Buttons -->
        <div class="absolute top-6 right-6 flex gap-2">
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
              <h1
                class="mb-2 text-3xl font-bold text-gray-900 capitalize dark:text-gray-100"
              >
                {{ category.name }}
              </h1>
              <p class="max-w-lg text-gray-700 dark:text-gray-300">
                {{ category.description }}
              </p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- Total Products -->
              <div
                class="flex items-center gap-4 rounded-lg bg-indigo-100 p-6 shadow-sm dark:bg-indigo-900/30"
              >
                <div class="text-3xl text-indigo-600 dark:text-indigo-300">
                  📦
                </div>
                <div>
                  <p
                    class="text-lg font-semibold text-gray-800 dark:text-gray-100"
                  >
                    Total Products
                  </p>
                  <p
                    class="text-2xl font-bold text-indigo-800 dark:text-indigo-200"
                  >
                    {{ category.products.length }}
                  </p>
                </div>
              </div>

              <!-- Total Sales -->
              <div
                class="flex items-center gap-4 rounded-lg bg-green-100 p-6 shadow-sm dark:bg-green-900/30"
              >
                <div class="text-3xl text-green-600 dark:text-green-300">
                  💰
                </div>
                <div>
                  <p
                    class="text-lg font-semibold text-gray-800 dark:text-gray-100"
                  >
                    Total Sales
                  </p>
                  <p
                    class="text-2xl font-bold text-green-800 dark:text-green-200"
                  >
                    {{
                      category.products.reduce(
                        (total, p) =>
                          total +
                          (p.colors?.reduce(
                            (cSum, c) => cSum + c.quantity,
                            0,
                          ) || 0),
                        0,
                      )
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      ProductsManager
    </div>
  </div>
</template>

<style scoped>
.primary {
  color: #4f46e5;
}
</style>
