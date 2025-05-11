<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  ElInput,
  ElButton,
  ElTag,
  ElMessageBox,
  ElCheckboxGroup,
  ElCheckbox,
  ElIcon,
  ElMessage,
} from 'element-plus';
import { Plus, Delete, Edit, Check, Close } from '@element-plus/icons-vue';
import { useStoreConfigStore } from '../../stores/storeConfigStore';

const {
  adminUsers,
  inviteAdminUser,
  removeAdminUser,
  updateAdminUserPermissions,
  loadAdminUsers,
  isLoading,
  error,
} = useStoreConfigStore();

const editingAdminId = ref<string | null>(null);
const editedAdminPermissions = ref<string[]>([]);
const inviteForm = ref({
  email: '',
  permissions: [],
});

// Define available permissions
const allPermissions = [
  { name: 'Manage Products', value: 'manage_products' },
  { name: 'Manage Orders', value: 'manage_orders' },
  { name: 'Manage Customers', value: 'manage_customers' },
  { name: 'Manage Categories', value: 'manage_categories' },
  { name: 'View Reports', value: 'view_reports' },
  { name: 'Manage Users', value: 'manage_users' },
];

const isInviting = ref(false);
onMounted(() => {
  loadAdminUsers();
});

const handleInvite = async () => {
  if (!inviteForm.value.email) {
    ElMessage({
      message: 'Please enter a valid email.',
      type: 'warning',
      duration: 5000,
    });
    return;
  }

  if (inviteForm.value.permissions.length === 0) {
    ElMessage({
      message: 'Please select at least one permission.',
      type: 'warning',
      duration: 5000,
    });
    return;
  }

  isInviting.value = true;

  try {
    console.log('Inviting admin with:', inviteForm.value);
    await inviteAdminUser({
      email: inviteForm.value.email,
      role: 'ADMIN',
      permissions: inviteForm.value.permissions,
    });
    inviteForm.value.email = '';
    inviteForm.value.permissions = [];
  } catch (error: any) {
    console.error('Error inviting admin:', error);
    ElMessage({
      message:
        error?.response?.data?.message ||
        'Failed to invite admin. Please try again.',
      type: 'error',
      duration: 5000,
    });
  } finally {
    isInviting.value = false;
  }
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
  editedAdminPermissions.value = admin.permissions || [];
};

const handleSaveEdit = async (adminId: string) => {
  await updateAdminUserPermissions(adminId, {
    permissions: editedAdminPermissions.value,
  });
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
      <div class="flex flex-col gap-20 sm:flex-row sm:items-center">
        <div class="w-full sm:w-full">
          <el-input v-model="inviteForm.email" placeholder="Enter Email" />
        </div>
        <el-button
          class="flex w-full items-center justify-center sm:w-auto"
          type="primary"
          plain
          @click="handleInvite"
          :disabled="isInviting"
        >
          <span v-if="isInviting" class="mr-1">
            <el-icon><Loading /></el-icon>
          </span>
          <el-icon v-else class="mr-1"><Plus /></el-icon>
          {{ isInviting ? 'Inviting...' : 'Add Admin' }}
        </el-button>
      </div>

      <el-checkbox-group
        v-model="inviteForm.permissions"
        class="grid w-full grid-cols-1 gap-2 space-y-2 sm:w-[750px] sm:grid-cols-2 lg:grid-cols-3"
      >
        <el-checkbox
          v-for="permission in allPermissions"
          :key="permission.value"
          :value="permission.value"
          class="mr-0 w-full sm:w-[200px]"
        >
          {{ permission.name }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div>
      <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Admin Users
      </h3>
      <div class="space-y-4">
        <div
          v-for="admin in adminUsers"
          :key="admin._id"
          class="flex flex-col items-start justify-between rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center dark:border-gray-700"
        >
          <!-- <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ admin.email }}
            </p>
            <div class="mt-2 flex flex-col gap-4 sm:flex-row">
              <el-checkbox-group
                v-if="editingAdminId === admin._id"
                v-model="editedAdminPermissions"
                class="grid w-full grid-cols-1 gap-2 space-y-1  sm:grid-cols-2 lg:grid-cols-2"
              >
                <el-checkbox
                  v-for="permission in allPermissions"
                  :key="permission.value"
                  :value="permission.value"
                  class="mr-0 w-full sm:w-[200px]"
                >
                  {{ permission.name }}
                </el-checkbox>
              </el-checkbox-group>
              <el-tag
                v-else
                v-for="permission in admin.permissions"
                :key="permission"
                >{{
                  allPermissions.find((p) => p.value === permission)?.name ||
                  permission
                }}</el-tag
              >
              <el-tag
                :type="admin.status === 'pending' ? 'warning' : 'success'"
              >
                {{ admin.status }}
              </el-tag>
            </div>
          </div> -->
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ admin.email }}
            </p>
            <div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <el-checkbox-group
                v-if="editingAdminId === admin._id"
                v-model="editedAdminPermissions"
                class="grid w-full grid-cols-1 gap-2 space-y-1 sm:grid-cols-2 lg:grid-cols-2"
              >
                <el-checkbox
                  v-for="permission in allPermissions"
                  :key="permission.value"
                  :value="permission.value"
                  class="mr-0 w-full sm:w-[200px]"
                >
                  {{ permission.name }}
                </el-checkbox>
              </el-checkbox-group>
              <template v-else>
                <el-tag
                  v-for="permission in admin.permissions"
                  :key="permission"
                  >{{
                    allPermissions.find((p) => p.value === permission)?.name ||
                    permission
                  }}</el-tag
                >
                <el-tag
                  :type="admin.status === 'pending' ? 'warning' : 'success'"
                >
                  {{ admin.status }}
                </el-tag>
              </template>
            </div>
          </div>
          <div
            class="sm:space-x mt-4 flex flex-col space-y-2 sm:mt-0 sm:flex-row sm:space-y-0"
          >
            <el-button
              v-if="editingAdminId === admin._id"
              type="success"
              plain
              @click="handleSaveEdit(admin._id)"
              class="flex w-full items-center sm:w-auto"
              :loading="isLoading"
            >
              <el-icon class="mr-1"><Check /></el-icon>
              {{ isLoading ? 'Saving...' : 'Save' }}
            </el-button>
            <el-button
              v-if="editingAdminId === admin._id"
              @click="handleCancelEdit"
              class="flex w-full items-center sm:w-auto"
            >
              <el-icon class="mr-1"><Close /></el-icon> Cancel
            </el-button>
            <el-button
              v-if="editingAdminId !== admin._id"
              type="primary"
              plain
              @click="handleEditAdmin(admin)"
              class="flex w-full items-center sm:w-auto"
            >
              <el-icon class="mr-1"><Edit /></el-icon> Edit Permissions
            </el-button>
            <el-button
              type="danger"
              plain
              @click="handleDeleteAdmin(admin._id)"
              class="flex w-full items-center sm:w-auto"
              :loading="isLoading"
            >
              <el-icon class="mr-1"><Delete /></el-icon>
              {{ isLoading ? 'Deleting...' : 'Delete' }}
            </el-button>
          </div>
        </div>
        <div v-if="isLoading && !adminUsers.length">Loading admin users...</div>
      </div>
    </div>
  </div>
</template>
