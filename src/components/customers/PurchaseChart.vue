<template>
  <div class="rounded-xl border bg-white p-4 shadow">
    <h3 class="mb-4 text-lg font-semibold text-gray-700">Purchase History</h3>
    <apexchart
      type="line"
      height="300"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ApexCharts from 'vue3-apexcharts';

const series = ref([
  {
    name: 'Total Purchase',
    data: [120, 150, 180, 100, 200, 250, 210, 300, 280, 260, 290, 320], // mock monthly totals
  },
]);

const chartOptions = ref({
  chart: {
    id: 'purchase-chart',
    toolbar: {
      show: false,
    },
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
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  colors: ['#3b82f6'],
  dataLabels: {
    enabled: false,
  },
  title: {
    text: '',
  },
  tooltip: {
    y: {
      formatter: (val: number) => `$${val.toFixed(2)}`,
    },
  },
});
</script>
