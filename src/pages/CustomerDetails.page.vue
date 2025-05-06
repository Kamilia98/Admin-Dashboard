<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
    <!-- Left Profile Section -->
    <ElCard
      class="col-span-1 rounded-xl border custom-border bg-white p-6 shadow md:col-span-1"
    >
      <div class="flex items-center gap-10 text-center">
        <div class="relative inline-block">
          <div class="mb-4 h-20 w-20 rounded-full bg-white">
            <img :src="user?.thumbnail" alt="User Image" class="rounded-full" />
          </div>
          <el-icon
            v-if="user?.isEstablished"
            class="absolute -top-7 -right-6 rounded-full bg-transparent ring-2 ring-transparent"
          >
            <CircleCheckFilled class="text-green-600" />
          </el-icon>
        </div>
        <h2 class="pb-5 text-lg font-semibold dark:text-white">
          {{ user?.username }}
        </h2>
      </div>
      <div class="mt-6 flex flex-col gap-4 space-y-2 text-sm text-gray-700">
        <p>
          <span class="font-medium text-gray-500 dark:text-gray-300"
            >Email:
          </span>
          <span class="dark:text-white">
            {{ user?.email }}
          </span>
        </p>
        <p>
          <span class="font-medium text-gray-500 dark:text-gray-300"
            >Registered Since:
          </span>
          <span class="dark:text-white">
            {{ user?.createdAt }}
          </span>
        </p>

        <p>
          <span class="font-medium text-gray-500 dark:text-gray-300"
            >Phone:</span
          >
          <template v-if="user?.phone" class="dark:text-white">
            {{ user?.phone }}
          </template>
          <template v-else>
            <span class="ml-2 text-gray-800 dark:text-white"
              >No phone number</span
            >
          </template>
        </p>
        <p>
          <span class="font-medium text-gray-500 dark:text-gray-300"
            >Gender:
            <span class="text-gray-800 dark:text-white">
              {{ user?.gender }}</span
            ></span
          >
        </p>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          <span class="font-medium text-gray-500 dark:text-gray-300"
            >Favourite Items:</span
          >
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
            <span class="ml-2 text-gray-400 dark:text-white"
              >No favourites</span
            >
          </template>
        </p>
      </div>
    </ElCard>

    <!-- Right Orders Section -->
    <div class="col-span-1 space-y-6 md:col-span-3">
      <!-- Order Stats Card -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ElCard
          shadow="hover"
          class="rounded-2xl border custom-border p-6 text-center shadow"
        >
          <h4 class="text-sm text-gray-500 dark:text-white">Total Order</h4>
          <div class="mt-2 text-3xl font-bold dark:text-white">
            {{ orderStore.totalOrders }}
          </div>
        </ElCard>
        <ElCard
          shadow="hover"
          class="rounded-2xl border custom-border bg-white p-6 text-center shadow"
        >
          <h4 class="text-sm text-gray-500 dark:text-white">Total Amount</h4>
          <div class="mt-2 text-3xl font-bold dark:text-white">
            {{ totalAmount.toFixed(2) }}
          </div>
        </ElCard>
        <ElCard
          shadow="hover"
          class="rounded-2xl border custom-border bg-white p-6 text-center shadow"
        >
          <h4 class="text-sm text-gray-500 dark:text-white">
            Average Order Value
          </h4>
          <div class="mt-2 text-3xl font-bold dark:text-white">
            {{ averageAmount.toFixed(2) }}
          </div>
        </ElCard>
      </div>
      <!-- Purchase Chart Component -->
      <!-- :userId="user?._id"
        :totalAmount="totalAmount"
        :averageAmount="averageAmount"
        :totalOrders="orderStore.totalOrders" -->
      <PurchaseChart />
      <!-- Reusable Order Table Component -->
      <ElCard
        class="flex flex-col gap-4 rounded-xl border custom-border bg-white p-6 shadow"
      >
        <!-- <OrderManager :userId="user?._id" /> -->
        <OrderManager
          :userId="user?._id"
          :limit="2"
          :currentPage="orderStore.currentPage"
        />
      </ElCard>
      <Pagination
        title="Order Pagination"
        :currentPage="orderStore.currentPage"
        :totalPages="Math.ceil(orderStore.totalPages / 2)"
        :totalItems="orderStore.totalOrdersWithUser"
        :limit="2"
        @changePage="orderStore.fetchOrders"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProductStore } from '../stores/productStore';
import { CircleCheckFilled, User } from '@element-plus/icons-vue';
import { ElIcon } from 'element-plus';
import Pagination from '../components/common/Pagination.vue';
import OrderManager from '../components/orders/OrderManager.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useOrdersStore } from '../stores/orderStore';
import { ElCard } from 'element-plus';
import PurchaseChart from '../components/customers/PurchaseChart.vue';

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
// const currentPage = ref(1);
const totalAmount = computed(() => orderStore.totalAmount);
const averageAmount = computed(() => orderStore.averageAmount);
// const totalOrdersWithUser = computed(() => orderStore.totalOrdersWithUser);
// function handlePageChange(page: number) {
//   console.log(page);
//   console.log(555555555555555555555);
//   currentPage.value = page;
// }
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
