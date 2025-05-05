<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
        Monthly Sales
      </h3>
    </div>

    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <div id="chartOne" class="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
        <VueApexCharts
          type="bar"
          height="180"
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

// This holds the dynamic series data
const series = ref([
  {
    name: 'Sales',
    data: [], // start empty, to be filled from backend
  },
]);

const fetchAnalyticsData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get('http://localhost:5000/dashboard/montlySales');
    const monthlySales = res.data.data.map((el: { totalSales: string }) =>
      Number(el.totalSales),
    );

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
  fetchAnalyticsData();
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
