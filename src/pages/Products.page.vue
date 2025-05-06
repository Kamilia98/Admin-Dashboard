<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';

import { useProductStore } from '../stores/productStore';
// Components
import Table from '../components/common/Table.vue';
import Pagination from '../components/common/Pagination.vue';
import Button from '../components/common/Button.vue';
import Categories from '../components/Categories.vue';

const headers = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'colors', label: 'Colors', sortable: false },
  { key: 'quantity', label: 'Quantity', sortable: false },
  { key: 'price', label: 'Original Price', sortable: true },
  { key: 'sale', label: 'Discount', sortable: true },
  { key: 'categories', label: 'Category', sortable: false },
];

const selectedVariantIndex = ref<Record<string, number>>({});

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
  const rawProducts = toRaw(productStore.products);
  console.log('Products:', rawProducts);
  productStore.products.forEach((product) => {
    selectedVariantIndex.value[product._id] = 0; // Default to the first variant
  });
});

const selectVariant = (productId: string, index: number) => {
  selectedVariantIndex.value[productId] = index;
};

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
            <template #column-colors="{ item }">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <button
                    v-for="(variant, index) in item.varients"
                    :key="index"
                    :aria-label="variant.color.name"
                    class="relative h-6 w-6 rounded-full transition-all duration-200 focus:outline-none"
                    :style="{ backgroundColor: variant.color.hex }"
                    :class="{
                      'ring-2 ring-black':
                        selectedVariantIndex[item._id] === index,
                      'border border-gray-300':
                        selectedVariantIndex[item._id] !== index,
                    }"
                    @click="selectVariant(item._id, index)"
                  >
                    <span
                      v-if="selectedVariantIndex[item._id] === index"
                      class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white"
                    >
                      ✓
                    </span>
                  </button>
                </div>

                <!-- Selected info: Dynamically shows the selected variant -->
                <div
                  v-if="item.varients[selectedVariantIndex[item._id]]"
                  class="text-xs text-gray-600"
                >
                  {{
                    item.varients[selectedVariantIndex[item._id]].color.name
                  }}:
                  {{
                    item.varients[selectedVariantIndex[item._id]].quantity
                  }}
                  in stock
                </div>
              </div>
            </template>

            <template #column-quantity="{ item }">
              <span>
                {{
                  selectedVariantIndex[item._id] !== undefined &&
                  item.varients[selectedVariantIndex[item._id]]
                    ? item.varients[selectedVariantIndex[item._id]].quantity
                    : 'N/A'
                }}
              </span>
            </template>

            <template #column-sale="{ value }">
              <span v-if="value > 0" class="text-green-500">
                {{ value }}%
              </span>
              <span v-else class="text-red-500">{{ value }}%</span>
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
