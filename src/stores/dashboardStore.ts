// src/stores/useDashboardStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { reactive, ref } from 'vue';

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const analyticsData = reactive({
    totalCustomers: 0,
    totalOrders: 0,
    trends: {
      orders: { trend: '', percentageChange: '' },
      customers: { trend: '', percentageChange: '' },
    },
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const fetchAnalyticsData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get('http://localhost:5000/dashboard/metrics');
      Object.assign(analyticsData, res.data.data);
    } catch (err) {
      error.value = 'Failed to fetch analytics data.';
    } finally {
      loading.value = false;
    }
  };

  return {
    analyticsData,
    loading,
    error,
    fetchAnalyticsData,
  };
});
