<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  // ElCard,
  // ElButton,
  // ElInput,
  ElIcon,
  ElNotification,
  ElMessageBox,
  ElSelect,
  ElOption,
} from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { View } from '@element-plus/icons-vue';
import { CircleCheckFilled } from '@element-plus/icons-vue';
import Table from '../components/common/Table.vue';
import Pagination from '../components/common/Pagination.vue';
import debounce from 'lodash/debounce';
import UserGroupIcon from '../icons/UserGroupIcon.vue';
import Search from '../components/common/Search.vue';
import Card from '../components/common/Card.vue';
import CalenderIcon from '../icons/CalenderIcon.vue';
import DocsIcon from '../icons/DocsIcon.vue';
import Button from '../components/common/Button.vue';
import { useCustomerStore } from '../stores/customerStore';
import { storeToRefs } from 'pinia';
// import axios from 'axios';
// import { UserFilled } from '@element-plus/icons-vue';
// import { Calendar } from '@element-plus/icons-vue';
// import { Refresh } from '@element-plus/icons-vue';
// import { SearchIcon } from '../icons';
// import { RouterLink } from 'vue-router';
interface User {
  username: string;
  email: string;
  thumbnail: string;
  createdAt: string;
  phone: number | string;
  role: string;
  _id: string;
  isEstablished: boolean;
  isNew: boolean;
  returned: boolean;
}
const customerStore = useCustomerStore();
const {
  customers: allUsers,
  total,
  newCustomers,
  returningCustomers,
  loading,
} = storeToRefs(customerStore);
const { fetchAllCustomers, removeCustomer } = customerStore;
const currentPage = ref(1);
const limit = ref(10);
const search = ref('');
// const totalUsers = ref(0);
// const loading = ref(false);
// const allUsers = ref<User[]>([]);
// const newCustomers = ref(0);
// const returningCustomers = ref(0);

const headers = [
  { key: 'username', label: 'User', sortable: false },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'gender', label: 'Gender', sortable: false },
  { key: 'createdAt', label: 'Date & Time', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false },
];
// const fetchUsers = async (page: number) => {
//   const token = localStorage.getItem('token');
//   loading.value = true;
//   try {
//     const { data } = await axios.get('http://localhost:5000/users', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       params: {
//         page,
//         limit: limit.value,
//         search: search.value,
//         role: 'USER',
//       },
//     });
//     newCustomers.value = data.data.newCustomers;
//     allUsers.value = data.data.users;
//     allUsers.value.forEach((user: User) => {
//       user.phone = String(user.phone || 'N/A');
//     });
//     allUsers.value.forEach((user: User) => {
//       const formatted = new Date(user.createdAt).toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       });
//       user.createdAt = formatted;
//     });
//     allUsers.value.forEach((user: User) => {
//       user.isEstablished = new Date(user.createdAt) < new Date('2025-04-20');
//     });
//     returningCustomers.value = data.data.totalUsersWithOrders;
//     totalUsers.value = data.data.totalUsers;
//     console.log('Fetched users:', allUsers.value);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//   } finally {
//     loading.value = false;
//   }
// };
const debouncedFetch = debounce((page: number) => {
  fetchAllCustomers(page, limit.value, search.value);
}, 600);
onMounted(async () => {
  fetchAllCustomers(currentPage.value, limit.value, search.value);
});
watch(currentPage, (newPage) => {
  fetchAllCustomers(newPage, limit.value, search.value);
});
watch(search, () => {
  currentPage.value = 1;
  debouncedFetch(1);
});
watch(limit, () => {
  currentPage.value = 1;
  fetchAllCustomers(1, limit.value, search.value);
});
const paginatedUsers = computed(() => allUsers.value);
function handlePageChange(page: number) {
  currentPage.value = page;
}

