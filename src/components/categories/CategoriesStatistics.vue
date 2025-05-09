<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  BoxCubeIcon,
  CategoriesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '../../icons';
import { useCategoryStore } from '../../stores/CategoryStore';
import Card from '../common/Card.vue';

const store = useCategoryStore();

onMounted(async () => {
  await store.getCategoriesAnalytics();
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 md:gap-6">
    <Card
      title="Total Categories"
      :value="store.totalCategories"
      :icon="CategoriesIcon"
    />
    <Card
      title="Top Selling Category"
      :value="`${store.bestSelled}`"
      :icon="ArrowUpIcon"
    />
    <Card
      title="Least Sold Category"
      :value="`${store.leastSelled}`"
      :icon="ArrowDownIcon"
    />
  </div>
</template>
