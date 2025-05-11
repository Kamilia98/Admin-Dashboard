<script setup lang="ts">
import { ref, toRaw, watch, onMounted } from 'vue';
import { useProductStore } from '../../stores/productStore';
import Table from '../common/Table.vue';
import Pagination from '../common/Pagination.vue';
import Button from '../common/Button.vue';
import FilterIcon from '../../icons/FilterIcon.vue';
import Search from '../common/Search.vue';
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElSelect,
  ElOption,
  ElInputNumber,
  ElIcon,
} from 'element-plus';
import { Edit, Delete, Plus, View, RefreshLeft } from '@element-plus/icons-vue';
import { useCategoryStore } from '../../stores/categoryStore';

const props = defineProps<{
  categoryId?: string;
}>();

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const selectedVariantIndex = ref<Record<string, number>>({});

const headers = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'colors', label: 'Colors', sortable: false },
  { key: 'quantity', label: 'Quantity', sortable: false },
  { key: 'price', label: 'Original Price', sortable: true },
  { key: 'sale', label: 'Discount', sortable: true },
  { key: 'categories', label: 'Category', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false },
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
  productStore.getAllProducts();
};

const handleResetFilters = () => {
  productStore.selectedCategories = [];
  productStore.minPrice = null;
  productStore.maxPrice = null;
  productStore.getAllProducts(1);
};

const handleDelete = async (id: string) => {
  await productStore.deleteProductById(id);
};

// React to categoryId prop
watch(
  () => props.categoryId,
  (newCategoryId) => {
    if (newCategoryId) {
      productStore.selectedCategories = [newCategoryId];
    } else {
      productStore.selectedCategories = [];
    }
    productStore.getAllProducts(1);
  },
  { immediate: true },
);

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

onMounted(() => {
  categoryStore.getCategories(1);
});

const selectVariant = (productId: string, index: number) => {
  selectedVariantIndex.value[productId] = index;
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <Table
      caption="Products"
      :headers="headers"
      :items="productStore.products"
      :loading="productStore.loading"
      rowKey="_id"
      @sort="handleSort"
    >
      <!-- Color Variant -->
      <template #column-colors="{ item }">
        <div class="flex items-center gap-2">
          <button
            v-for="(variant, index) in item.varients"
            :key="index"
            :aria-label="variant.color.name"
            class="relative h-6 w-6 rounded-full transition-all"
            :style="{ backgroundColor: variant.color.hex }"
            :class="{
              'ring-2 ring-blue-500': selectedVariantIndex[item._id] === index,
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
      </template>

      <!-- Quantity -->
      <template #column-quantity="{ item }">
        <div class="text-xs">
          <div v-if="item.varients[selectedVariantIndex[item._id]]">
            {{ item.varients[selectedVariantIndex[item._id]].color.name }}:
            {{ item.varients[selectedVariantIndex[item._id]].quantity }} in
            stock
          </div>
          <div v-else>N/A</div>
        </div>
      </template>

      <!-- Discount -->
      <template #column-sale="{ value }">
        <span :class="value > 0 ? 'text-green-500' : 'text-red-500'">
          {{ value }}%
        </span>
      </template>

      <!-- Actions -->
      <template #column-actions="{ item }">
        <div class="flex gap-2">
          <Button
            tag="router-link"
            :to="{ name: 'product-details', params: { id: item._id } }"
          >
            <template #icon
              ><ElIcon><View /></ElIcon
            ></template>
          </Button>
          <Button variant="primary">
            <template #icon
              ><ElIcon><Edit /></ElIcon
            ></template>
          </Button>
          <Button variant="danger" @click="handleDelete(item._id)">
            <template #icon
              ><ElIcon><Delete /></ElIcon
            ></template>
          </Button>
        </div>
      </template>

      <!-- Filter/Search -->
      <template #actions>
        <div class="flex items-center justify-end gap-4 md:gap-6">
          <Search
            @search="productStore.getAllProducts(1)"
            v-model="productStore.searchQuery"
          />

          <ElDropdown
            trigger="click"
            placement="top-start"
            :hide-on-click="false"
          >
            <Button>
              Filter
              <template #icon><FilterIcon /></template>
            </Button>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem disabled>
                  <div class="rounded-md bg-white p-4">
                    <!-- Category Filter -->
                    <div class="mb-2 flex items-center gap-2">
                      <label class="w-16">Category:</label>
                      <ElSelect
                        v-model="productStore.selectedCategories"
                        multiple
                        style="width: 240px"
                        :teleported="false"
                      >
                        <ElOption
                          v-for="cat in categoryStore.categories"
                          :key="cat._id"
                          :label="cat.name"
                          :value="cat._id"
                        />
                      </ElSelect>
                    </div>

                    <!-- Price Filter -->
                    <div class="mb-2 flex items-center gap-2">
                      <label class="w-16">Price:</label>
                      <ElInputNumber
                        :v-model="productStore.minPrice"
                        placeholder="Min"
                        :precision="2"
                      />
                      <span>to</span>
                      <ElInputNumber
                        :v-model="productStore.maxPrice"
                        placeholder="Max"
                        :precision="2"
                      />
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-center gap-2">
                      <Button
                        variant="primary"
                        @click="productStore.getAllProducts(1)"
                        >Apply Filters</Button
                      >
                      <Button variant="danger" @click="handleResetFilters">
                        Reset Filters
                        <template #icon
                          ><ElIcon><RefreshLeft /></ElIcon
                        ></template>
                      </Button>
                    </div>
                  </div>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
      </template>
    </Table>

    <!-- Pagination -->
    <Pagination
      title="products"
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
