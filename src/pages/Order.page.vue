<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '../stores/orderStore';
import { type Order } from '../types/order.d';
import { formatDate } from '../utils/formatDate';
import OrderStatusSelector from '../components/orders/OrderStatusSelector.vue';
import ResourceWrapper from '../components/common/ResourceWrapper.vue';

const route = useRoute();
const store = useOrdersStore();

const order = ref<Order | null>(null);

onMounted(async () => {
  const id = route.params.id as string;
  if (!id) throw new Error('No order ID found in route');
  order.value = await store.fetchOrderById(id);
});
</script>

<template>
  <div class="mx-auto min-h-screen">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white/90">
        Order Details
      </h1>
    </div>

    <ResourceWrapper :loading="store.loading" :error="store.error">
      <!-- Order Details -->
      <template v-if="order">
        <div
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
                <OrderStatusSelector
                  :status="order.status"
                  :order-id="order.id"
                  @update="order.status = $event"
                />
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
              <h4 class="text-sm font-medium text-gray-500">
                Shipping Address
              </h4>
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
                      Color
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                    >
                      quantity
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
                          class="flex flex-shrink-0 items-center justify-center bg-gray-200 dark:bg-gray-700"
                        >
                          <img
                            :src="item.image"
                            alt=""
                            class="h-15 w-15 rounded-md object-cover"
                          />
                        </div>
                        <div class="ml-4">
                          <div
                            class="text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            {{ item.name }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">
                            SKU: {{ item.sku || 'N/A' }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      <div
                        class="h-8 w-8 rounded-full border border-gray-200 shadow"
                        :title="item.color.name"
                        :style="{ backgroundColor: item.color.hex }"
                      ></div>
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
          <div class="bg-gray-50 px-4 py-5 sm:px-6 dark:bg-white/[0.03]">
            <div class="flex justify-end">
              <div class="w-full max-w-md space-y-4">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >Subtotal</span
                  >
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    ${{ order.totalAmount }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >Shipping</span
                  >
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    $0.00
                  </span>
                </div>
                <div
                  class="flex justify-between border-t border-gray-200 pt-4 dark:border-gray-700"
                >
                  <span
                    class="text-base font-medium text-gray-900 dark:text-gray-100"
                  >
                    Total
                  </span>
                  <span
                    class="text-base font-bold text-gray-900 dark:text-gray-100"
                  >
                    ${{ order.totalAmount }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >Payment Method</span
                  >
                  <span
                    class="text-sm font-medium text-gray-900 capitalize dark:text-gray-100"
                  >
                    {{ order.paymentMethod }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ResourceWrapper>
  </div>
</template>
