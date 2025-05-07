<script setup lang="ts">
/* ========== Imports ========== */
import OrderStatistics from '../components/orders/OrderStatistics.vue';
import OrdersManager from '../components/orders/OrderManager.vue';
import Pagination from '../components/common/Pagination.vue';

import { useOrdersStore } from '../stores/orderStore';

/* ========== Store ========== */
const store = useOrdersStore();

</script>

<template>
  <div class="flex flex-col gap-8">
    <OrderStatistics />
    <OrdersManager />
   
  </div>
</template>
