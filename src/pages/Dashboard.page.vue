<script setup lang="ts">
import { ref, onMounted } from 'vue';
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue';
import MonthlyTarget from '../components/ecommerce/MonthlyTarget.vue';
import MonthlySale from '../components/ecommerce/MonthlySale.vue';
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue';
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue';
import RecentOrders from '../components/ecommerce/RecentOrders.vue';
import axios from 'axios';
import type { AnalyticsData } from '../types/analytics-data';

// Initial default structure to avoid undefined errors
</script>

<template>
  <div class="grid grid-cols-12 gap-4 md:gap-6">
    <div class="col-span-12 space-y-6 xl:col-span-7">
      <ecommerce-metrics />
      <monthly-sale />
    </div>
    <div class="col-span-12 xl:col-span-5">
      <monthly-target />
    </div>
    <div class="col-span-12">
      <statistics-chart />
    </div>
    <div class="col-span-12 xl:col-span-5">
      <customer-demographic />
    </div>
    <div class="col-span-12 xl:col-span-7">
      <recent-orders />
    </div>
  </div>
</template>
