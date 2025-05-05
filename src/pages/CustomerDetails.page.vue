<template>
  <div class="grid grid-cols-3 gap-2">
    <!-- Left Profile Section -->
    <div class="rounded-xl border custom-border bg-white p-6 shadow">
      <div class="flex items-center gap-10 text-center">
        <div class="relative inline-block">
          <img
            :src="user?.thumbnail"
            alt="User Image"
            class="mb-4 h-20 w-20 rounded-full"
          />
          <el-icon
            v-if="user?.isEstablished"
            class="absolute -top-7 -right-6 rounded-full bg-transparent ring-2 ring-transparent"
          >
            <CircleCheckFilled class="text-green-600" />
          </el-icon>
        </div>
        <h2 class="text-lg font-semibold">{{ user?.username }}</h2>
      </div>
      <div class="mt-6 flex flex-col gap-4 space-y-2 text-sm text-gray-700">
        <p>
          <span class="font-medium text-gray-500">Email:</span>
          {{ user?.email }}
        </p>
        <p>
          <span class="font-medium text-gray-500">Registered Since:</span>
          {{ user?.createdAt }}
        </p>

        <p>
          <span class="font-medium text-gray-500">Phone:</span>
          <template v-if="user?.phone">
            {{ user?.phone }}
          </template>
          <template v-else>
            <span class="ml-2 text-gray-800">No phone number</span>
          </template>
        </p>
        <p>
          <span class="font-medium text-gray-500"
            >Gender:
            <span class="text-gray-800"> {{ user?.gender }}</span></span
          >
        </p>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          <span class="font-medium text-gray-500">Favourite Items:</span>
          <template v-if="favouriteProducts.length > 0">
            <span class="mt-1 flex flex-wrap gap-2">
              <span
                v-for="(fav, index) in favouriteProducts"
                :key="index"
                class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-700 dark:text-white"
              >
                {{ fav }}
              </span>
            </span>
          </template>
          <template v-else>
            <span class="ml-2 text-gray-400">No favourites</span>
          </template>
        </p>
      </div>
    </div>

    <!-- Right Orders Section -->
    <div class="col-span-2 space-y-6">
      <!-- Order Stats Card -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          class="rounded-xl border custom-border bg-white p-6 text-center shadow"
        >
          <h4 class="text-sm text-gray-500">Total Order</h4>
          <div class="mt-2 text-3xl font-bold">
            {{ orderStore.orders.length }}
          </div>
        </div>
        <div
          class="rounded-xl border custom-border bg-white p-6 text-center shadow"
        >
          <h4 class="text-sm text-gray-500">Total Amount</h4>
          <div class="mt-2 text-3xl font-bold">
            {{ totalAmount.toFixed(2) }}
          </div>
        </div>
        <div
          class="rounded-xl border custom-border bg-white p-6 text-center shadow"
        >
          <h4 class="text-sm text-gray-500">Average Order Value</h4>
          <div class="mt-2 text-3xl font-bold">
            {{ (totalAmount / (orderStore.orders.length || 1)).toFixed(2) }}
          </div>
        </div>
      </div>

      <!-- Reusable Order Table Component -->
      <div
        class="flex flex-col gap-4 rounded-xl border custom-border bg-white p-6 shadow"
      >
        <OrderManager :userId="user?._id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProductStore } from '../stores/productStore';
import { CircleCheckFilled, User } from '@element-plus/icons-vue';
import { ElIcon } from 'element-plus';
import OrderManager from '../components/orders/OrderManager.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useOrdersStore } from '../stores/orderStore';

interface User {
  username: string;
  email: string;
  thumbnail: string;
  phone: number;
  role: string;
  _id: string;
  createdAt: string;
  gender: string;
  favourites: string[];
  isEstablished: boolean;
}
const productStore = useProductStore();
const orderStore = useOrdersStore();
const loading = ref(false);
const favouriteProducts = ref<string[]>([]);
const route = useRoute();
const user = ref<User | null>(null);
const totalAmount = computed(() => {
  return orderStore.orders.reduce((acc: number, order: any) => {
    return acc + Number(order.totalAmount || 0);
  }, 0);
});

const fetchUser = async (userId: string) => {
  try {
    loading.value = true;
    const { data } = await axios.get(`http://localhost:5000/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    loading.value = false;
    user.value = data.data.user;
    const formatted = new Date(data.data.user.createdAt).toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    );
    user.value!.isEstablished =
      new Date(user.value!.createdAt) < new Date('2025-04-20');
    user.value!.createdAt = formatted;
    favouriteProducts.value = await Promise.all(
      user.value!.favourites.map(async (favourite) => {
        return await productStore
          .getProductById(favourite.toString())
          .then((product) => {
            return product!.name;
          });
      }),
    );
    console.log('🚀 ~ fetchUser ~ favouriteProducts:', favouriteProducts);
  } catch (error) {
    console.error('Error fetching user:', error);
    loading.value = false;
  }
};
onMounted(() => {
  fetchUser(route.params.userId as string);
});
</script>
<style scoped>
.el-icon {
  width: 24px;
}
.el-icon svg {
  width: 2em;
  height: 2em;
}
</style>
