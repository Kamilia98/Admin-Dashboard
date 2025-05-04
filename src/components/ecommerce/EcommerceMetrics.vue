<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { BoxCubeIcon, MoneyIcon, OrdersIcon, UserGroupIcon } from '../../icons';
import { ElIcon } from 'element-plus';
import { Top, Bottom } from '@element-plus/icons-vue';
import type { AnalyticsData } from '../../types/analytics-data';
import axios from 'axios';

const analyticsData = ref<AnalyticsData>({
  totalProducts: 0,
  totalCustomers: 0,
  totalOrders: 0,
  totalSales: 0,
  trends: {
    orders: { trend: '', percentageChange: '' },
    customers: { trend: '', percentageChange: '' },
    sales: { trend: '', percentageChange: '' },
    products: { trend: '', percentageChange: '' },
  },
});

const loading = ref(false);
const error = ref<string | null>(null);

const fetchAnalyticsData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get('http://localhost:5000/dashboard/metrics');
    analyticsData.value = res.data.data;
    console.log('Analytics Data:', analyticsData.value);
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    error.value = 'Failed to fetch analytics data.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAnalyticsData();
});

const cardList = computed(() => [
  {
    label: 'Customers',
    value: analyticsData.value.totalCustomers,
    trend: analyticsData.value.trends?.customers?.trend,
    percentageChange:
      analyticsData.value.trends?.customers?.percentageChange ?? 0,
    icon: UserGroupIcon,
  },
  {
    label: 'Orders',
    value: analyticsData.value.totalOrders,
    trend: analyticsData.value.trends?.orders?.trend,
    percentageChange: analyticsData.value.trends?.orders?.percentageChange ?? 0,
    icon: OrdersIcon,
  },
  {
    label: 'Sales',
    value: analyticsData.value.totalSales,
    trend: analyticsData.value.trends?.sales?.trend,
    percentageChange: analyticsData.value.trends?.sales?.percentageChange ?? 0,
    icon: MoneyIcon,
  },
  {
    label: 'Products Sold',
    value: analyticsData.value.totalProducts,
    trend: analyticsData.value.trends?.products?.trend,
    percentageChange:
      analyticsData.value.trends?.products?.percentageChange ?? 0,
    icon: BoxCubeIcon,
  },
]);
</script>

<template>
  <div
    class="grid grid-cols-1 gap-[1px] overflow-hidden rounded-2xl border custom-border bg-gray-200 sm:grid-cols-2 dark:bg-gray-800"
  >
    <!-- Card Template -->
    <template v-for="(card, index) in cardList" :key="index">
      <div class="bg-white p-5 md:p-6 dark:bg-white/[0.03]">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800"
        >
          <component :is="card.icon" />
        </div>

        <div class="mt-4 flex items-end justify-between">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ card.label }}
            </span>
            <h4
              class="mt-1 text-title-sm font-bold text-gray-800 dark:text-white/90"
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
            }"
            :title="`${card.percentageChange}% ${card.trend}`"
          >
            <ElIcon>
              <Top v-if="card.trend === 'increasing'" />
              <Bottom v-else-if="card.trend === 'decreasing'" />
            </ElIcon>
            {{ Number(card.percentageChange) > 0 ? '+' : ''
            }}{{ card.percentageChange }}%
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