async function deleteUser(user: User) {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete <b>${user.username}</b>?`,
      'Confirm Deletion',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        dangerouslyUseHTMLString: true,
      },
    );
    // await axios.delete(`http://localhost:5000/users/${user._id}`, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    await removeCustomer(user._id);
    ElNotification({
      title: 'Success',
      message: `User ${user.username} has been deleted.`,
      type: 'success',
      duration: 3000,
      position: 'bottom-right',
    });
    fetchAllCustomers(currentPage.value, limit.value, search.value);
  } catch (error) {
    console.log(error);
    if (error === 'cancel') {
      return;
    }
    ElNotification({
      title: 'Error',
      message: 'An unknown error occurred',
      type: 'error',
      duration: 3000,
      position: 'bottom-right',
    });
  }

  console.log('Delete user:', user);
}
</script>
<template>
  <!-- Customer Cards -->
  <div
    class="grid grid-cols-1 gap-4 pb-6 text-center sm:grid-cols-2 lg:grid-cols-3"
  >
    <!-- <el-card shadow="hover" class="rounded-2xl">
      <div class="relative flex items-center justify-center">
        <div>
          <p class="text-sm text-gray-500 dark:text-white">Total Customers</p>
          <p class="pt-2 text-2xl font-semibold text-gray-800 dark:text-white">
            {{ totalUsers }}
          </p>
        </div>
        <el-icon class="-top-1 -left-7 pt-9 text-3xl text-blue-500"
          ><UserGroupIcon class="dark:text-white"
        /></el-icon>
      </div>
    </el-card> -->

    <!-- <el-card shadow="hover" class="rounded-2xl">
      <div class="relative flex items-center justify-center">
        <div>
          <p class="text-sm text-gray-500 dark:text-white">New This Month</p>
          <p class="pt-2 text-2xl font-semibold text-gray-800 dark:text-white">
            {{ newCustomers }}
          </p>
        </div>
        <el-icon class="-top-1 -left-7 pt-8 text-3xl text-green-500"
          ><Calendar class="dark:text-white"
        /></el-icon>
      </div>
    </el-card>
    <el-card shadow="hover" class="rounded-2xl">
      <div class="relative flex items-center justify-center">
        <div>
          <p class="text-sm text-gray-500 dark:text-white">
            Returning Customers
          </p>
          <p class="pt-2 text-2xl font-semibold text-gray-800 dark:text-white">
            {{ returningCustomers }}
          </p>
        </div>
        <el-icon class="-top-1 -left-12 pt-8 text-3xl text-purple-500"
          ><Refresh class="dark:text-white"
        /></el-icon>
      </div>
    </el-card> -->
    <Card title="Total Customers" :value="total" :icon="UserGroupIcon"></Card
    ><Card
      title="New This Month"
      :value="newCustomers"
      :icon="CalenderIcon"
    ></Card
    ><Card
      title="Returning Customers"
      :value="returningCustomers"
      :icon="DocsIcon"
    ></Card>
  </div>

  <Table
    caption="Customers"
    :headers="headers"
    :items="paginatedUsers"
    :loading="loading"
    row-key="_id"
  >
    <template #actions>
      <div class="flex items-center justify-end gap-4 md:gap-6">
        <Search v-model="search" placeholder="Search by username..." />
        <el-select
          v-model="limit"
          placeholder="Select"
          size="large"
          style="width: 120px"
        >
          <el-option label="10 entries" :value="10" />
          <el-option label="7 entries" :value="7" />
          <el-option label="3 entries" :value="3" />
        </el-select>
      </div>
    </template>
    <!-- User column -->
    <template #column-username="{ item }">
      <div class="flex items-center gap-3">
        <div class="relative inline-block">
          <div class="h-8 w-8 rounded-full bg-white">
            <img :src="item.thumbnail" class="rounded-full" />
          </div>
          <el-icon
            v-if="item.isEstablished"
            class="absolute -top-2 -right-5 h-4 w-4 rounded-full bg-transparent ring-2 ring-transparent"
          >
            <CircleCheckFilled class="text-green-600" />
          </el-icon>
        </div>

        <span>{{ item.username }}</span>
      </div>
    </template>
    <!-- Actions column -->
    <template #column-actions="{ item }">
      <div class="flex items-center justify-center gap-4">
        <!-- <RouterLink
          :to="{ name: 'customer-details', params: { userId: item._id } }"
        >
          <el-icon class="cursor-pointer pt-2" size="16"><View /></el-icon>
        </RouterLink> -->
        <!-- <el-button
          size="large"
          type="default"
          link
          @click.stop="deleteUser(item as User)"
        >
          <el-icon><Delete class="text-red-600" /></el-icon>
        </el-button> -->
        <Button
          tag="router-link"
          :to="{ name: 'customer-details', params: { userId: item._id } }"
          ><template #icon>
            <el-icon><View /></el-icon> </template
        ></Button>
        <Button @click="deleteUser(item as User)" variant="danger">
          <template #icon>
            <el-icon><Delete /></el-icon>
          </template>
        </Button>
      </div>
    </template>
  </Table>
  <Pagination
    class="pt-4"
    title="Customer Pagination"
    :current-page="currentPage"
    :total-pages="Math.ceil(total / limit)"
    :total-items="total"
    :limit="limit"
    @changePage="handlePageChange"
  ></Pagination>
</template>
<style scoped>
.el-icon {
  font-size: 20px;
}
.el-icon svg {
  width: 20px;
  height: 20px;
}
</style>
