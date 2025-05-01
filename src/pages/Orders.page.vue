<script setup lang="ts">
/* ========== Imports ========== */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import {
  ElDatePicker,
  ElSelect,
  ElOption,
  ElTag,
  ElIcon,
  ElInputNumber,
  ElButton,
  ElDropdown,
} from 'element-plus';
import { View, RefreshLeft } from '@element-plus/icons-vue';

import Pagination from '../components/Pagination.vue';
import Search from '../components/Search.vue';
import Table from '../components/Table.vue';
import OrderStatistics from '../components/OrderStatistics.vue';
import FilterIcon from '../icons/FilterIcon.vue';

import { OrderStatus } from '../types/order.d';

/* ========== Constants ========== */
const ORDER_LIMIT = 8;

const ORDER_STAGES: OrderStatus[] = [
  OrderStatus.pending,
  OrderStatus.processing,
  OrderStatus.shipped,
  OrderStatus.delivered,
];

const STATUS_OPTIONS = [
  {
    label: OrderStatus.pending,
    value: OrderStatus.pending,
  },
  {
    label: OrderStatus.processing,
    value: OrderStatus.processing,
  },
  {
    label: OrderStatus.shipped,
    value: OrderStatus.shipped,
  },
  {
    label: OrderStatus.delivered,
    value: OrderStatus.delivered,
  },
  {
    label: OrderStatus.canceled,
    value: OrderStatus.canceled,
  },
];

/* ========== State ========== */
const orders = ref<any[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalOrders = ref(0);
const loading = ref(false);

const searchQuery = ref('');
const statusFilter = ref<string[]>([]);
const dateRange = ref<[string, string]>(['', '']);
const startDateFilter = ref('');
const endDateFilter = ref('');
const sortBy = ref('default');
const sortOrder = ref('desc');
const minAmount = ref(0);
const maxAmount = ref(0);

const router = useRouter();

/* ========== Utilities ========== */
const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const getNextStatusOptions = (status: OrderStatus) => {
  if (['Canceled', 'Delivered'].includes(status)) return [];

  const nextIndex = ORDER_STAGES.indexOf(status) + 1;

  const options =
    nextIndex < ORDER_STAGES.length
      ? [
          {
            label: capitalize(ORDER_STAGES[nextIndex]),
            value: ORDER_STAGES[nextIndex],
          },
        ]
      : [];

  return [
    ...options,
    {
      label: OrderStatus.canceled,
      value: OrderStatus.canceled,
    },
  ];
};

const viewDetails = (order: any) => {
  console.log(`[View Details] Navigating to order ID: ${order.id}`);
  router.push({
    name: 'order-details',
    params: {
      id: order.id,
    },
  });
};

const handleDateChange = () => {
  const [start, end] = dateRange.value;
  startDateFilter.value = start || '';
  endDateFilter.value = end || '';
  console.log(
    '[Date Change] Start Date:',
    startDateFilter.value,
    'End Date:',
    endDateFilter.value,
  );
};

const handleSort = (payload: { key: string; direction: 'asc' | 'desc' }) => {
  console.log(
    `[Sorting] Sort By: ${payload.key}, Direction: ${payload.direction}`,
  );
  sortBy.value = payload.key;
  sortOrder.value = payload.direction;
  fetchOrders(1);
};

const handleReset = () => {
  console.log('[Filters Reset] Resetting all filters to default');
  statusFilter.value = [];
  dateRange.value = ['', ''];
  startDateFilter.value = '';
  endDateFilter.value = '';
  minAmount.value = 0;
  maxAmount.value = 0;

  fetchOrders(1);
};

/* ========== API Calls ========== */
const fetchOrders = async (page: number) => {
  loading.value = true;
  console.log(
    `[Fetch Orders] Fetching orders - Page: ${page}, Query: "${searchQuery.value}"`,
  );

  try {
    const params: any = {
      limit: ORDER_LIMIT,
      page,
      startDate: startDateFilter.value,
      endDate: endDateFilter.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      minAmount: minAmount.value,
      maxAmount: maxAmount.value,
    };

    if (statusFilter.value.length) {
      params.status = statusFilter.value;
      console.log('[Filter Applied] Statuses:', statusFilter.value);
    }

    if (searchQuery.value.trim() !== '') {
      params.searchQuery = searchQuery.value.trim();
      console.log('[Search Applied] Query:', params.searchQuery);
    }

    const { data } = await axios.get('http://localhost:5000/orders/all', {
      params,
    });

    console.log(`[Fetch Success] Total Orders: ${data.data.totalOrders}`);
    console.table(data.data.orders);

    orders.value = data.data.orders.map((order: any) => ({
      ...order,
    }));

    totalOrders.value = data.data.totalOrders;
    totalPages.value = Math.ceil(totalOrders.value / ORDER_LIMIT);
    currentPage.value = page;
  } catch (err) {
    console.error('[Fetch Error] Failed to fetch orders:', err);
    orders.value = [];
    totalOrders.value = 0;
  } finally {
    loading.value = false;
    console.log('[Fetch Orders] Loading completed.');
  }
};

const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  console.log(
    `[Update Status] Updating order ID ${orderId} to status: ${newStatus}`,
  );
  try {
    await axios.patch(`http://localhost:5000/orders/${orderId}/status`, {
      status: newStatus,
    });

    const order = orders.value.find((o) => o.id === orderId);
    if (order) {
      order.status = newStatus;
      console.log(
        `[Update Status] Order ID ${orderId} status updated locally.`,
      );
    }
  } catch (err) {
    console.error('[Update Status Error] Failed to update order status:', err);
  }
};

