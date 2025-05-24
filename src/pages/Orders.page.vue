<script setup lang="ts">
/* ========== Imports ========== */
import OrderStatistics from '../components/orders/OrderStatistics.vue';
import OrdersManager from '../components/orders/OrderManager.vue';
</script>

<template>
  <div class="flex flex-col gap-8">
    <OrderStatistics />
    <OrdersManager />
  </div>
</template>
