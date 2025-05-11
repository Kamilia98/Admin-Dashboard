<script setup lang="ts">
import { onMounted } from 'vue';
import {
  OrdersIcon,
  MoneyIcon,
  AverageIcon,
  ProductsIcon,
  ArrowUpIcon,
  LowStockIcon,
} from '../../icons';
import Card from '../common/Card.vue';
import { useProductStore } from '../../stores/productStore';

const store = useProductStore();

onMounted(async () => {
  await store.getProductsAnalytics();
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 md:gap-6">
    <Card
      title="Total Products"
      :value="store.AnaylticsTotalProducts"
      :icon="ProductsIcon"
    />
    <Card
      title="Low Stock Count"
      :value="store.lowStockCount"
      :icon="LowStockIcon"
    />
    <Card
      title="Top Selling Product"
      :value="store.bestSellingProductName"
      :icon="ArrowUpIcon"
    />
  </div>
</template>
