<script setup lang="ts">
import { useProductStore } from '../stores/productStore';
import { onMounted, toRaw } from 'vue';
import Pagination from '../components/common/Pagination.vue';
import { ElTabs, ElTabPane } from 'element-plus';

import Table from '../components/common/Table.vue';
import Button from '../components/common/Button.vue';
import Categories from '../components/Categories.vue';

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
      <el-tab-pane label="Categories">
        <Categories />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
