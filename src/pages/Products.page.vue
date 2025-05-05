<script setup lang="ts">
import { useProductStore } from '../stores/productStore';
import { capitalize, onMounted, ref } from 'vue';
import {
  ElTabs,
  ElTabPane,
  ElIcon,
  ElButton,
  ElButtonGroup,
} from 'element-plus';

import { Edit, Delete, Plus, View } from '@element-plus/icons-vue';
import axios from 'axios';
import Table from '../components/common/Table.vue';
import { FilterIcon } from '../icons';
import Button from '../components/common/Button.vue';
import { router } from '../router';

const productStore = useProductStore();

const categories = ref<{ _id: string }[]>([]);
const loading = ref(false);

onMounted(() => {
  productStore.getAllProducts();
  console.log('Products page mounted');
  console.log('[Product-page -- products]', productStore);

  fetchCategories();
});

interface Category {
  name: string;
}

const fetchCategories = async () => {
  loading.value = true;
  const { data } = await axios.get('http://localhost:5000/categories');
  categories.value = data.data.categories.map((cat: Category) => ({
    ...cat,
    name: capitalize(cat.name),
  }));
  console.log(data.data.categories);
  loading.value = false;
};
</script>
<template>
  <div class="">
    <el-tabs type="border-card">
      <el-tab-pane label="Products"
        ><h1 class="mb-6 text-2xl font-bold">All Products</h1>

        <!-- Loading message -->
        <div v-if="productStore.loading" class="text-gray-500">
          Loading products...
        </div>

        <!-- Error message -->
        <div v-if="productStore.error" class="text-red-500">
          {{ productStore.error }}
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            v-for="prod in productStore.products"
            :key="prod._id"
            class="rounded border p-4 shadow transition hover:shadow-lg"
          >
            <h2 class="mb-2 text-xl font-semibold">{{ prod.name }}</h2>
            <p class="mb-2 text-gray-700">{{ prod.description }}</p>
            <p class="font-bold">Price: ${{ prod.price }}</p>
          </div>
        </div></el-tab-pane
      >
      <el-tab-pane label="Categories"
        ><Table
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
              alt=""
              class="h-15 w-15 rounded-lg object-cover"
            />
          </template>

          <template #column-actions="{ item }">
            <div class="flex gap-2">
              <Button
                @click="
                  router.push({
                    name: 'category-details',
                    params: {
                      id: item._id,
                    },
                  })
                "
              >
                <template #icon>
                  <el-icon>
                    <View />
                  </el-icon>
                </template>
              </Button>
              <Button variant="primary">
                <template #icon>
                  <el-icon>
                    <Edit />
                  </el-icon>
                </template>
              </Button>
              <Button variant="danger">
                <template #icon>
                  <el-icon>
                    <Delete />
                  </el-icon>
                </template>
              </Button>
            </div>
          </template>

          <template #actions>
            <button
              class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <el-icon>
                <Plus />
              </el-icon>
              Add Category
            </button>
          </template>
        </Table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
