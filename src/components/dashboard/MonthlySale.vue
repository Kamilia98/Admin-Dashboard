<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
        Monthly Sales
      </h3>

      <div class="relative">
        <div
          class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900"
        >
          <button
            v-for="option in options"
            :key="option.value"
            @click="handleSelect(option.value)"
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
      <div id="chartOne" class="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
        <VueApexCharts
          type="bar"
          height="230"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const loading = ref(false);
const error = ref<string | null>(null);

const options = [
  { value: 'last', label: 'Last year' },
  { value: 'current', label: 'This Year' },
];

const handleSelect = async (option: string) => {
  selected.value = option;
  await fetchAnalyticsData(option);
};
const selected = ref('current');


const series = ref([
  {
    name: 'Sales',
    data: [], 
  },
]);

const fetchAnalyticsData = async (period: string) => {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get('http://localhost:5000/dashboard/montlySales', {
      params: {
        period,
      },
    });
    const monthlySales = res.data.data.map((el: { totalSales: string }) =>
      Number(el.totalSales),
    );
    selected.value = period;

    // Update the series data
    series.value = [
      {
        name: 'Sales',
        data: monthlySales,
      },
    ];
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    error.value = 'Failed to fetch analytics data.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAnalyticsData('current');
});

const chartOptions = ref({
  colors: ['#465fff'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '39%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 4,
    colors: ['transparent'],
  },
  xaxis: {
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
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Outfit',
    markers: {
      radius: 99,
    },
  },
  yaxis: {
    title: false,
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      formatter: function (val: number) {
        return val.toString();
      },
    },
  },
});
</script>
