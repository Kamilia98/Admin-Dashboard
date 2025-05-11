<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
      <div class="">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          {{ series[0].name }}
        </h3>
        <p class="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          {{ subtitle }}
        </p>
      </div>

      <div class="relative">
        <div
          class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900"
        >
          <button
            v-for="option in options"
            :key="option.value"
            @click="fetchAnalyticsData(option.value)"
            :class="[
              selected === option.value
                ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white'
                : 'text-gray-500 dark:text-gray-400',
              'rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 hover:shadow-theme-xs dark:hover:bg-gray-800 dark:hover:text-white',
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <div id="chartThree" class="-ml-4 min-w-[1000px] pl-2 xl:min-w-full">
        <VueApexCharts
          type="area"
          height="310"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import VueApexCharts from 'vue3-apexcharts';

const options = [
  { value: 'last', label: 'Last year' },
  { value: 'current', label: 'This Year' },
];

const selected = ref('current');
const loading = ref(false);
const error = ref<string | null>(null);

const series = ref<{ name: string; data: number[] }[]>([
  {
    name: 'Sales Growth (%)',
    data: [],
  },
]);

const chartOptions = ref({
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#465FFF', '#9CB9FF'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  fill: {
    gradient: {
      enabled: true,
      opacityFrom: 0.55,
      opacityTo: 0,
    },
  },
  stroke: {
    curve: 'straight',
    width: [2, 2],
  },
  markers: {
    size: 0,
  },
  labels: {
    show: false,
    position: 'top',
  },
  grid: {
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
  },
});

// Function to compute growth %
const computeGrowth = (data: number[]): number[] => {
  const growth: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const current = data[i];
    const change = prev !== 0 ? ((current - prev) / prev) * 100 : 0;
    growth.push(Number(change.toFixed(2)));
  }
  return growth;
};

const fetchAnalyticsData = async (period: string) => {
  loading.value = true;
  error.value = null;
  selected.value = period;

  try {
    const res = await axios.get('http://localhost:5000/dashboard/salesGrowth', {
      params: { period },
    });

    const monthlySales = res.data.data.map((el: { totalSales: string }) =>
      Number(el.totalSales),
    );

    const growthData = computeGrowth(monthlySales);

    series.value = [
      {
        name: 'Sales Growth (%)',
        data: growthData,
      },
    ];

    // Adjust categories dynamically if needed
    if (growthData.length < 12) {
      chartOptions.value.xaxis.categories = growthData.map(
        (_, i) => `Month ${i + 1}`,
      );
    }
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    error.value = 'Failed to fetch analytics data.';
  } finally {
    loading.value = false;
  }
};

// Initial load
onMounted(() => {
  fetchAnalyticsData(selected.value);
});

const subtitle = computed(() => {
  const periodLabel =
    options.find((opt) => opt.value === selected.value)?.label || '';
  return `Showing ${series.value[0].name.toLowerCase()} data (${periodLabel})`;
});
</script>

<style scoped>
.area-chart {
  width: 100%;
}
</style>
