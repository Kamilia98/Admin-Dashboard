<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import Dropdown from "../components/Dropdown.vue";
import Pagination from "../components/Pagination.vue";

// ========== State ==========
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

// ========== Filters ==========
const statusFilter = ref<string>("all");
const startDateFilter = ref<string>("");
const endDateFilter = ref<string>("");

// ========== Sorting ==========
const sortBy = ref<string>("default");
const sortOrder = ref<string>("desc");

// ========== Dropdown for Status Change ==========
const openDropdownId = ref<string | null>(null);

const toggleDropdown = (orderId: string) => {
  openDropdownId.value = openDropdownId.value === orderId ? null : orderId;
};

const closeDropdown = () => {
  openDropdownId.value = null;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".dropdown-container")) {
    closeDropdown();
  }
};

function getNextStatusOptions(
  currentStatus: OrderStatus,
): { label: string; value: OrderStatus }[] {
  if (currentStatus === "cancelled" || currentStatus === "delivered") {
    return [];
  }

  const currentIndex = orderStages.indexOf(currentStatus);

  if (currentIndex === -1)
    return [{ label: capitalize(currentStatus), value: currentStatus }];

  const options: { label: string; value: OrderStatus }[] = [];

  const nextStage = orderStages[currentIndex + 1];
  if (nextStage) {
    options.push({ label: capitalize(nextStage), value: nextStage });
  }

  // Add 'cancelled' as an option
  options.push({ label: "Cancelled", value: "cancelled" });

  return options;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ========== API Calls ==========
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
    if (statusFilter.value !== "all") {
      params.status = statusFilter.value;
    }

    const response = await axios.get("http://localhost:5000/orders/all", {
      params,
    });

    orders.value = response.data.data.orders;
    totalOrders.value = response.data.data.totalOrders;
    totalPages.value = Math.ceil(response.data.data.totalOrders / limit);
    currentPage.value = page;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const res = await axios.patch(
      `http://localhost:5000/orders/${orderId}/status`,
      { status: newStatus },
    );
    console.log(res.data);

    const order = orders.value.find((o) => o.id === orderId);
    if (order) order.status = newStatus;
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

// ========== Lifecycle ==========
onMounted(() => {
  window.addEventListener("click", handleClickOutside);
  fetchOrders(currentPage.value);
});

// ========== Status Classes ==========
type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "cancelled"
  | "delivered";

type StatusClasses = {
  bg: string;
  text: string;
};

const statusMap: Record<OrderStatus, StatusClasses> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-600" },
  processing: { bg: "bg-purple-200", text: "text-purple-800" },
  shipped: { bg: "bg-blue-200", text: "text-blue-800" },
  delivered: { bg: "bg-green-200", text: "text-green-800" },
  cancelled: { bg: "bg-red-200", text: "text-red-800" },
};

function getStatusClasses(status: OrderStatus): StatusClasses {
  return statusMap[status];
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-bold">Orders Lists</h1>

    <!-- Filter Section -->
    <div>
      <label class="mr-2">Status:</label>
      <Dropdown
        v-model="statusFilter"
        :selected-option="{ label: 'All', value: 'all' }"
        :options="[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Processing', value: 'processing' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' },
        ]"
        @update:modelValue="fetchOrders(1)"
      />

      <label class="mr-2 ml-4">Date Range:</label>
      <input
        type="date"
        v-model="startDateFilter"
        @change="fetchOrders(1)"
        class="rounded border border-[#979797] px-2 py-1"
      />
      <span class="mx-2">to</span>
      <input
        type="date"
        v-model="endDateFilter"
        @change="fetchOrders(1)"
        class="rounded border border-[#979797] px-2 py-1"
      />
    </div>

    <!-- Sorting -->
    <div>
      <label class="mr-2">Sort By:</label>
      <Dropdown
        v-model="sortBy"
        :selected-option="{ label: 'Default', value: 'default' }"
        :options="[
          { label: 'Default', value: 'default' },
          { label: 'Created At', value: 'createdAt' },
          { label: 'Total Amount', value: 'totalAmount' },
          { label: 'Order Number', value: 'orderNumber' },
        ]"
        @update:modelValue="fetchOrders(1)"
      />

      <label class="mr-2 ml-2">Order:</label>
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

    <!-- Table for Orders -->
    <div class="flex h-min overflow-x-scroll">
      <table class="min-w-full border-separate border-spacing-0 text-left">
        <thead>
          <tr class="font-normal">
            <th
              class="rounded-tl-2xl border border-r-0 border-[#979797] bg-[#fcfdfd] p-3 font-semibold"
            >
              Order Number
            </th>
            <th
              class="border-y border-[#979797] bg-[#fcfdfd] p-3 font-semibold"
            >
              User name
            </th>

            <th
              class="border-y border-[#979797] bg-[#fcfdfd] p-3 font-semibold"
            >
              Total Amount
            </th>
            <th
              class="border-y border-[#979797] bg-[#fcfdfd] p-3 font-semibold"
            >
              Created At
            </th>
            <th
              class="border-y border-[#979797] bg-[#fcfdfd] p-3 font-semibold"
            >
              Status
            </th>
            <th
              class="rounded-tr-2xl border border-l-0 border-[#979797] bg-[#fcfdfd] p-3 text-center font-semibold"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="text-sm font-normal">
          <tr v-for="order in orders" :key="order.id">
            <td class="border-b border-l border-[#979797] p-3">
              {{ order.orderNumber }}
            </td>

            <td class="border-b border-[#979797] p-3">{{ order.userName }}</td>
            <td class="border-b border-[#979797] p-3">{{ order.total }} $</td>
            <td class="border-b border-[#979797] p-3">
              {{ order.createdAt }}
            </td>
            <td class="border-b border-[#979797] p-3">
              <Dropdown
                v-model="order.status"
                :selected-option="{
                  label: capitalize(order.status),
                  value: order.status,
                }"
                :options="getNextStatusOptions(order.status)"
                :btn-bg-color-class="getStatusClasses(order.status).bg"
                :btn-text-color-class="getStatusClasses(order.status).text"
                @update:model-value="updateOrderStatus(order.id, $event)"
              />
            </td>

            <td
              class="dropdown-container relative border-r border-b border-[#979797] p-3 text-center"
            >
              <button
                @click.stop="toggleDropdown(order.id)"
                class="text-xl text-gray-600 hover:text-black"
              >
                ...
              </button>

              <div
                v-if="openDropdownId === order.id"
                class="absolute right-0 z-10 mt-2 w-32 rounded border border-[#979797] bg-white shadow-md"
              >
                <ul class="text-left text-sm">
                  <li class="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    View Details
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}

tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
  color: #25006f;
}
</style>