/* ========== Lifecycle ========== */
onMounted(() => {
  console.log('[Mounted] Component mounted. Fetching initial orders...');
  fetchOrders(currentPage.value);
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <OrderStatistics />
    <!-- Search and Filter Buttons -->
    <div class="flex items-center justify-end gap-4 md:gap-6">
      <Search v-model="searchQuery" @search="fetchOrders(1)" />

      <!-- Filter Button -->

      <el-dropdown placement="top-start" trigger="click" :hide-on-click="false">
        <button
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          <FilterIcon />
          Filter
        </button>
        <template #dropdown>
          <!-- Filters -->
          <div class="rounded-md bg-white dark:bg-gray-900">
            <div class="flex max-w-[450px] flex-col gap-4 bg-white/[0.03] p-4">
              <!-- Status Filter -->
              <div class="flex items-center gap-1">
                <label class="w-10 dark:text-white/90">Status:</label>
                <el-select
                  v-model="statusFilter"
                  multiple
                  style="width: 240px"
                  :teleported="false"
                  class="bg-white/[0.03]"
                >
                  <el-option
                    v-for="item in STATUS_OPTIONS"
                    :key="item.value"
                    v-bind="item"
                  />
                </el-select>
              </div>

              <!-- Date Range Filter -->
              <div class="flex items-center gap-1">
                <label class="w-10 dark:text-white/90">Date:</label>
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="to"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  @change="handleDateChange"
                />
              </div>

              <div class="flex items-center gap-2">
                <label class="w-10 dark:text-white/90">Total:</label>
                <el-input-number
                  v-model="minAmount"
                  placeholder="Min amount"
                  :precision="2"
                />
                <span class="dark:text-white/90">to</span>
                <el-input-number
                  v-model="maxAmount"
                  placeholder="Max amount"
                  :precision="2"
                />
              </div>
              <div class="self-center">
                <el-button plain @click="fetchOrders(1)" size="large">
                  Apply Filters
                </el-button>
                <el-button
                  plain
                  @click="handleReset"
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

    <!-- Orders Table -->
    <Table
      caption="Orders"
      :loading="loading"
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
      :items="orders"
      row-key="id"
      @sort="handleSort"
    >
      <!-- <template #column-status="{ item }">
        <el-select
          v-if="getNextStatusOptions(item.status).length > 0"
          v-model="item.status"
          :class="item.status"
          no-data-text="No options"
          style="width: 120px"
          @change="updateOrderStatus(item.id, $event)"
        >
          <el-option
            v-for="opt in getNextStatusOptions(item.status)"
            :key="opt.value"
            v-bind="opt"
          />
        </el-select>
        <el-tag
          v-else-if="item.status === OrderStatus.canceled"
          :class="['status-tag', OrderStatus.canceled]"
        >
          {{ item.status }}
        </el-tag>

        <el-tag
          v-else-if="item.status === OrderStatus.delivered"
          :class="['status-tag', OrderStatus.delivered]"
        >
          {{ item.status }}
        </el-tag>
      </template> -->

      <template #column-actions="{ item }">
        <div class="flex justify-center">
          <el-icon @click="viewDetails(item)" class="cursor-pointer" size="16"
            ><View
          /></el-icon>
        </div>
      </template>
    </Table>

    <!-- Pagination -->

    <Pagination
      title="orders"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalItems="totalOrders"
      :limit="ORDER_LIMIT"
      @changePage="fetchOrders"
    />
  </div>
</template>

<style scoped>
:deep(.Pending .el-select__placeholder span) {
  color: oklch(0.769 0.188 70.08);
}
:deep(.Processing .el-select__placeholder span) {
  color: oklch(0.558 0.288 302.321);
}
:deep(.Shipped .el-select__placeholder span) {
  color: oklch(0.546 0.245 262.881);
}

:deep(.Pending .el-select__wrapper) {
  background-color: var(--color-orange-100) !important;
}
:deep(.Processing .el-select__wrapper) {
  background-color: oklch(0.946 0.033 307.174) !important;
}
:deep(.Shipped .el-select__wrapper) {
  background-color: oklch(0.932 0.032 255.585) !important;
}

html.dark {
  :deep(.Pending .el-select__placeholder span) {
    color: var(--color-orange-400);
  }
  :deep(.Processing .el-select__placeholder span) {
    color: oklch(0.7 0.288 302.321);
  }
  :deep(.Shipped .el-select__placeholder span) {
    color: oklch(0.7 0.245 262.881);
  }

  :deep(.Pending .el-select__wrapper) {
    background-color: oklch(0.25 0.059 95.617) !important;
  }
  :deep(.Processing .el-select__wrapper) {
    background-color: oklch(0.23 0.033 307.174) !important;
  }
  :deep(.Shipped .el-select__wrapper) {
    background-color: oklch(0.22 0.032 255.585) !important;
  }
}
</style>
