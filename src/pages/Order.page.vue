<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  image: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  zipCode: string;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  status: string;
  totalAmount: string;
  user: User;
  orderItems: OrderItem[];
}

const route = useRoute();
const order = ref<Order | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const fetchOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await axios.get<{ data: Order }>(
      `http://localhost:5000/orders/${id}`,
      {},
    );

    if (!response.data?.data) {
      throw new Error("Invalid response structure");
    }

    console.log("Order data:", response.data);
    return response.data.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const serverMessage = err.response?.data?.message;
      const statusMessage = err.response?.statusText;
      throw new Error(
        serverMessage || statusMessage || "Failed to fetch order details",
      );
    } else if (err instanceof Error) {
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};

const formatDate = (dateString: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (err) {
    console.error("Date formatting error:", err);
    return "Invalid date";
  }
};

onMounted(async (): Promise<void> => {
  try {
    const id = route.params.id as string;
    if (!id) {
      throw new Error("No order ID provided in route parameters");
    }

    order.value = await fetchOrderById(id);
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : "An unknown error occurred";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white/90">
          Order Details
        </h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div
          class="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mb-8 rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error loading order
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details -->
      <div
        v-else-if="order"
        class="overflow-hidden border-gray-200 bg-white shadow sm:rounded-lg dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <!-- Order Summary -->
        <div
          class="border-b border-gray-200 px-4 py-5 sm:px-6 dark:border-gray-800"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3
                class="text-lg leading-6 font-medium text-gray-900 dark:text-white/90"
              >
                Order #{{ order.orderNumber }}
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Placed on {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <div class="mt-3 sm:mt-0">
              <span
                :class="{
                  'bg-green-100 text-green-600':
                    order.status.toLowerCase() === 'delivered',
                  'bg-purple-100 text-purple-600':
                    order.status.toLowerCase() === 'processing',
                  'bg-blue-100 text-blue-600':
                    order.status.toLowerCase() === 'shipped',
                  'bg-amber-100 text-amber-500':
                    order.status.toLowerCase() === 'pending',
                  'bg-red-100 text-red-600':
                    order.status.toLowerCase() === 'canceled',
                }"
                class="rounded-full px-3 py-1 text-xs font-medium"
              >
                {{
                  order.status.charAt(0).toUpperCase() + order.status.slice(1)
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Customer and Shipping Info -->
        <div
          class="border-b border-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:border-gray-800"
        >
          <div class="sm:col-span-1">
            <h4 class="text-sm font-medium text-gray-500">
              Customer Information
            </h4>
          </div>
          <div class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <p class="dark:text-white/90">{{ order.user.username }}</p>
            <p class="text-gray-500">{{ order.user.email }}</p>
            <p class="text-gray-500">{{ order.shippingAddress.phone }}</p>
          </div>
        </div>

        <div
          class="border-b border-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:border-gray-800"
        >
          <div class="sm:col-span-1">
            <h4 class="text-sm font-medium text-gray-500">Shipping Address</h4>
          </div>
          <div
            class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white/90"
          >
            <p>{{ order.shippingAddress.address }}</p>
            <p>
              {{ order.shippingAddress.city }},
              {{ order.shippingAddress.zipCode }}
            </p>
            <p>{{ order.shippingAddress.country }}</p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="px-4 py-5 sm:px-6">
          <h4 class="mb-4 text-sm font-medium text-gray-500">Order Items</h4>
          <div
            class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
          >
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-white/[0.03]">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Total
                  </th>
                </tr>
              </thead>

              <tbody
                class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-white/[0.03]"
              >
                <tr v-for="(item, index) in order.orderItems" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-gray-200 dark:bg-gray-700"
                      >
                        <img
                          :src="item.image"
                          alt=""
                          class="rounded-md object-cover"
                        />
                      </div>
                      <div class="ml-4">
                        <div
                          class="text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          {{ item.name }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          SKU: {{ item.sku || "N/A" }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
                  >
                    {{ item.quantity }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
                  >
                    ${{ item.price }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100"
                  >
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-gray-50 dark:bg-white/[0.03] px-4 py-5 sm:px-6">
  <div class="flex justify-end">
    <div class="w-full max-w-md space-y-4">
      <div class="flex justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
          ${{ order.totalAmount }}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">Shipping</span>
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
          $0.00
        </span>
      </div>
      <div class="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <span class="text-base font-medium text-gray-900 dark:text-gray-100">
          Total
        </span>
        <span class="text-base font-bold text-gray-900 dark:text-gray-100">
          ${{ order.totalAmount }}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">Payment Method</span>
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
          {{ order.paymentMethod }}
        </span>
      </div>
    </div>
  </div>
</div>

      </div>

      <!-- No Order Found -->
      <div v-else class="py-12 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No order found</h3>
        <p class="mt-1 text-sm text-gray-500">
          We couldn't find the order you're looking for.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles can be added here */
</style>
