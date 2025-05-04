<script setup lang="ts">
import { watch } from 'vue';
import { BoxCubeIcon, UserGroupIcon } from '../../icons';
import { ElIcon } from 'element-plus';
import { Top, Bottom } from '@element-plus/icons-vue';

interface AnalyticsData {
  totalCustomers: number;
  totalOrders: number;
  trends: {
    orders: { trend: string; percentageChange: string };
    customers: { trend: string; percentageChange: string };
  };
}

const props = defineProps<{
  data: AnalyticsData;
}>();

watch(
  () => props.data,
  (newData, oldData) => {
    console.log('Data prop changed:', { newData, oldData });
  },
  { deep: true },
);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
    <!-- Customers Card -->
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800"
      >
        <UserGroupIcon />
      </div>

      <div class="mt-5 flex items-end justify-between">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400"
            >Customers</span
          >
          <h4
            class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90"
          >
            {{ data.totalCustomers }}
          </h4>
        </div>

        <span
          class="flex items-center gap-1 rounded-full py-0.5 pr-2.5 pl-2 text-sm font-medium"
          :class="{
            'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500':
              data.trends?.customers?.trend === 'increasing',
            'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500':
              data.trends?.customers?.trend === 'decreasing',
          }"
        >
          <ElIcon>
            <Bottom v-if="data.trends?.customers?.trend === 'decreasing'" />
            <Top v-else-if="data.trends?.customers?.trend === 'increasing'" />
          </ElIcon>
          {{ data.trends.customers.percentageChange }}
        </span>
      </div>
    </div>

    <!-- Orders Card -->
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800"
      >
        <BoxCubeIcon />
      </div>

      <div class="mt-5 flex items-end justify-between">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Orders</span>
          <h4
            class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90"
          >
            {{ data.totalOrders }}
          </h4>
        </div>

        <span
          class="flex items-center gap-1 rounded-full py-0.5 pr-2.5 pl-2 text-sm font-medium"
          :class="{
            'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500':
              data.trends?.orders?.trend === 'increasing',
            'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500':
              data.trends?.orders?.trend === 'decreasing',
          }"
        >
          <ElIcon>
            <Top v-if="data.trends?.orders?.trend === 'increasing'" />
            <Bottom v-else-if="data.trends?.orders?.trend === 'decreasing'" />
          </ElIcon>
          {{ data.trends.orders.percentageChange }}
        </span>
      </div>
    </div>
  </div>
</template>
