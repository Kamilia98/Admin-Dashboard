<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStoreConfigStore } from '../../stores/storeConfigStore';
import { ElInput, ElButton, ElIcon, ElMessageBox } from 'element-plus';
import { Plus, Check, Close, Edit, Delete } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
const editingId = ref<string | null>(null);
const newShippingMethod = ref({ name: '', cost: 0, isActive: true });
const editShippingMethod = ref({ id: '', name: '', cost: 0, isActive: true });

const {
  loadStoreConfig,

  activeShippingMethods,
  addShippingMethod,
  updateShippingMethod,
  softDeleteShippingMethod,
} = useStoreConfigStore();
const Methods = ref([]);
onMounted(async () => {
  const data = await loadStoreConfig();
  Methods.value = data.shippingMethods;
});
watch(activeShippingMethods, (newMethods) => {
  activeShippingMethods.value = newMethods;
  console.log(activeShippingMethods.value);
});
const handleAddShippingMethod = async () => {
  if (newShippingMethod.value.name && newShippingMethod.value.cost >= 0) {
    Methods.value = await addShippingMethod(newShippingMethod.value);
    newShippingMethod.value = { name: '', cost: 0, isActive: true };
  }
};

const handleEditShippingMethod = (method: any) => {
  editingId.value = method._id;
  editShippingMethod.value = { ...method };
};

const handleUpdateShippingMethod = async () => {
  if (editShippingMethod.value.name && editShippingMethod.value.cost >= 0) {
    Methods.value = await updateShippingMethod(
      editShippingMethod.value._id,
      editShippingMethod.value,
    );
    editingId.value = null;
  }
};

const handleCancelEdit = () => {
  editingId.value = null;
};

const handleDeleteShippingMethod = async (methodId: string) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this shipping method?',
      'Confirm Deletion',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger el-button--plain',
      },
    );
    Methods.value = await softDeleteShippingMethod(methodId);
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
        Add New Shipping Method
      </label>
      <div class="mt-1 flex space-x-2">
        <el-input
          v-model="newShippingMethod.name"
          placeholder="Method name"
          class="flex-6"
        />
        <el-input
          v-model="newShippingMethod.cost"
          placeholder="0.00"
          class="flex-1"
        />
        <el-button
          type="primary"
          plain
          @click="handleAddShippingMethod"
          class="flex items-center"
        >
          <el-icon class="mr-1"><Plus /></el-icon>
          Add
        </el-button>
      </div>
    </div>

    <div>
      <h3
        class="text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
      >
        Active Shipping Methods
      </h3>
      <div class="mt-2 space-y-2">
        <div
          v-for="method in Methods"
          :key="method._id"
          class="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
        >
          <div v-if="editingId !== method._id">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ method.name }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Cost: {{ method.cost }}
            </p>
          </div>
          <div v-else class="flex gap-2">
            <el-input
              v-model="editShippingMethod.name"
              placeholder="Method name"
              class="flex-6"
            />
            <el-input
              v-model="editShippingMethod.cost"
              placeholder="0.00"
              class="flex-1"
            />
          </div>
          <div class="flex space-x-2">
            <el-button
              v-if="editingId === method._id"
              type="success"
              plain
              @click="handleUpdateShippingMethod"
              class="flex items-center"
            >
              <el-icon class="mr-1"><Check /></el-icon>
              Save
            </el-button>
            <el-button
              v-if="editingId === method._id"
              @click="handleCancelEdit"
              class="flex items-center"
            >
              <el-icon class="mr-1"><Close /></el-icon>
              Cancel
            </el-button>
            <el-button
              v-if="editingId !== method._id"
              type="primary"
              plain
              @click="handleEditShippingMethod(method)"
              class="flex items-center"
            >
              <el-icon class="mr-1"><Edit /></el-icon>
              Edit
            </el-button>
            <el-button
              type="danger"
              plain
              @click="handleDeleteShippingMethod(method._id)"
              class="flex items-center"
            >
              <el-icon class="mr-1"><Delete /></el-icon>
              Delete
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
