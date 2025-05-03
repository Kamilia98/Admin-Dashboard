<template>
  <div class="grid grid-cols-3 gap-2">
    <!-- Left Profile Section -->
    <div class="rounded-xl border bg-white p-6 shadow">
      <div class="flex flex-col items-center text-center">
        <img
          :src="user?.thumbnail"
          alt="User"
          class="mb-4 h-20 w-20 rounded-full"
        />
        <h2 class="text-lg font-semibold">{{ user?.username }}</h2>
        <p class="text-sm text-gray-500">{{ user?.email }}</p>
        <p class="text-sm text-gray-500">{{ user?.phone }}</p>
      </div>
      <div class="mt-6 space-y-2 text-sm text-gray-700">
        <p>
          <span class="font-medium text-gray-500">Registered Since:</span>
          {{ user?.createdAt }}
        </p>
        <!-- <p>
          <span class="font-medium text-gray-500">Favourite Item:</span>
          {{ user?.favouriteItem }}
        </p> -->
        <p>
          <span class="font-medium text-gray-500">Role:</span> {{ user?.role }}
        </p>
      </div>
    </div>

    <!-- Right Orders Section -->
    <div class="col-span-2 space-y-6">
      <!-- Order Stats Card -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-xl border bg-white p-6 text-center shadow">
          <h4 class="text-sm text-gray-500">Total Order</h4>
          <div class="mt-2 text-3xl font-bold">
            {{ orderStore.orders.length }}
          </div>
          <!-- <p class="mt-1 text-xs text-gray-400">Avg Order Value: $200</p> -->
        </div>
        <div class="rounded-xl border bg-white p-6 text-center shadow">
          <h4 class="text-sm text-gray-500">Total Amount</h4>
          <div class="mt-2 text-3xl font-bold">{{ 5138 }}</div>
          <!-- <p class="mt-1 text-xs text-gray-400">Avg Order Value: $200</p> -->
        </div>
      </div>

      <!-- Custom Orders Table -->
      <!-- <div class="rounded-xl border bg-white p-6 shadow">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">All Orders</h3>
          <el-button :icon="FilterIcon">Filter</el-button>
        </div>
        <Table
          caption="Order List"
          :headers="tableHeaders"
          :items="orders"
          row-key="id"
          :loading="loading"
        >
          <template #column-status="{ value }">
            <el-tag :type="statusTag(value)">
              {{ value }}
            </el-tag>
          </template>
        </Table>
      </div> -->
      <!-- Reusable Order Table Component -->
      <OrderManager :userId="user?._id" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElTag, ElButton } from 'element-plus';
import Table from '../components/common/Table.vue';
import OrderManager from '../components/orders/OrderManager.vue';
import FilterIcon from '../icons/FilterIcon.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useOrdersStore } from '../stores/orderStore';

const tableHeaders = [
  { key: 'orderNumber', label: 'Order ID', sortable: false },
  { key: 'createdAt', label: 'Date & Time', sortable: false },
  { key: 'country', label: 'Country', sortable: false },
  { key: 'paymentMethod', label: 'Payment Method', sortable: false },
  { key: 'total', label: 'Amount', sortable: false },
  { key: 'status', label: 'Status', sortable: false },
];
interface User {
  username: string;
  email: string;
  thumbnail: string;
  phone: number;
  role: string;
  _id: string;
  createdAt: string;
  favourites: [];
}

const orderStore = useOrdersStore();
const loading = ref(false);
const route = useRoute();
const user = ref<User | null>(null);
let totalAmount = ref(0);
const orders = ref([]);
const totalOrders = ref(0);

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
    user.value!.createdAt = formatted;
    console.log('🚀 ~ fetchUser ~ user:', data.data.user);
    console.log(
      '🚀 ~ fetchUser ~ formatted:',
      // user?.value?.favourites[1]?.toString(),
    );
    // pId.value = user?.value?.favourites[0]?.toString() || '';
  } catch (error) {
    console.error('Error fetching user:', error);
    loading.value = false;
  }
};
// const fetchProducts = async (favouriteID: string) => {
//   try {
//     loading.value = true;
//     const { data } = await axios.get(
//       `http://localhost:5000/products/${favouriteID}`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         params: {
//           product_id: favouriteID,
//         },
//       },
//     );
//     loading.value = false;
//     console.log('🚀 ~ fetchProducts ~ data:', data.data.product);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     loading.value = false;
//   }
// };

const fetchOrders = async (userId: string) => {
  try {
    loading.value = true;
    const { data } = await axios.get(`http://localhost:5000/orders/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      params: {
        userId,
      },
    });
    loading.value = false;
    orders.value = data.data.orders;
    // orders.value = data.data.orders.map((order: any) => ({
    //   ...order,
    // }));
    console.log('🚀 ~ fetchOrders ~ orders:', orders.value);
    totalOrders.value = data.data.totalOrders;
    totalAmount.value = orders.value.reduce((acc: number, order: any) => {
      return acc + Number(order.total || 0);
    }, 0);
    console.log('🚀 ~ fetchOrders ~ totalAmount:', totalAmount.value);
  } catch (error) {
    console.error('Error fetching orders:', error);
    loading.value = false;
  }
};
onMounted(() => {
  fetchUser(route.params.userId as string);
  fetchOrders(route.params.userId as string);
  // fetchProducts(pId.value);
});
function statusTag(status: string) {
  switch (status) {
    case 'Delivered':
      return 'success';
    case 'On way':
      return 'warning';
    case 'Canceled':
      return 'danger';
    default:
      return 'info';
  }
}
</script>
