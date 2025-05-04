<script setup lang="ts">
import { ref, onMounted } from 'vue';
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue';
import MonthlyTarget from '../components/ecommerce/MonthlyTarget.vue';
import MonthlySale from '../components/ecommerce/MonthlySale.vue';
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue';
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue';
import RecentOrders from '../components/ecommerce/RecentOrders.vue';
import axios from 'axios';

interface AnalyticsData {
  totalCustomers: number;
  totalOrders: number;
  trends: {
    orders: { trend: string };
    customers: { trend: string };
  };
}

// Initial default structure to avoid undefined errors
const analyticsData = ref<AnalyticsData>({
  totalCustomers: 0,
  totalOrders: 0,
  trends: {
    orders: { trend: '' },
    customers: { trend: '' },
  },
});

const loading = ref(false);
const error = ref<string | null>(null);

const fetchAnalyticsData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get('http://localhost:5000/dashboard');
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
</script>

<template>
  <div class="grid grid-cols-12 gap-4 md:gap-6">
    <div v-if="loading" class="col-span-12 text-center">
      <p>Loading...</p>
    </div>
    <div v-else-if="error" class="col-span-12 text-center text-red-500">
      <p>{{ error }}</p>
    </div>
    <template v-else>
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics :data="analyticsData" />
        <monthly-sale :data="analyticsData" />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-target :data="analyticsData" />
      </div>
      <div class="col-span-12">
        <statistics-chart :data="analyticsData" />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <customer-demographic :data="analyticsData" />
      </div>
      <div class="col-span-12 xl:col-span-7">
        <recent-orders :data="analyticsData" />
      </div>
    </template>
  </div>
</template>
