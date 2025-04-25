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
  ElIcon,
} from "element-plus";

import { UserGroupIcon, BoxCubeIcon } from "../icons";
import { Top, Bottom } from "@element-plus/icons-vue";

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
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
        >
          <UserGroupIcon />
        </div>

        <div class="mt-5 flex items-end justify-between">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >Customers</span
            >
            <h4
              class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90"
            >
              3,782
            </h4>
          </div>

          <span
            class="flex items-center gap-1 rounded-full bg-success-50 py-0.5 pr-2.5 pl-2 text-sm font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
          >
            <el-icon><Top /></el-icon>
            11.01%
          </span>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
        >
          <BoxCubeIcon />
        </div>

        <div class="mt-5 flex items-end justify-between">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Orders</span>
            <h4
              class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90"
            >
              5,359
            </h4>
          </div>

          <span
            class="flex items-center gap-1 rounded-full bg-error-50 py-0.5 pr-2.5 pl-2 text-sm font-medium text-error-600 dark:bg-error-500/15 dark:text-error-500"
          >
            <el-icon><Bottom /></el-icon>

            9.05%
          </span>
        </div>
      </div>
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
        >
          <BoxCubeIcon />
        </div>

        <div class="mt-5 flex items-end justify-between">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Orders</span>
            <h4
              class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90"
            >
              5,359
            </h4>
          </div>

          <span
            class="flex items-center gap-1 rounded-full bg-error-50 py-0.5 pr-2.5 pl-2 text-sm font-medium text-error-600 dark:bg-error-500/15 dark:text-error-500"
          >
            <el-icon><Bottom /></el-icon>

            9.05%
          </span>
        </div>
      </div>
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
        >
          <BoxCubeIcon />
        </div>

        <div class="mt-5 flex items-end justify-between">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Orders</span>
            <h4
              class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90"
            >
              5,359
            </h4>
          </div>

          <span
            class="flex items-center gap-1 rounded-full bg-error-50 py-0.5 pr-2.5 pl-2 text-sm font-medium text-error-600 dark:bg-error-500/15 dark:text-error-500"
          >
            <el-icon><Bottom /></el-icon>

            9.05%
          </span>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-end gap-4 md:gap-6">
      <form>
        <div class="relative">
          <button class="absolute top-1/2 left-4 -translate-y-1/2">
            <svg
              class="fill-gray-500 dark:fill-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                fill=""
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search orders..."
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden xl:w-[430px] dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
      </form>

      <button
        class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        <svg
          class="fill-white stroke-current dark:fill-gray-800"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.29004 5.90393H17.7067"
            stroke=""
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17.7075 14.0961H2.29085"
            stroke=""
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
            fill=""
            stroke=""
            stroke-width="1.5"
          />
          <path
            d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
            fill=""
            stroke=""
            stroke-width="1.5"
          />
        </svg>

        Filter
      </button>
    </div>
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
      caption="Orders"
      :headers="[
        { key: 'orderNumber', label: 'Order' },
        { key: 'userName', label: 'Customer' },
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
