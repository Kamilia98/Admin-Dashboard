<template>
  <div
    class="rounded-2xl border custom-border bg-white p-4 shadow dark:bg-white/[0.03]"
  >
    <h3 class="mb-4 text-lg font-semibold text-gray-700 dark:text-white">
      Purchase History
    </h3>
    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-6 w-1/3 rounded bg-gray-200"></div>
      <div class="h-48 rounded bg-gray-100"></div>
    </div>
    <apexchart
      v-else
      type="line"
      height="300"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import type { PropType } from 'vue';
// import ApexCharts from 'vue3-apexcharts';
const isDark = ref(false);

onMounted(() => {
  const darkClass = document.documentElement.classList.contains('dark');
  isDark.value = darkClass;

  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark');
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
});

const props = defineProps({
  orders: {
    type: Array as PropType<Array<{ createdAt: string; totalAmount: number }>>,
    required: true,
  },
});
const series = ref([{ name: 'Total Purchase', data: Array(12).fill(0) }]);
const isLoading = ref(true);
watchEffect(() => {
  const monthlyTotals = Array(12).fill(0);
  props.orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const month = date.getMonth();
    monthlyTotals[month] += order.totalAmount;
  });

  series.value = [{ name: 'Total Purchase', data: monthlyTotals }];
  isLoading.value = false;
});
const chartOptions = ref({});

watchEffect(() => {
  chartOptions.value = {
    chart: {
      id: 'purchase-chart',
      toolbar: { show: false },
      background: isDark.value ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
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
      labels: {
        style: {
          colors: isDark.value ? '#FFFFFF' : '#000000',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark.value ? '#FFFFFF' : '#000000',
        },
      },
    },
    theme: {
      mode: isDark.value ? 'dark' : 'light',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    title: { text: '' },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val.toFixed(2)}`,
      },
      theme: isDark.value ? 'dark' : 'light',
    },
  };
});
</script>
