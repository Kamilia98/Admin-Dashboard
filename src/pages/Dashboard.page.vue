<script setup lang="ts">
import EcommerceMetrics from '../components/dashboard/EcommerceMetrics.vue';
import MonthlyTarget from '../components/dashboard/MonthlyTarget.vue';
import MonthlySale from '../components/dashboard/MonthlySale.vue';
import StatisticsChart from '../components/dashboard/StatisticsChart.vue';
import CustomerDemographic from '../components/dashboard/CustomerDemographic.vue';
import RecentOrders from '../components/dashboard/RecentOrders.vue';
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
