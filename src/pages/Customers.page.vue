<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElInput,
  ElSkeleton,
  ElSkeletonItem,
  ElNotification,
  ElMessageBox,
  ElSelect,
  ElOption,
} from 'element-plus';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { SearchIcon } from '../icons';
import { useRouter } from 'vue-router';

interface User {
  username: string;
  email: string;
  thumbnail: string;
  phone: number;
  role: string;
  _id: string;
}
const router = useRouter();
const loading = ref(false);
const allUsers = ref<User[]>([]);
const currentPage = ref(1);
const limit = ref(10);
const totalUsers = ref(0);
const search = ref('');
const Orders = ref([]);
const totalOrders = ref(0);

const fetchUsers = async (page: number) => {
  const token = localStorage.getItem('token');
  loading.value = true;
  try {
    const { data } = await axios.get('http://localhost:5000/users', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        page,
        limit: limit.value,
        search: search.value,
      },
    });
    allUsers.value = data.data.users;
    totalUsers.value = data.data.totalUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};
const debouncedFetch = debounce((page: number) => {
  fetchUsers(page);
}, 600);
onMounted(async () => {
  fetchUsers(currentPage.value);
});
watch(currentPage, (newPage) => {
  fetchUsers(newPage);
});
watch(search, () => {
  currentPage.value = 1;
  debouncedFetch(1);
});
watch(limit, () => {
  currentPage.value = 1;
  fetchUsers(1);
});
const paginatedUsers = computed(() => allUsers.value);
function handlePageChange(page: number) {
  currentPage.value = page;
}

function handleRowClick(row: User) {
  console.log('Row clicked:', row);
  fetchOrders(row._id);
  router.push({ name: 'customer-details', params: { userId: row._id } });
}

function editUser(user: User) {
  console.log('Edit user:', user);
  router.push({ name: 'edit-customers', params: { id: user._id } });
}

const fetchOrders = async (userId: string) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/orders/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      params: {
        userId,
      },
    });
    Orders.value = data.data.orders;
    totalOrders.value = data.data.totalOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

async function deleteUser(user: User) {
  // const tmpAll = allUsers.value;
  // allUsers.value = allUsers.value.filter((u) => u._id !== user._id);
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
    await axios.delete(`http://localhost:5000/users/${user._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    ElNotification({
      title: 'Success',
      message: `User ${user.username} has been deleted.`,
      type: 'success',
      duration: 3000,
      position: 'bottom-right',
    });
    fetchUsers(currentPage.value);
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
    // allUsers.value = tmpAll;
  }

  console.log('Delete user:', user);
}
</script>
<template>
  <h2 class="mb-4 text-sm font-medium">Users</h2>

  <div class="mb-4 flex items-center justify-between">
    <el-select
      v-model="limit"
      placeholder="Select"
      size="large"
      style="width: 120px"
      class="mr-4"
    >
      <el-option label="10 entries" :value="10" />
      <el-option label="7 entries" :value="7" />
      <el-option label="3 entries" :value="3" />
    </el-select>
    <el-input
      v-model="search"
      placeholder="Search..."
      size="large"
      style="width: 18rem"
    >
      <template #prefix
        ><el-icon><Search /></el-icon> <SearchIcon /> </template
    ></el-input>
  </div>
  <el-skeleton v-if="loading" animated class="mt-12 mb-6">
    <template #template>
      <div v-for="i in 10" :key="i" class="flex items-center gap-8 py-4">
        <el-skeleton-item variant="circle" style="width: 32px; height: 32px" />

        <el-skeleton-item variant="text" style="width: 100px" />

        <el-skeleton-item variant="text" style="width: 200px" />

        <el-skeleton-item variant="text" style="width: 120px" />

        <el-skeleton-item
          variant="text"
          style="width: 80px; margin-left: 250px"
        />

        <div class="flex gap-2">
          <el-skeleton-item variant="rect" style="width: 50px; height: 28px" />
          <el-skeleton-item variant="rect" style="width: 60px; height: 28px" />
        </div>
      </div>
    </template>
  </el-skeleton>

  <el-table
    v-else
    :data="paginatedUsers"
    class="w-full"
    stripe
    border
    @row-click="handleRowClick"
  >
    <el-table-column label="User">
      <template #default="{ row }">
        <div class="flex items-center gap-3">
          <img :src="row.thumbnail" class="h-8 w-8 rounded-full" />
          <span>{{ row.username }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="Email" prop="email" />
    <el-table-column label="Phone" prop="phone" />
    <el-table-column label="Role" prop="role" />

    <el-table-column label="Actions" width="150">
      <template #default="{ row }">
        <div class="flex gap-2">
          <el-button size="small" type="primary" @click.stop="editUser(row)"
            >Edit</el-button
          >
          <el-button size="small" type="danger" @click.stop="deleteUser(row)"
            >Delete</el-button
          >
        </div>
      </template>
    </el-table-column>
  </el-table>

  <div class="mt-4 flex items-center justify-between">
    <span class="text-sm text-gray-500">
      Showing {{ (currentPage - 1) * limit + 1 }} to
      {{ Math.min(currentPage * limit, totalUsers) }} of
      {{ totalUsers }} entries
    </span>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="limit"
      :total="totalUsers"
      @current-change="handlePageChange"
    />
  </div>
</template>
