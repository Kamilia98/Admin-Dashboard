<script setup lang="ts">
import { onMounted, watch } from 'vue';

import {
  ElDatePicker,
  ElSelect,
  ElOption,
  ElIcon,
  ElInputNumber,
  ElButton,
  ElDropdown,
} from 'element-plus';
import { View, RefreshLeft } from '@element-plus/icons-vue';

import Search from '../common/Search.vue';
import Table from '../common/Table.vue';
import FilterIcon from '../../icons/FilterIcon.vue';
import OrderStatusSelector from './OrderStatusSelector.vue';

import { useOrdersStore } from '../../stores/orderStore';

const store = useOrdersStore();

const props = defineProps<{
  userId?: string;
  limit?: number;
  currentPage?: number;
}>();

/* ========== Lifecycle ========== */

onMounted(() => {
  console.log(
    '[Mounted] Component mounted. Fetching initial orders...',
    props.userId,
  );
  if (props.userId) store.userId = props.userId;
  store.fetchOrders({
    page: props.currentPage || 1,
    userId: props.userId,
    limit: props.limit,
  });
});
watch(
  () => props.userId,
  (newUserId) => {
    console.log('[Watch] User ID changed:', newUserId);
    if (newUserId) store.userId = newUserId;
    store.fetchOrders({ page: 1, userId: newUserId, limit: props.limit });
  },
);
watch(
  () => props.limit,
  (newLimit) => {
    console.log('[Watch] Limit changed:', newLimit);
    // if (newLimit) store.limit = newLimit;
    store.fetchOrders({ page: 1, userId: props.userId, limit: newLimit });
  },
);
watch(
  () => props.currentPage,
  () => {
    store.fetchOrders({
      page: props.currentPage || 1,
      userId: props.userId,
      limit: props.limit,
    });
  },
);
</script>

<template>
  <!-- Orders Table -->
  <Table
    caption="Orders"
    :loading="store.loading"
    :headers="[
      {
        key: 'orderNumber',
        label: 'Order',
        sortable: true,
      },
      {
        key: 'userName',
        label: 'Customer',
        sortable: false,
      },
      {
        key: 'totalAmount',
        label: 'Total',
        sortable: true,
      },
      {
        key: 'createdAt',
        label: 'Date',
        sortable: true,
      },
      {
        key: 'status',
        label: 'Status',
        sortable: false,
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
      },
    ]"
    :items="store.orders"
    row-key="id"
    @sort="store.handleSort"
  >
    <template #column-status="{ item }">
      <OrderStatusSelector
        :status="item.status"
        :order-id="item.id"
        @update="item.status = $event"
      />
    </template>

    <template #column-actions="{ item }">
      <div class="flex justify-center">
        <router-link :to="`/orders/${item.id}`">
          <el-icon class="cursor-pointer" size="16"><View /></el-icon>
        </router-link>
      </div>
    </template>

    <template #actions>
      <div class="flex items-center justify-end gap-4 md:gap-6">
        <Search
          v-model="store.searchQuery"
          @search="store.fetchOrders({ page: 1, userId })"
        />

        <!-- Filter Button -->

        <el-dropdown
          placement="top-start"
          trigger="click"
          :hide-on-click="false"
        >
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <FilterIcon />
            Filter
          </button>
          <template #dropdown>
            <!-- Filters -->
            <div class="rounded-md bg-white dark:bg-gray-900">
              <div
                class="flex max-w-[450px] flex-col gap-4 bg-white/[0.03] p-4"
              >
                <!-- Status Filter -->
                <div class="flex items-center gap-1">
                  <label class="w-10 dark:text-white/90">Status:</label>
                  <el-select
                    v-model="store.statusFilter"
                    multiple
                    style="width: 240px"
                    :teleported="false"
                    class="bg-white/[0.03]"
                  >
                    <el-option
                      v-for="item in store.STATUS_OPTIONS"
                      :key="item.value"
                      v-bind="item"
                    />
                  </el-select>
                </div>

                <!-- Date Range Filter -->
                <div class="flex items-center gap-1">
                  <label class="w-10 dark:text-white/90">Date:</label>
                  <el-date-picker
                    v-model="store.dateRange"
                    type="daterange"
                    range-separator="to"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    @change="store.handleDateChange"
                  />
                </div>

                <div class="flex items-center gap-2">
                  <label class="w-10 dark:text-white/90">Total:</label>
                  <el-input-number
                    v-model="store.minAmount"
                    placeholder="Min amount"
                    :precision="2"
                  />
                  <span class="dark:text-white/90">to</span>
                  <el-input-number
                    v-model="store.maxAmount"
                    placeholder="Max amount"
                    :precision="2"
                  />
                </div>
                <div class="self-center">
                  <el-button
                    plain
                    @click="store.fetchOrders({ page: 1, userId })"
                    size="large"
                  >
                    Apply Filters
                  </el-button>
                  <el-button
                    plain
                    @click="store.handleReset"
                    size="large"
                    type="danger"
                    :icon="RefreshLeft"
                  >
                    Reset Filters
                  </el-button>
                </div>
              </div>
            </div>
          </template>
        </el-dropdown>
      </div>
    </template>
  </Table>
</template>
