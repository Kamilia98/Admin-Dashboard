<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ElIcon, ElMessageBox, ElSelect, ElOption } from 'element-plus';
import { ElMessage } from 'element-plus';

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

const headers = [
  { key: 'username', label: 'User', sortable: false },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'gender', label: 'Gender', sortable: false },
  { key: 'createdAt', label: 'Date & Time', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false },
];

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
        confirmButtonClass: 'el-button--danger el-button--plain',
      },
    );

    await removeCustomer(user._id);
    ElMessage.success(`User ${user.username} has been deleted successfully!`);

    fetchAllCustomers(currentPage.value, limit.value, search.value);
  } catch (error) {
    console.log(error);
    if (error === 'cancel') {
      return;
    }

    ElMessage.error('An unknown error occurred');
  }

  console.log('Delete user:', user);
}
</script>
<template>
  <!-- Customer Cards -->
  <div
    class="grid grid-cols-1 gap-4 pb-6 text-center sm:grid-cols-2 lg:grid-cols-3"
  >
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
    title="Customer"
    :current-page="currentPage"
    :total-pages="Math.ceil(total / limit)"
    :total-items="total"
    :limit="limit"
    @changePage="handlePageChange"
  ></Pagination>
</template>
