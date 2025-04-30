<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElInput,
  ElSkeleton,
  ElSkeletonItem,
} from "element-plus";
import axios from "axios";
import debounce from "lodash/debounce";
import { SearchIcon } from "../icons";

interface User {
  username: string;
  email: string;
  thumbnail: string;
  phone: number;
  role: string;
}
const loading = ref(false);
const allUsers = ref<User[]>([]);
const currentPage = ref(1);
const pageSize = 10;
const totalUsers = ref(0);
const search = ref("");

const fetchUsers = async (page: number) => {
  const token = localStorage.getItem("token");
  loading.value = true;
  try {
    const { data } = await axios.get("http://localhost:5000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        page,
        limit: pageSize,
        search: search.value,
      },
    });
    allUsers.value = data.data.users;
    totalUsers.value = data.data.totalUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
};
const debouncedFetch = debounce((page: number) => {
  fetchUsers(page);
}, 600);
onMounted(async () => fetchUsers(currentPage.value));
watch(currentPage, (newPage) => {
  fetchUsers(newPage);
});
watch(search, () => {
  currentPage.value = 1;
  debouncedFetch(1);
});
const paginatedUsers = computed(() => allUsers.value);
function handlePageChange(page: number) {
  currentPage.value = page;
}

function handleRowClick(row: User) {
  console.log("Row clicked:", row);
}

function editUser(user: User) {
  console.log("Edit user:", user);
}

function deleteUser(user: User) {
  console.log("Delete user:", user);
}
</script>
<template>
  <div class="p-6">
    <h2 class="mb-4 text-sm font-medium">Users</h2>

    <div class="mb-4 flex items-center justify-end">
      <el-input
        v-model="search"
        placeholder="Search..."
        size="large"
        style="width: 18rem"
      >
        <template #prefix> <SearchIcon /> </template
      ></el-input>
    </div>
    <el-skeleton v-if="loading" animated class="mt-12 mb-6">
      <template #template>
        <div v-for="i in 10" :key="i" class="flex items-center gap-8 py-4">
          <el-skeleton-item
            variant="circle"
            style="width: 32px; height: 32px"
          />

          <el-skeleton-item variant="text" style="width: 100px" />

          <el-skeleton-item variant="text" style="width: 200px" />

          <el-skeleton-item variant="text" style="width: 120px" />

          <el-skeleton-item
            variant="text"
            style="width: 80px; margin-left: 250px"
          />

          <div class="flex gap-2">
            <el-skeleton-item
              variant="rect"
              style="width: 50px; height: 28px"
            />
            <el-skeleton-item
              variant="rect"
              style="width: 60px; height: 28px"
            />
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
        Showing {{ (currentPage - 1) * pageSize + 1 }} to
        {{ Math.min(currentPage * pageSize, totalUsers) }} of
        {{ totalUsers }} entries
      </span>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalUsers"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>
