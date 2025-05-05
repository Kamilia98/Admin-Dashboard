<script setup lang="ts">
import { ref } from 'vue';
import { useStoreConfigStore } from '../../stores/storeConfigStore';
import {
  ElInput,
  ElButton,
  ElIcon,
  ElCheckbox,
  ElTag,
  ElMessageBox,
} from 'element-plus';
import { Plus, Edit, Delete, Check, Close } from '@element-plus/icons-vue';

interface Permission {
  name: string;
  value: string;
}

const editingId = ref<string | null>(null);
const newUserRole = ref({
  name: '',
  permissions: [] as string[],
  isActive: true,
});
const editUserRole = ref({
  id: '',
  name: '',
  permissions: [] as string[],
  isActive: true,
});

const { activeUserRoles, addUserRole, updateUserRole, softDeleteUserRole } =
  useStoreConfigStore();

const availablePermissions: Permission[] = [
  { name: 'Manage Products', value: 'manage_products' },
  { name: 'Manage Orders', value: 'manage_orders' },
  { name: 'Manage Customers', value: 'manage_customers' },
  { name: 'Manage Settings', value: 'manage_settings' },
  { name: 'View Reports', value: 'view_reports' },
  { name: 'Manage Users', value: 'manage_users' },
];

const handleAddUserRole = () => {
  if (newUserRole.value.name && newUserRole.value.permissions.length > 0) {
    addUserRole(newUserRole.value);
    newUserRole.value = { name: '', permissions: [], isActive: true };
  }
};

const handleEditUserRole = (role: any) => {
  editingId.value = role.id;
  editUserRole.value = { ...role };
};

const handleUpdateUserRole = () => {
  if (editUserRole.value.name && editUserRole.value.permissions.length > 0) {
    updateUserRole(editUserRole.value.id, editUserRole.value);
    editingId.value = null;
  }
};

const handleCancelEdit = () => {
  editingId.value = null;
};

const togglePermission = (permission: string, isNew: boolean = false) => {
  const permissions = isNew
    ? newUserRole.value.permissions
    : editUserRole.value.permissions;
  const index = permissions.indexOf(permission);
  if (index === -1) {
    permissions.push(permission);
  } else {
    permissions.splice(index, 1);
  }
};

const handleDeleteUserRole = async (roleId: string) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this user role?',
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger el-button--plain',
      },
    );
    softDeleteUserRole(roleId);
  } catch (error) {
    console.log('Deletion cancelled');
  }
};
</script>

<template>
  <div class="space-y-6 font-['Inter',sans-serif]">
    <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <label
        class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
      >
        Add New User Role
      </label>
      <div class="mt-1 space-y-4">
        <el-input
          v-model="newUserRole.name"
          placeholder="Role name"
          class="w-full"
        />
        <div>
          <label
            class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
          >
            Permissions
          </label>
          <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <el-checkbox
              v-for="permission in availablePermissions"
              :key="permission.value"
              v-model="newUserRole.permissions"
              :label="permission.value"
              class="flex items-center"
            >
              {{ permission.name }}
            </el-checkbox>
          </div>
        </div>
        <el-button
          type="primary"
          plain
          @click="handleAddUserRole"
          class="flex items-center"
        >
          <el-icon class="mr-1"><Plus /></el-icon>
          Add Role
        </el-button>
      </div>
    </div>

    <div>
      <h3
        class="text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
      >
        Active User Roles
      </h3>
      <div class="mt-2 space-y-4">
        <div
          v-for="role in activeUserRoles"
          :key="role.id"
          class="rounded-lg border border-gray-200 p-4 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
        >
          <div v-if="editingId !== role.id">
            <div class="flex items-center justify-between">
              <p class="font-medium text-gray-900 dark:text-white">
                {{ role.name }}
              </p>
              <div class="flex space-x-2">
                <el-button
                  type="primary"
                  plain
                  @click="handleEditUserRole(role)"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Edit /></el-icon>
                  Edit
                </el-button>
                <el-button
                  type="danger"
                  plain
                  @click="handleDeleteUserRole(role.id)"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Delete /></el-icon>
                  Delete
                </el-button>
              </div>
            </div>
            <div class="mt-2">
              <span
                class="text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
              >
                Permissions:
              </span>
              <div class="mt-1 flex flex-wrap gap-2">
                <el-tag
                  v-for="permission in role.permissions"
                  :key="permission"
                  class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {{
                    permission
                      .replace('_', ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                  }}
                </el-tag>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="space-y-4">
              <el-input
                v-model="editUserRole.name"
                placeholder="Role name"
                class="w-full"
              />
              <div>
                <label
                  class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
                >
                  Permissions
                </label>
                <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <el-checkbox
                    v-for="permission in availablePermissions"
                    :key="permission.value"
                    v-model="editUserRole.permissions"
                    :label="permission.value"
                    class="flex items-center"
                  >
                    {{ permission.name }}
                  </el-checkbox>
                </div>
              </div>
              <div class="flex space-x-2">
                <el-button
                  type="success"
                  plain
                  @click="handleUpdateUserRole"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Check /></el-icon>
                  Save
                </el-button>
                <el-button
                  plain
                  @click="handleCancelEdit"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Close /></el-icon>
                  Cancel
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
