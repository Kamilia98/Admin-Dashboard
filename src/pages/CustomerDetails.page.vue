<template>
  <div class="flex flex-row gap-6 p-6">
    <!-- Left Profile Section -->
    <div class="w-full max-w-sm rounded-xl border bg-white p-6 shadow">
      <div class="flex flex-col items-center text-center">
        <img
          src="https://i.pravatar.cc/100"
          alt="User"
          class="mb-4 h-20 w-20 rounded-full"
        />
        <h2 class="text-lg font-semibold">Cameron Green</h2>
        <p class="text-sm text-gray-500">userid1001@gmail.com</p>
        <p class="text-sm text-gray-500">+880 123456789</p>
      </div>
      <div class="mt-6 space-y-2 text-sm text-gray-700">
        <p>
          <span class="font-medium text-gray-500">Registered Since:</span> 20
          Aug 2021
        </p>
        <p>
          <span class="font-medium text-gray-500">Favourite Item:</span> Pizza
        </p>
      </div>
    </div>

    <!-- Right Orders Section -->
    <div class="flex-1 space-y-6">
      <!-- Order Stats Card -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-xl border bg-white p-6 text-center shadow">
          <h4 class="text-sm text-gray-500">Total Order</h4>
          <div class="text-3xl font-bold">290</div>
          <p class="mt-1 text-xs text-gray-400">Avg Order Value: $200</p>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="rounded-xl border bg-white p-6 shadow">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">All Orders</h3>
          <el-button :icon="FilterIcon"> Filter</el-button>
        </div>
        <el-table :data="orders" border stripe>
          <el-table-column prop="id" label="Order ID" width="100" />
          <el-table-column prop="date" label="Date & Time" />
          <el-table-column prop="country" label="Country" />
          <el-table-column prop="payment" label="Payment Method" />
          <el-table-column prop="amount" label="Amount" />
          <el-table-column label="Status">
            <template #default="{ row }">
              <el-tag :type="statusTag(row.status)">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElTag, ElButton } from 'element-plus';
import FilterIcon from '../icons/FilterIcon.vue';
const orders = [
  {
    id: '#00745',
    date: 'Fri, 04-30-21',
    country: 'USA',
    payment: 'Bank Transfer',
    amount: '$120.00',
    status: 'Delivered',
  },
  {
    id: '#00343',
    date: 'Fri, 04-30-21',
    country: 'UK',
    payment: 'Ewallets',
    amount: '$90.00',
    status: 'On way',
  },
  {
    id: '#00865',
    date: 'May 13, 2022',
    country: 'Germany',
    payment: 'Cash',
    amount: '$240.00',
    status: 'Delivered',
  },
  {
    id: '#00865',
    date: 'Mar 13, 2022',
    country: 'France',
    payment: 'Direct Deposit',
    amount: '$50.43',
    status: 'Canceled',
  },
];

function statusTag(status: string) {
  switch (status) {
    case 'Delivered':
      return 'success';
    case 'On way':
      return 'warning';
    case 'Canceled':
      return 'danger';
    default:
      return 'info';
  }
}
</script>

<style scoped>
/* Optional: Style overrides if needed */
</style>
