<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import {
  ElInput,
  ElButton,
  ElTag,
  ElMessageBox,
  ElSelect,
  ElOption,
  ElIcon,
} from 'element-plus';
import { Plus, Delete, Edit, Check, Close } from '@element-plus/icons-vue';
import { useStoreConfigStore } from '../../stores/storeConfigStore';

const editingAdminId = ref<string | null>(null);
const editedAdminRole = ref('');

const inviteForm = ref({
  email: '',
  role: 'ADMIN',
});
const roles = ref([
  { name: 'Manager', value: 'MANAGER' },
  { name: 'Support', value: 'SUPPORT' },
  { name: 'Editor', value: 'EDITOR' },
  { name: 'Admin', value: 'ADMIN' },
]);

const {
  adminUsers,
  inviteAdminUser,
  removeAdminUser,
  updateAdminUserRole,
  loadAdminUsers,
  isLoading,
  error,
} = useStoreConfigStore();
const Admins = ref([]);
onMounted(async () => {
  const AdminsArr = await loadAdminUsers();
  Admins.value = AdminsArr;
});

watch(
  () => adminUsers,
  (newUsers) => {
    if (newUsers && newUsers.length > 0) {
      editedAdminRole.value = newUsers[0].role || '';
    }
  },
  { immediate: true },
);

const handleInvite = async () => {
  if (!inviteForm.value.email || !inviteForm.value.role) {
    ElMessageBox.alert(
      'Please enter both email and role.',
      'Missing Information',
      { type: 'warning' },
    );
    return;
  }
  try {
    console.log('Inviting admin with:', inviteForm.value);
    await inviteAdminUser({
      email: inviteForm.value.email,
      role: inviteForm.value.role,
    });
    inviteForm.value.email = '';
    inviteForm.value.role = 'ADMIN';
  } catch (error) {}
};

const handleDeleteAdmin = async (adminId: string) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to remove this admin?',
      'Confirm',
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger el-button--plain',
      },
    );
    await removeAdminUser(adminId);
  } catch (error) {
    console.log('Cancelled');
  }
};

const handleEditAdmin = (admin: any) => {
  editingAdminId.value = admin._id;
  editedAdminRole.value = admin.role;
};

const handleSaveEdit = async (adminId: string) => {
  if (!editedAdminRole.value) {
    ElMessageBox.alert('Please select a valid role.', 'Error', {
      type: 'error',
    });
    return;
  }
  await updateAdminUserRole(adminId, editedAdminRole.value);
  editingAdminId.value = null;
};

const handleCancelEdit = () => {
  editingAdminId.value = null;
};
</script>

<template>
  <div class="space-y-6 font-['Inter',sans-serif]">
    <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <label
        class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Invite New Admin
      </label>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <el-input v-model="inviteForm.email" placeholder="Admin Email" />
        <el-select v-model="inviteForm.role" placeholder="Select Role">
          <el-option
            v-for="role in roles"
            :key="role.value"
            :label="role.name"
            :value="role.value"
          />
        </el-select>
        <el-button
          type="primary"
          plain
          @click="handleInvite"
          :loading="isLoading"
        >
          <el-icon class="mr-1"><Plus /></el-icon>
          {{ isLoading ? 'Inviting...' : 'Invite Admin' }}
        </el-button>
      </div>
      <div v-if="error" class="mt-2 text-red-500">{{ error }}</div>
    </div>

    <div>
      <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Admin Users
      </h3>
      <div class="space-y-4">
        <div
          v-for="admin in Admins"
          :key="admin._id"
          class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
        >
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ admin.email }}
            </p>
            <div class="mt-2 flex items-center gap-4">
              <el-select
                v-if="editingAdminId === admin._id"
                v-model="editedAdminRole"
                size="small"
                class="w-40"
              >
                <el-option
                  v-for="role in roles"
                  :key="role.value"
                  :label="role.name"
                  :value="role.value"
                />
              </el-select>
              <el-tag v-else>{{ admin.role }}</el-tag>
              <el-tag
                :type="admin.status === 'pending' ? 'warning' : 'success'"
              >
                {{ admin.status }}
              </el-tag>
            </div>
          </div>
          <div class="flex space-x-2">
            <el-button
              v-if="editingAdminId === admin._id"
              type="success"
              plain
              @click="handleSaveEdit(admin._id)"
              class="flex items-center"
              :loading="isLoading"
            >
              <el-icon class="mr-1"><Check /></el-icon>
              {{ isLoading ? 'Saving...' : 'Save' }}
            </el-button>
            <el-button
              v-if="editingAdminId === admin._id"
              @click="handleCancelEdit"
              class="flex items-center"
            >
              <el-icon class="mr-1"><Close /></el-icon> Cancel
            </el-button>
            <el-button
              v-if="editingAdminId !== admin._id"
              type="primary"
              plain
              @click="handleEditAdmin(admin)"
              class="flex items-center"
            >
              <el-icon class="mr-1"><Edit /></el-icon> Edit
            </el-button>
            <el-button
              type="danger"
              plain
              @click="handleDeleteAdmin(admin._id)"
              class="flex items-center"
              :loading="isLoading"
            >
              <el-icon class="mr-1"><Delete /></el-icon>
              {{ isLoading ? 'Deleting...' : 'Delete' }}
            </el-button>
          </div>
        </div>
        <div v-if="isLoading && !adminUsers.length">Loading admin users...</div>
        <div v-if="error && adminUsers.length === 0" class="text-red-500">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
