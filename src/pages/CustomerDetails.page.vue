<template>
  <div class="flex flex-row gap-6 p-6">
    <!-- Left Profile Section -->
    <div class="w-full max-w-sm rounded-xl border bg-white p-6 shadow">
      <div class="flex flex-col items-center text-center">
        <img
          src="https://i.pravatar.cc/100"
          alt="User"
          class="mb-4 h-20 w-20 rounded-full"
        />
        <h2 class="text-lg font-semibold">Cameron Green</h2>
        <p class="text-sm text-gray-500">userid1001@gmail.com</p>
        <p class="text-sm text-gray-500">+880 123456789</p>
      </div>
      <div class="mt-6 space-y-2 text-sm text-gray-700">
        <p>
          <span class="font-medium text-gray-500">Registered Since:</span> 20
          Aug 2021
        </p>
        <p>
          <span class="font-medium text-gray-500">Favourite Item:</span> Pizza
        </p>
      </div>
    </div>

    <!-- Right Orders Section -->
    <div class="flex-1 space-y-6">
      <!-- Order Stats Card -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-xl border bg-white p-6 text-center shadow">
          <h4 class="text-sm text-gray-500">Total Order</h4>
          <div class="text-3xl font-bold">290</div>
          <p class="mt-1 text-xs text-gray-400">Avg Order Value: $200</p>
        </div>
      </div>

      <!-- Custom Orders Table -->
      <div class="rounded-xl border bg-white p-6 shadow">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElTag, ElButton } from 'element-plus';
import Table from '../components/common/Table.vue';
import FilterIcon from '../icons/FilterIcon.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const tableHeaders = [
  { key: 'orderNumber', label: 'Order ID', sortable: false },
  { key: 'createdAt', label: 'Date & Time', sortable: false },
  { key: 'country', label: 'Country', sortable: false },
  { key: 'paymentMethod', label: 'Payment Method', sortable: false },
  { key: 'total', label: 'Amount', sortable: false },
  { key: 'status', label: 'Status', sortable: false },
];

const orderss = [
  {
    id: '#00745',
    date: 'Fri, 04-30-21',
    country: 'USA',
    payment: 'Bank Transfer',
    amount: '$120.00',
    status: 'Delivered',
  },
  {
    id: '#00343',
    date: 'Fri, 04-30-21',
    country: 'UK',
    payment: 'Ewallets',
    amount: '$90.00',
    status: 'On way',
  },
  {
    id: '#00865',
    date: 'May 13, 2022',
    country: 'Germany',
    payment: 'Cash',
    amount: '$240.00',
    status: 'Delivered',
  },
  {
    id: '#00865',
    date: 'Mar 13, 2022',
    country: 'France',
    payment: 'Direct Deposit',
    amount: '$50.43',
    status: 'Canceled',
  },
];
const loading = ref(false);
// const router = useRouter();
const route = useRoute();
const orders = ref([]);
const totalOrders = ref(0);
// const fetchOrders = async () => {
//   const token = localStorage.getItem('token');
//   loading.value = true;
//   try {
//     const { data } = await axios.get('http://localhost:5000/orders', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     orders.value = data.data.orders;
//     totalOrders.value = data.data.totalOrders;
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//   } finally {
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
    // orders.value = data.data.orders;
    orders.value = data.data.orders.map((order: any) => ({
      ...order,
    }));
    console.log('🚀 ~ fetchOrders ~ orders:', orders.value);
    totalOrders.value = data.data.totalOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    loading.value = false;
  }
};
onMounted(() => {
  fetchOrders(route.params.userId as string);
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
