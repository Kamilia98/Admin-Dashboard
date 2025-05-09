<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { BoxCubeIcon, OrdersIcon, MoneyIcon, AverageIcon } from '../../icons';
import { useOrdersStore } from '../../stores/orderStore';
import Card from '../common/Card.vue';

const store = useOrdersStore();

onMounted(async () => {
  await store.fetchOrderAnalytics();
});

const props = defineProps<{
  userId?: string;
}>();

onMounted(async () => {
  if (props.userId) store.userId = props.userId;
  await store.fetchOrderAnalytics(props.userId);
});

const averageOrderValue = computed(() => {
  return (
    store.totalOrders > 0 ? store.totalRevenue / store.totalOrders : 0
  ).toFixed(2);
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 md:gap-6">
    <Card title="Total Orders" :value="store.totalOrders" :icon="OrdersIcon" />
    <Card
      title="Total Sales"
      :value="`$${store.totalRevenue}`"
      :icon="MoneyIcon"
    />
    <Card
      title="Average Order Value"
      :value="`$${averageOrderValue}`"
      :icon="AverageIcon"
    />
  </div>
</template>
