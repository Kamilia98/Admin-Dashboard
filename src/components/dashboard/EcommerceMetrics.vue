<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { OrdersIcon, UserGroupIcon } from '../../icons';
import { ElIcon } from 'element-plus';
import { Top, Bottom, Minus } from '@element-plus/icons-vue';

import { useDashboardStore } from '../../stores/dashboardStore';

const store = useDashboardStore();

onMounted(() => {
  store.fetchAnalyticsData();
});

const cardList = computed(() => [
  {
    label: 'Customers',
    value: store.analyticsData.totalCustomers,
    trend: store.analyticsData.trends?.customers?.trend,
    percentageChange:
      store.analyticsData.trends?.customers?.percentageChange ?? 0,
    icon: UserGroupIcon,
  },
  {
    label: 'Orders',
    value: store.analyticsData.totalOrders,
    trend: store.analyticsData.trends?.orders?.trend,
    percentageChange: store.analyticsData.trends?.orders?.percentageChange ?? 0,
    icon: OrdersIcon,
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
    <!-- Card Template -->
    <template v-for="(card, index) in cardList" :key="index">
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
        >
          <component :is="card.icon" />
        </div>

        <div class="mt-5 flex items-end justify-between">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ card.label }}
            </span>
            <h4
              class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90"
            >
              {{ card.value }}
            </h4>
          </div>

          <span
            class="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium"
            :class="{
              'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500':
                card.trend === 'increasing',
              'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500':
                card.trend === 'decreasing',
              'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400':
                card.trend === 'stable',
            }"
            :title="`${card.percentageChange}% ${card.trend}`"
          >
            <ElIcon>
              <Top v-if="card.trend === 'increasing'" />
              <Bottom v-else-if="card.trend === 'decreasing'" />
              <Minus v-else />
              <!-- You can use a horizontal line icon here -->
            </ElIcon>
            {{ Number(card.percentageChange) > 0 ? '+' : ''
            }}{{ card.percentageChange }}%
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
