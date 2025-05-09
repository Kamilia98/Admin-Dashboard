<template>
  <div
    class="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div
      class="shadow-default rounded-2xl bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6 dark:bg-gray-900"
    >
      <div class="flex justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
            Order Analytics
          </h3>
          <p class="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Overview of order status and performance metrics
          </p>
        </div>
      </div>
      <div id="" class="h-full">
        <div v-if="loading" class="flex h-[300px] items-center justify-center">
          <div class="flex flex-col items-center gap-2">
            <div
              class="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            ></div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Loading analytics...
            </p>
          </div>
        </div>
        <div
          v-else-if="error"
          class="flex h-[300px] items-center justify-center"
        >
          <div class="text-center">
            <p class="mb-2 font-medium text-error-600 dark:text-error-500">
              {{ error }}
            </p>
            <button
              @click="fetchAnalyticsData"
              class="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              <span>Retry</span>
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12V9C4 5.13401 7.13401 2 11 2H13C16.866 2 20 5.13401 20 9V12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M20 12V15C20 18.866 16.866 22 13 22H11C7.13401 22 4 18.866 4 15V12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M12 6V18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M8 10L12 6L16 10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div v-else class="flex items-center justify-center">
          <div class="vue-apexcharts h-[300px]">
            <VueApexCharts
              v-if="dataLoaded"
              type="donut"
              height="300"
              :options="chartOptions"
              :series="series"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5"
    >
      <template v-for="(metric, index) in metrics" :key="metric.label">
        <div>
          <p
            class="mb-1 text-center text-theme-xs text-gray-500 sm:text-sm dark:text-gray-400"
          >
            {{ metric.label }}
          </p>
          <p
            class="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90"
          >
            {{ formatValue(metric.value, metric.format) }}
            <span :class="getTrendClasses(metric.trend, metric.inverseTrend)">
              <el-icon>
                <Top v-if="metric.trend === 'increasing'" />
                <Bottom v-else-if="metric.trend === 'decreasing'" />
                <Minus v-else />
              </el-icon>
            </span>
          </p>
        </div>
        <div
          v-if="index < metrics.length - 1"
          class="h-7 w-px bg-gray-200 dark:bg-gray-800"
        ></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { OrderStatus } from '../../types/order.d';
import { ElIcon } from 'element-plus';
import { Top, Bottom, Minus } from '@element-plus/icons-vue';
import axios from 'axios';

interface AnalyticsResponse {
  statusCounts: Record<OrderStatus, number>;
  totalOrders: number;
  avgOrderValue: number;
  totalSales: number;
  cancelationRate: number;
  trends: {
    sales: { trend: 'increasing' | 'decreasing' | 'stable' };
    avgOrderValue: { trend: 'increasing' | 'decreasing' | 'stable' };
    cancelationRate: { trend: 'increasing' | 'decreasing' | 'stable' };
  };
}

const dataLoaded = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const totalOrders = ref<number>(0);
const analyticsData = ref<AnalyticsResponse | null>(null);
const statusCounts = ref<Record<OrderStatus, number> | null>(null);
const avgOrderValue = ref<number>(0);
const totalSales = ref<number>(0);
const cancelationRate = ref<number>(0);
const trends = ref<{
  sales: { trend: 'increasing' | 'decreasing' | 'stable' };
  avgOrderValue: { trend: 'increasing' | 'decreasing' | 'stable' };
  cancelationRate: { trend: 'increasing' | 'decreasing' | 'stable' };
}>({
  sales: { trend: 'increasing' },
  avgOrderValue: { trend: 'increasing' },
  cancelationRate: { trend: 'increasing' },
});

const fetchAnalyticsData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get<{ data: AnalyticsResponse }>(
      'http://localhost:5000/dashboard/orderStatus',
    );
    const responseData = res.data.data;

    analyticsData.value = responseData;
    statusCounts.value = responseData.statusCounts;
    totalOrders.value = responseData.totalOrders;
    avgOrderValue.value = responseData.avgOrderValue;
    totalSales.value = responseData.totalSales;
    cancelationRate.value = responseData.cancelationRate;
    trends.value = responseData.trends;

    console.log('Analytics Data:', responseData);
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    error.value =
      err instanceof Error ? err.message : 'Failed to fetch analytics data.';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchAnalyticsData();
  dataLoaded.value = true;
});

