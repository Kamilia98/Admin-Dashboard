<script setup lang="ts">
import { useProductStore } from '../stores/productStore';
import { capitalize, onMounted, ref, toRaw } from 'vue';
import Pagination from '../components/common/Pagination.vue';
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
import Modal from '../components/common/Modal.vue';

const headers = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'sku', label: 'SKU', sortable: true },
  { key: 'color', label: 'Color', sortable: false },
  { key: 'quantity', label: 'Quantity', sortable: false },
  { key: 'price', label: 'Original Price', sortable: true },
  { key: 'sale', label: 'Discount', sortable: true },
  { key: 'categories', label: 'Category', sortable: false },
];

const handleSort = ({
  key,
  direction,
}: {
  key: string;
  direction: 'asc' | 'desc';
}) => {
  productStore.sortBy = key;
  productStore.sortOrder = direction;

  console.log(
    'Sorting by:',
    productStore.sortBy,
    'in',
    productStore.sortOrder,
    'order',
  );

  productStore.getAllProducts();
};
onMounted(async () => {
  productStore.getAllProducts();
  fetchCategories();
  await productStore.getAllProducts();
  console.log('Products page mounted');
  / * * * Only Log purpose * * * /;
  console.log('Total Products:', productStore.totalProducts);
  const rawProducts = toRaw(productStore.products);
  console.log('Products page mounted');
  console.log('[Product-page -- products]', productStore);
  console.log('[Product-page -- productStore]', productStore);
  console.log('[Product-page -- Raw products]', rawProducts);
  console.log('[Product-page -- productStore]', productStore);
});

const productStore = useProductStore();

const categories = ref<{ _id: string }[]>([]);

const isCategoryAddModalOpen = ref(false);

const AddedCategoryName = ref('');
const AddedCategoryDescription = ref('');
const AddedCategoryImage = ref('');

const handleModalClose = () => {
  isCategoryAddModalOpen.value = false;
};

const handleModalSave = () => {
  isCategoryAddModalOpen.value = false;
};

const onAdd = () => {
  isCategoryAddModalOpen.value = true;
};
const loading = ref(false);

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
      <el-tab-pane label="Products">
        <div class="flex flex-col gap-8">
          <h1 class="mb-6 text-2xl font-bold">All Products</h1>

          <!-- Error message -->
          <div v-if="productStore.error" class="mb-4 text-red-500">
            {{ productStore.error }}
          </div>

          <Table
            caption="All Products"
            :headers="headers"
            :items="productStore.products"
            :loading="productStore.loading"
            rowKey="_id"
            @sort="handleSort"
          >
            <template #column-color="{ value }">
              <span
                class="inline-block h-5 w-5 rounded-full border border-gray-300"
                :style="{ backgroundColor: value }"
                :title="value"
              />
            </template>
            <template #column-sale="{ value }">
              <span v-if="value > 0" class="text-green-500">
                {{ value }}%
              </span>
              <span v-else class="text-red-500"> {{ value }}% </span>
            </template>
            <template #column-effectivePrice="{ value }">
              ${{ value }}
            </template>
          </Table>
          <Pagination
            title="Product Pagination"
            :current-page="productStore.currentPage"
            :total-pages="
              Math.ceil(productStore.totalProducts / productStore.pageSize)
            "
            :total-items="productStore.totalProducts"
            :limit="productStore.pageSize"
            @changePage="productStore.getAllProducts"
          />
        </div>
      </el-tab-pane>
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
              @click="onAdd"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <el-icon>
                <Plus />
              </el-icon>
              Add Category
            </button>
          </template>
        </Table>

        <template v-if="isCategoryAddModalOpen">
          <Modal @close="handleModalClose">
            <template #body>
              <!-- close btn -->

              <div class="flex flex-col gap-4">
                <h4
                  class="text-2xl font-semibold text-gray-800 dark:text-white/90"
                >
                  Edit Category
                </h4>
                <form class="flex flex-col gap-4">
                  <div
                    class="flex custom-scrollbar flex-col gap-4 overflow-y-auto"
                  >
                    <div>
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        v-model="AddedCategoryName"
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
                        v-model="AddedCategoryDescription"
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
                        uploadUrl="https://api.cloudinary.com/v1_1/dddhappm3/image/upload"
                      ></Dropzone>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 lg:justify-end">
                    <Button @click="handleModalClose">Close</Button>
                    <Button @click="handleModalSave">Submit</Button>
                  </div>
                </form>
              </div>
            </template>
          </Modal>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
