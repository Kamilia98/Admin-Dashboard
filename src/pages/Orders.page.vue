<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import Dropdown from "../components/Dropdown.vue";
import Pagination from "../components/Pagination.vue";
import ActionsList from "../components/ActionsList.vue";
import Table from "../components/Table.vue";
import { useRouter } from "vue-router";
import { ElDatePicker, ElSelect, ElOption } from "element-plus";

// ==============================
// Types
// ==============================
type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "canceled"
  | "delivered";

type StatusClasses = {
  bg: string;
  text: string;
};

// ==============================
// Reactive State
// ==============================
const orders = ref<any[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalOrders = ref(1);

const limit = 8;
const orderStages: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

// Filters
const statusFilter = ref([]);
const dateRange = ref<[string, string]>(["", ""]);
const startDateFilter = ref("");
const endDateFilter = ref("");

// Sorting
const sortBy = ref("default");
const sortOrder = ref("desc");

const router = useRouter();

// ==============================
// Utility Functions
// ==============================
const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const getStatusClasses = (status: OrderStatus): StatusClasses =>
  ({
    pending: { bg: "bg-yellow-100", text: "text-yellow-600" },
    processing: { bg: "bg-purple-200", text: "text-purple-800" },
    shipped: { bg: "bg-blue-200", text: "text-blue-800" },
    delivered: { bg: "bg-green-200", text: "text-green-800" },
    canceled: { bg: "bg-red-200", text: "text-red-800" },
  })[status];

const getNextStatusOptions = (
  currentStatus: OrderStatus,
): { label: string; value: OrderStatus }[] => {
  if (["canceled", "delivered"].includes(currentStatus)) return [];

  const index = orderStages.indexOf(currentStatus);
  const next = orderStages[index + 1];
  const options = next ? [{ label: capitalize(next), value: next }] : [];

  return [...options, { label: "Canceled", value: "canceled" }];
};

const viewDetails = (order: any) => {
  console.log("View details for order:", order.id);
  router.push({ name: "order-details", params: { id: order.id } });
};

const handleDateChange = () => {
  if (dateRange.value && dateRange.value.length === 2) {
    startDateFilter.value = dateRange.value[0];
    endDateFilter.value = dateRange.value[1];
  } else {
    startDateFilter.value = "";
    endDateFilter.value = "";
  }
  fetchOrders(1);
};

// ==============================
// API Logic
// ==============================
const fetchOrders = async (page: number) => {
  try {
    const params: any = {
      limit,
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
    console.log("Fetched orders:", data.data.orders);
    orders.value = data.data.orders;
    totalOrders.value = data.data.totalOrders;
    totalPages.value = Math.ceil(data.data.totalOrders / limit);
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

// ==============================
// Lifecycle
// ==============================
onMounted(() => {
  fetchOrders(currentPage.value);
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-bold">Orders Lists</h1>

    <!-- Filter Section -->
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center">
        <label class="mr-2">Status:</label>

        <el-select
          v-model="statusFilter"
          multiple
          placeholder="Select"
          style="width: 240px"
          @change="fetchOrders(1)"
        >
          <el-option
            v-for="item in [
              { label: 'Pending', value: 'pending' },
              { label: 'Processing', value: 'processing' },
              { label: 'Shipped', value: 'shipped' },
              { label: 'Delivered', value: 'delivered' },
              { label: 'Canceled', value: 'canceled' },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

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
        <Dropdown
          v-model="sortBy"
          :selected-option="{ label: 'Default', value: 'default' }"
          :options="[
            { label: 'Default', value: 'default' },
            { label: 'Date', value: 'createdAt' },
            { label: 'Total', value: 'totalAmount' },
            { label: 'Order', value: 'orderNumber' },
          ]"
          @update:modelValue="fetchOrders(1)"
        />
      </div>

      <div class="flex items-center">
        <label class="mr-2">Order:</label>
        <Dropdown
          v-model="sortOrder"
          :selected-option="{ label: 'Descending', value: 'desc' }"
          :options="[
            { label: 'Descending', value: 'desc' },
            { label: 'Ascending', value: 'asc' },
          ]"
          @update:modelValue="fetchOrders(1)"
        />
      </div>
    </div>

    <!-- Table for Orders -->
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
        <Dropdown
          v-model="item.status"
          :selected-option="{
            label: capitalize(item.status),
            value: item.status,
          }"
          :options="getNextStatusOptions(item.status)"
          :btn-bg-color-class="getStatusClasses(item.status).bg"
          :btn-text-color-class="getStatusClasses(item.status).text"
          @update:model-value="updateOrderStatus(item.id, $event)"
        />
      </template>

      <template #column-actions="{ item }">
        <ActionsList
          :items="[{ label: 'View Details', action: () => viewDetails(item) }]"
        />
      </template>
    </Table>

    <Pagination
      title="orders"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalItems="totalOrders"
      :limit="limit"
      @changePage="(page) => fetchOrders(page)"
    />
  </div>
</template>

<style scoped>
/* Custom styling for the date picker */
:deep(.el-date-editor .el-range-separator) {
  padding: 0;
  color: inherit;
}
</style>