const series = computed(() => {
  if (!statusCounts.value) {
    return [0, 0, 0, 0, 0];
  }
  return [
    statusCounts.value[OrderStatus.pending] || 0,
    statusCounts.value[OrderStatus.processing] || 0,
    statusCounts.value[OrderStatus.shipped] || 0,
    statusCounts.value[OrderStatus.delivered] || 0,
    statusCounts.value[OrderStatus.canceled] || 0,
  ];
});

const chartOptions = {
  colors: [
    'oklch(0.769 0.130 70.08)',
    'oklch(0.558 0.200 302.321)',
    'oklch(0.546 0.180 262.881)',
    'oklch(62.7% 0.140 149.214)',
    'oklch(63.7% 0.170 25.331)',
  ],
  labels: [
    OrderStatus.pending,
    OrderStatus.processing,
    OrderStatus.shipped,
    OrderStatus.delivered,
    OrderStatus.canceled,
  ],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'donut',
    width: '100%',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
    toolbar: {
      show: false,
    },
  },
  stroke: {
    show: false,
    width: 4,
    colors: 'transparent',
  },
  plotOptions: {
    pie: {
      donut: {
        lineCap: 'smooth',
        size: '65%',
        background: 'transparent',
        labels: {
          show: true,
          name: {
            show: true,
            offsetY: 0,
            color: document.documentElement.classList.contains('dark')
              ? '#ffffff'
              : '#1D2939',
            fontSize: '12px',
            fontWeight: 'normal',
          },
          value: {
            show: true,
            offsetY: 10,
            color: document.documentElement.classList.contains('dark')
              ? '#1D2939'
              : '#667085',
            fontSize: '14px',
            formatter: (val: number) => `${val} Order${val > 1 ? 's' : ''}`,
          },
          total: {
            show: true,
            label: 'Total',
            color: document.documentElement.classList.contains('dark')
              ? '#1D2939'
              : '#000000',
            fontSize: '24px',
            fontWeight: 'bold',
            formatter: () => `${totalOrders.value} Orders`,
          },
        },
      },
      expandOnClick: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: true,
    theme: document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
    style: {
      fontSize: '14px',
      fontFamily: 'Outfit, sans-serif',
      backgroundColor: 'transparent',
    },
    y: {
      formatter: (value: number) => `${value} Orders`,
    },
    fillSeriesColor: false,
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    fontFamily: 'Outfit',
    fontSize: '14px',
    fontWeight: 400,
    markers: {
      size: 5,
      shape: 'circle',
      radius: 999,
      strokeWidth: 0,
    },
    itemMargin: {
      horizontal: 10,
      vertical: 6,
    },
    onItemClick: {
      toggleDataSeries: true,
    },
    onItemHover: {
      highlightDataSeries: true,
    },
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          width: '100%',
        },
        legend: {
          position: 'bottom',
          itemMargin: {
            horizontal: 7,
            vertical: 5,
          },
        },
      },
    },
    {
      breakpoint: 375,
      options: {
        legend: {
          fontSize: '12px',
        },
      },
    },
    {
      breakpoint: 1500,
      options: {
        legend: {
          itemMargin: {
            horizontal: 10,
            vertical: 6,
          },
        },
      },
    },
  ],
};

const metrics = computed(() => [
  {
    label: 'Total Sales',
    value: totalSales.value,
    trend: trends.value.sales.trend,
    format: 'currency' as 'currency' | 'percentage',
    inverseTrend: false,
  },
  {
    label: 'Avg. Order Value',
    value: avgOrderValue.value,
    trend: trends.value.avgOrderValue.trend,
    format: 'currency' as 'currency' | 'percentage',
    inverseTrend: false,
  },
  {
    label: 'Cancelation Rate',
    value: cancelationRate.value,
    trend: trends.value.cancelationRate.trend,
    format: 'percentage' as 'currency' | 'percentage',
    inverseTrend: true,
  },
]);

const formatValue = (value: number, format: 'currency' | 'percentage') => {
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

const getTrendClasses = (
  trend: 'increasing' | 'decreasing' | 'stable',
  inverseTrend: boolean,
) => {
  if (trend === 'stable') {
    return 'text-gray-500 dark:text-gray-400';
  }
  const isPositive =
    (trend === 'increasing' && !inverseTrend) ||
    (trend === 'decreasing' && inverseTrend);
  return isPositive
    ? 'text-success-600 dark:text-success-500'
    : 'text-error-600 dark:text-error-500';
};
</script>

<style scoped>
.radial-bar-chart {
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
}
</style>
