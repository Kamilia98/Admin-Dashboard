<script setup lang="ts">
import { useProductStore } from '../stores/productStore';
import { onMounted, toRaw } from 'vue';

import Pagination from '../components/Pagination.vue';
import Search from '../components/Search.vue';
import Table from '../components/Table.vue';

const headers = [
  { key: 'name', label: 'Name', sortable: false },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'price', label: 'Price', sortable: false },
];

const productStore = useProductStore();
onMounted(() => {
  productStore.getAllProducts();
  console.log('Products page mounted');
  const rawProducts = toRaw(productStore.products);
  console.log('[Product-page -- Raw products]', rawProducts);
  console.log('[Product-page -- products]', productStore);
});
</script>
<template>
  <div class="p-8">
    <h1 class="mb-6 text-2xl font-bold">All Products</h1>

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
        <!-- <h2 class="mb-2 text-xl font-semibold">{{ prod.name }}</h2> -->
        <p class="mb-2 text-gray-700">{{ prod.mainColor }}</p>
        <!-- <p class="font-bold">Price: ${{ prod.price }}</p> -->
      </div>
    </div>
  </div>
</template>
