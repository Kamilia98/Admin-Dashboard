<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { ElIcon } from 'element-plus';
import { useProductStore } from '../stores/productStore';
// Components
import Table from '../components/common/Table.vue';
import Pagination from '../components/common/Pagination.vue';
import Button from '../components/common/Button.vue';
import Categories from '../components/Categories.vue';
import FilterIcon from '../icons/FilterIcon.vue';
import { Edit, Delete, Plus, View } from '@element-plus/icons-vue';
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';
import PlusIcon from '../icons/PlusIcon.vue';
import Search from './common/Search.vue';
import { watch } from 'vue';

const headers = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'colors', label: 'Colors', sortable: false },
  { key: 'quantity', label: 'Quantity', sortable: false },
  { key: 'price', label: 'Original Price', sortable: true },
  { key: 'sale', label: 'Discount', sortable: true },
  { key: 'categories', label: 'Category', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false },
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

const handleResetFilters = () => {
  productStore.selectedCategories = [];
  productStore.minPrice = null;
  productStore.maxPrice = null;
  productStore.getAllProducts(1);
};

onMounted(async () => {
  await productStore.getAllProducts();
  console.log('Products page mounted');
  const rawProducts = toRaw(productStore.products);
  console.log('Products:', rawProducts);
});

const productStore = useProductStore();
watch(
  () => productStore.products,
  (newProducts) => {
    newProducts.forEach((product) => {
      if (!(product._id in selectedVariantIndex.value)) {
        selectedVariantIndex.value[product._id] = 0;
      }
    });
  },
  { immediate: true },
);
const selectVariant = (productId: string, index: number) => {
  selectedVariantIndex.value[productId] = index;
};
</script>
<template>
  <div class="flex flex-col gap-8">
    <!-- <h1 class="mb-6 text-2xl font-bold">All Products</h1> -->

    <!-- Error message -->
    <!-- <div v-if="productStore.error" class="mb-4 text-red-500">
      {{ productStore.error }}
    </div> -->
    <div class="flex flex-col gap-4">
      <div class="flex justify-end">
        <Button>
          <template #icon>
            <el-icon>
              <Plus />
            </el-icon>
          </template>
          Add Product
        </Button>
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
                  'ring-2 ring-blue-500 ring-offset-1':
                    selectedVariantIndex[item._id] === index,
                  'border-2 border-gray-400':
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
          </div>
        </template>

        <template #column-quantity="{ item }">
          <div class="flex flex-col text-xs">
            <div v-if="item.varients[selectedVariantIndex[item._id]]">
              {{ item.varients[selectedVariantIndex[item._id]].color.name }}:
              {{ item.varients[selectedVariantIndex[item._id]].quantity }}
              in stock
            </div>
            <div v-else>N/A</div>
          </div>
        </template>

        <template #column-sale="{ value }">
          <span v-if="value > 0" class="text-green-500"> {{ value }}% </span>
          <span v-else class="text-red-500">{{ value }}%</span>
        </template>

        <template #column-effectivePrice="{ value }"> ${{ value }} </template>
        <template #column-actions="{ item }">
          <div class="flex gap-2">
            <Button
              tag="router-link"
              :to="{
                name: 'category-details',
                params: {
                  id: item._id,
                },
              }"
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
          <div class="flex items-center justify-end gap-4 md:gap-6">
            <!-- Search Input -->
            <Search @search="productStore.getAllProducts(1)" />

            <!-- Filter Dropdown -->
            <el-dropdown
              placement="top-start"
              trigger="click"
              :hide-on-click="false"
            >
              <Button>
                Filter
                <template #icon>
                  <FilterIcon />
                </template>
              </Button>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item disabled>
                    <div class="rounded-md bg-white dark:bg-gray-900">
                      <div
                        class="flex max-w-[450px] flex-col gap-4 bg-white/[0.03] p-4"
                      >
                        <!-- Category Filter -->
                        <div class="flex items-center gap-1">
                          <label class="w-16 dark:text-white/90"
                            >Category:</label
                          >
                          <el-select
                            v-model="productStore.selectedCategories"
                            multiple
                            style="width: 240px"
                            :teleported="false"
                            class="bg-white/[0.03]"
                          >
                            <el-option
                              v-for="cat in [
                                'Electronics',
                                'Furniture',
                                'Clothing',
                                'Books',
                              ]"
                              :key="cat"
                              :label="cat"
                              :value="cat"
                            />
                          </el-select>
                        </div>

                        <!-- Price Range Filter -->
                        <div class="flex items-center gap-2">
                          <label class="w-16 dark:text-white/90">Price:</label>
                          <el-input-number
                            v-model="productStore.minPrice"
                            placeholder="Min"
                            :precision="2"
                          />
                          <span class="dark:text-white/90">to</span>
                          <el-input-number
                            v-model="productStore.maxPrice"
                            placeholder="Max"
                            :precision="2"
                          />
                        </div>

                        <!-- Buttons -->
                        <div class="flex gap-2 self-center">
                          <Button
                            @click="productStore.getAllProducts(1)"
                            variant="primary"
                          >
                            Apply Filters
                          </Button>
                          <Button @click="handleResetFilters" variant="danger">
                            Reset Filters
                            <template #icon>
                              <el-icon>
                                <RefreshLeft />
                              </el-icon>
                            </template>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- Add Product -->
          </div>
        </template>
      </Table>
    </div>

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
</template>
