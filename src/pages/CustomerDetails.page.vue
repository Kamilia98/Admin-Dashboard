<script lang="ts" setup>
import { CircleCheckFilled, User } from '@element-plus/icons-vue';
import { ElIcon } from 'element-plus';
import Pagination from '../components/common/Pagination.vue';
import OrderManager from '../components/orders/OrderManager.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '../stores/orderStore';
import { ElCard } from 'element-plus';
import PurchaseChart from '../components/customers/PurchaseChart.vue';
import { useCustomerStore } from '../stores/customerStore';
import { storeToRefs } from 'pinia';

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
// const productStore = useProductStore();
// const currentPage = ref(1);
//  const favTest = [
//   'test1',
//   'test2',
//   'test3',
//   'test4',
//   'test5',
//   'test6',
//   'test7',
//   'test8',
//   'test9',
//   'test10',
// ];
// function handlePageChange(page: number) {
//   console.log(page);
//   console.log(555555555555555555555);
//   currentPage.value = page;
// }
// const fetchUser = async (userId: string) => {
//   try {
//     loading.value = true;
//     const { data } = await axios.get(`http://localhost:5000/users/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     loading.value = false;
//     user.value = data.data.user;
//     const formatted = new Date(data.data.user.createdAt).toLocaleString(
//       'en-US',
//       {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       },
//     );
//     user.value!.isEstablished =
//       new Date(user.value!.createdAt) < new Date('2025-04-20');
//     user.value!.createdAt = formatted;
//     favouriteProducts.value = await Promise.all(
//       user.value!.favourites.map(async (favourite) => {
//         return await productStore
//           .getProductById(favourite.toString())
//           .then((product) => {
//             return product!.name;
//           });
//       }),
//     );
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     loading.value = false;
//   }
// };
const currentPage = ref(1);
const limit = ref(2);
const route = useRoute();
const orderStore = useOrdersStore();
const customerStore = useCustomerStore();
const { favourites } = storeToRefs(customerStore);
const user = ref<User | null>(null);

onMounted(async () => {
  const fetchedUser = await customerStore.fetchCustomer(
    route.params.userId as string,
  );
  user.value = fetchedUser || null;
  orderStore.fetchOrderAnalytics(user.value?._id);
});
// watch(user, (newUser) => {
//   user.value = newUser;
//   console.log(user.value);
// });
// function handlePageChange(page: number) {
//   currentPage.value = page;
// }
// watch(currentPage, (newPage) => {
//   orderStore.fetchOrders({
//     page: newPage,
//     limit: limit.value,
//     userId: route.params.userId as string,
//   });
// });

const averageOrderValue = computed(() => {
  return (
    orderStore.totalOrders > 0
      ? orderStore.totalRevenue / orderStore.totalOrders
      : 0
  ).toFixed(2);
});
</script>
<template>
  <div class="space-y-6">
    <!-- Top section: Profile + Stats/Chart side by side -->
    <div class="flex flex-col items-stretch gap-4 md:flex-row">
      <!-- Left Profile Section -->
      <ElCard
        class="w-full self-stretch rounded-xl border custom-border bg-white p-6 shadow md:w-1/4"
      >
        <div class="flex items-center gap-10 text-center">
          <div class="relative inline-block">
            <div class="mb-4 h-20 w-20 rounded-full bg-white">
              <img
                :src="user?.thumbnail"
                alt="User Image"
                class="rounded-full"
              />
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
          <div>
            <span class="font-medium text-gray-500 dark:text-gray-300"
              >Email:</span
            >
            <p class="ps-2 pt-2 dark:text-white">{{ user?.email }}</p>
          </div>

          <div>
            <span class="font-medium text-gray-500 dark:text-gray-300"
              >Registered Since:</span
            >
            <p class="ps-2 pt-2 dark:text-white">{{ user?.createdAt }}</p>
          </div>

          <p>
            <span class="font-medium text-gray-500 dark:text-gray-300"
              >Phone:</span
            >
            <template v-if="user?.phone">
              <p class="ps-2 pt-2 text-gray-800 dark:text-white">
                {{ user?.phone }}
              </p>
            </template>
            <template v-else>
              <p class="ml-2 pt-2 text-gray-800 dark:text-white">
                No phone number
              </p>
            </template>
          </p>

          <div>
            <span class="font-medium text-gray-500 dark:text-gray-300"
              >Gender:</span
            >
            <p class="ps-2 pt-2 text-gray-800 dark:text-white">
              {{ user?.gender }}
            </p>
          </div>

          <p class="text-sm text-gray-700 dark:text-gray-300">
            <span class="font-medium text-gray-500 dark:text-gray-300"
              >Favourite Items:</span
            >
            <template v-if="favourites.length > 0">
              <span class="mt-1 flex flex-wrap gap-2">
                <span
                  v-for="(fav, index) in favourites"
                  :key="index"
                  class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-700 dark:text-white"
                >
                  {{ fav }}
                </span>
              </span>
            </template>
            <template v-else>
              <p class="ml-2 text-gray-400 dark:text-white">No favourites</p>
            </template>
          </p>
        </div>
      </ElCard>

      <!-- Right Section (Stats + Chart) -->
      <div class="w-full self-stretch md:w-3/4">
        <div class="flex h-full flex-col justify-between space-y-6">
          <!-- Order Stats Cards -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ElCard
              shadow="hover"
              class="rounded-2xl border custom-border p-6 text-center shadow"
            >
              <h4 class="text-sm text-gray-500 dark:text-white">
                Total Orders
              </h4>
              <div class="mt-2 text-3xl font-bold dark:text-white">
                {{ orderStore.totalOrders }}
              </div>
            </ElCard>
            <ElCard
              shadow="hover"
              class="rounded-2xl border custom-border bg-white p-6 text-center shadow"
            >
              <h4 class="text-sm text-gray-500 dark:text-white">
                Total Amount
              </h4>
              <div class="mt-2 text-3xl font-bold dark:text-white">
                {{ orderStore.totalRevenue }}
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
                {{ averageOrderValue }}
              </div>
            </ElCard>
          </div>

          <!-- Purchase Chart -->
          <PurchaseChart
            :orders="
              orderStore.orders.map((order) => ({
                ...order,
                totalAmount: parseFloat(order.totalAmount),
              }))
            "
          />
        </div>
      </div>
    </div>

    <!-- Full Width OrderManager -->
    <ElCard
      class="flex w-full flex-col gap-4 rounded-xl border custom-border bg-white p-6 shadow"
    >
      <OrderManager
        v-if="user?._id"
        :userId="user?._id"
        :limit="2"
        class="w-full"
      />
    </ElCard>
  </div>
</template>

<style scoped>
.el-icon {
  width: 24px;
}
.el-icon svg {
  width: 2em;
  height: 2em;
}
</style>
