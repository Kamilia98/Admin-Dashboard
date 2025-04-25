<script setup lang="ts">
/* ========== Imports ========== */

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Pagination from "../components/Pagination.vue";
import Table from "../components/Table.vue";
import {
  ElDatePicker,
  ElSelect,
  ElOption,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from "element-plus";

/* ========== Types ============ */
type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Canceled"
  | "Delivered";

/* ========= Constants ========= */
const ORDER_LIMIT = 8;
const ORDER_STAGES: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
];
const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Canceled", value: "canceled" },
];
const SORT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Date", value: "createdAt" },
  { label: "Total", value: "totalAmount" },
  { label: "Order", value: "orderNumber" },
];
const ORDER_DIRECTIONS = [
  { label: "Descending", value: "desc" },
  { label: "Ascending", value: "asc" },
];

/* ========= Reactive ========== */

const orders = ref<any[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalOrders = ref(1);

const statusFilter = ref<string[]>([]);
const dateRange = ref<[string, string]>(["", ""]);
const startDateFilter = ref("");
const endDateFilter = ref("");
const sortBy = ref("default");
const sortOrder = ref("desc");

const router = useRouter();

/* ========= Utilities ========== */

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const getNextStatusOptions = (status: OrderStatus) => {
  if (["Canceled", "Delivered"].includes(status)) return [];

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

  return [...options, { label: "Canceled", value: "Canceled" }];
};

const handleCommand = (command: any) => {
  if (command.name === "view") {
    viewDetails(command.item);
  }
};

const viewDetails = (order: any) => {
  router.push({ name: "order-details", params: { id: order.id } });
};

const handleDateChange = () => {
  const [start, end] = dateRange.value;
  startDateFilter.value = start || "";
  endDateFilter.value = end || "";
  fetchOrders(1);
};

/* ========== API ============== */

const fetchOrders = async (page: number) => {
  try {
    const params: any = {
      limit: ORDER_LIMIT,
      page,
      startDate: startDateFilter.value,
      endDate: endDateFilter.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    };

    if (statusFilter.value.length) {
      params.status = statusFilter.value;
    }

    const { data } = await axios.get("http://localhost:5000/orders/all", {
      params,
    });

    orders.value = data.data.orders.map((order: any) => ({
      ...order,
      status: capitalize(order.status),
    }));

    totalOrders.value = data.data.totalOrders;
    totalPages.value = Math.ceil(data.data.totalOrders / ORDER_LIMIT);
    currentPage.value = page;
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
};

const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  try {
    await axios.patch(`http://localhost:5000/orders/${orderId}/status`, {
      status: newStatus,
    });

    const order = orders.value.find((o) => o.id === orderId);
    if (order) order.status = newStatus;
  } catch (err) {
    console.error("Error updating status:", err);
  }
};

/* ========= Lifecycle ========= */

onMounted(() => {
  fetchOrders(currentPage.value);
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-bold">Orders List</h1>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-4">
      <!-- Status Filter -->
      <div class="flex items-center">
        <label class="mr-2">Status:</label>
        <el-select
          v-model="statusFilter"
          multiple
          style="width: 240px"
          @change="fetchOrders(1)"
        >
          <el-option
            v-for="item in STATUS_OPTIONS"
            :key="item.value"
            v-bind="item"
          />
        </el-select>
      </div>

      <!-- Date Range -->
      <div class="flex items-center">
        <label class="mr-2">Date Range:</label>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
          class="w-[250px]"
        />
      </div>
    </div>

    <!-- Sorting -->
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center">
        <label class="mr-2">Sort By:</label>
        <el-select
          v-model="sortBy"
          style="width: 240px"
          @change="fetchOrders(1)"
        >
          <el-option
            v-for="item in SORT_OPTIONS"
            :key="item.value"
            v-bind="item"
          />
        </el-select>
      </div>

      <div class="flex items-center">
        <label class="mr-2">Order:</label>
        <el-select
          v-model="sortOrder"
          style="width: 240px"
          @change="fetchOrders(1)"
        >
          <el-option
            v-for="item in ORDER_DIRECTIONS"
            :key="item.value"
            v-bind="item"
          />
        </el-select>
      </div>
    </div>

    <!-- Orders Table -->
    <Table
      :headers="[
        { key: 'orderNumber', label: 'Order' },
        { key: 'userName', label: 'User' },
        { key: 'total', label: 'Total' },
        { key: 'createdAt', label: 'Date' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' },
      ]"
      :items="orders"
      row-key="id"
    >
      <template #column-status="{ item }">
        <el-select
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
      </template>

      <template #column-actions="{ item }">
        <el-dropdown trigger="click" @command="handleCommand">
          <button
            class="el-dropdown-link rounded bg-gray-100 px-3 py-1 text-sm font-medium shadow"
          >
            ...
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="{ name: 'view', item }"
                >View Details</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
:deep(.Delivered .el-select__placeholder span) {
  color: oklch(0.627 0.194 149.214);
}
:deep(.Canceled .el-select__placeholder span) {
  color: oklch(0.577 0.245 27.325);
}

:deep(.Pending .el-select__wrapper) {
  background-color: oklch(0.962 0.059 95.617) !important;
}
:deep(.Processing .el-select__wrapper) {
  background-color: oklch(0.946 0.033 307.174) !important;
}
:deep(.Shipped .el-select__wrapper) {
  background-color: oklch(0.932 0.032 255.585) !important;
}
:deep(.Delivered .el-select__wrapper) {
  background-color: oklch(0.962 0.044 156.743) !important;
}
:deep(.Canceled .el-select__wrapper) {
  background-color: oklch(0.936 0.032 17.717) !important;
}
</style>
