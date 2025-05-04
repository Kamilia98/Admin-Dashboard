<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { BoxCubeIcon } from '../../icons';
import { useOrdersStore } from '../../stores/orderStore';

const store = useOrdersStore();

onMounted(() => {
  store.fetchOrderAnalytics();
});

const averageOrderValue = computed(() => {
  return store.totalOrders > 0 ? store.totalRevenue / store.totalOrders : 0;
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 md:gap-6">
    <!-- Orders Analytics Card -->
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
      >
        <BoxCubeIcon />
      </div>

      <div class="mt-5 flex items-end justify-between">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Orders</span>
          <h4
            class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90"
          >
            {{ store.totalOrders }}
          </h4>
        </div>
        <!-- <span
          class="flex items-center gap-1 rounded-full bg-error-50 py-0.5 pr-2.5 pl-2 text-sm font-medium text-error-600 dark:bg-error-500/15 dark:text-error-500"
        >
          <el-icon><Bottom /></el-icon> 9.05%
        </span> -->
      </div>
    </div>

    <!-- Total Revenue Analytics Card -->
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
      >
        <BoxCubeIcon />
      </div>

      <div class="mt-5 flex items-end justify-between">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400"
            >Total Revenue</span
          >
          <h4
            class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90"
          >
            ${{ store.totalRevenue.toFixed(2) }}
          </h4>
        </div>
      </div>
    </div>

    <!-- Average Order Value Analytics Card -->
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
      >
        <BoxCubeIcon />
      </div>

      <div class="mt-5 flex items-end justify-between">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400"
            >Average Order Value</span
          >
          <h4
            class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90"
          >
            ${{ averageOrderValue }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>
