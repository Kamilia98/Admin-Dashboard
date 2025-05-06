<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { BoxCubeIcon } from '../../icons';
import { useOrdersStore } from '../../stores/orderStore';
import Card from '../common/Card.vue';

const store = useOrdersStore();

onMounted(() => {
  store.fetchOrderAnalytics();
});

const averageOrderValue = computed(() => {
  return (
    store.totalOrders > 0 ? store.totalRevenue / store.totalOrders : 0
  ).toFixed(2);
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 md:gap-6">
    <Card title="Orders" :value="store.totalOrders" :icon="BoxCubeIcon" />
    <Card
      title="Total Revenue"
      :value="`$${store.totalRevenue.toFixed(2)}`"
      :icon="BoxCubeIcon"
    />
    <Card
      title="Average Order Value"
      :value="`$${averageOrderValue}`"
      :icon="BoxCubeIcon"
    />
  </div>
</template>
