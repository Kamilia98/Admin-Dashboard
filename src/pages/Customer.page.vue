<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ElForm,
  ElInput,
  ElSelect,
  ElOption,
  ElFormItem,
  ElButton,
} from 'element-plus';
import axios from 'axios';

import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const user = ref<any>(null);

onMounted(async () => {
  const { data } = await axios.get(
    `http://localhost:5000/users/${route.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    },
  );
  user.value = data.data.user;
});

const saveChanges = async () => {
  console.log('user.value', user.value);
  try {
    await axios.patch(
      `http://localhost:5000/users/${route.params.id}`,
      user.value,
    );
    ElMessage.success(`User ${user.value.username} has Edited Successfully.`);
    router.back();
  } catch (error) {
    ElMessage.error('An unknown error occurred');

    console.error('Error saving changes:', error);
  }
};

const cancelEdit = () => {
  router.back();
};
</script>
<template>
  <div
    class="mx-auto mt-20 max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-md"
  >
    <h2 class="mb-6 text-xl font-semibold text-gray-800">Edit User</h2>
    <el-form v-if="user" :model="user" label-position="top" class="space-y-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <el-form-item label="Username" class="w-full">
          <el-input v-model="user.username" class="custom-input" />
        </el-form-item>
        <el-form-item label="Email" class="w-full">
          <el-input
            v-model="user.email"
            class="custom-input cursor-not-allowed"
            readonly
          />
        </el-form-item>
      </div>

      <el-form-item label="Role">
        <el-select
          v-model="user.role"
          placeholder="Select Role"
          class="custom-input"
        >
          <el-option label="Admin" value="ADMIN" />
          <el-option label="User" value="USER" />
        </el-select>
      </el-form-item>

      <div class="mt-6">
        <el-button
          type="primary"
          @click="saveChanges"
          class="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Save
        </el-button>
        <el-button
          @click="cancelEdit"
          class="ml-4 rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </el-button>
      </div>
    </el-form>
  </div>
</template>
