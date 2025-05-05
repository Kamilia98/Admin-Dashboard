<script setup lang="ts">
import { ref } from 'vue';
import { useStoreConfigStore } from '../../stores/storeConfigStore';
import { ElInput, ElButton, ElIcon, ElTag, ElMessageBox } from 'element-plus';
import {
  Plus,
  Star,
  Edit,
  Delete,
  Check,
  Close,
} from '@element-plus/icons-vue';

const editingId = ref<string | null>(null);
const newLanguage = ref({
  code: '',
  name: '',
  isActive: true,
  isDefault: false,
});
const editLanguage = ref({
  id: '',
  code: '',
  name: '',
  isActive: true,
  isDefault: false,
});

const {
  activeLanguages,
  addLanguage,
  updateLanguage,
  softDeleteLanguage,
  setDefaultLanguage,
} = useStoreConfigStore();

const handleAddLanguage = () => {
  if (newLanguage.value.code && newLanguage.value.name) {
    addLanguage(newLanguage.value);
    newLanguage.value = {
      code: '',
      name: '',
      isActive: true,
      isDefault: false,
    };
  }
};

const handleEditLanguage = (language: any) => {
  editingId.value = language.code;
  editLanguage.value = {
    id: language.code,
    code: language.code,
    name: language.name,
    isActive: language.isActive,
    isDefault: language.isDefault,
  };
};

const handleUpdateLanguage = () => {
  if (editLanguage.value.code && editLanguage.value.name) {
    updateLanguage(editLanguage.value.id, editLanguage.value);
    editingId.value = null;
  }
};

const handleCancelEdit = () => {
  editingId.value = null;
};

const handleSetDefault = (languageId: string) => {
  setDefaultLanguage(languageId);
};

const handleDeleteLanguage = async (languageCode: string) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this language?',
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger el-button--plain',
      },
    );
    softDeleteLanguage(languageCode);
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
        Add New Language
      </label>
      <div class="mt-1 flex justify-between space-y-4">
        <el-input
          v-model="newLanguage.name"
          placeholder="English"
          style="width: 40%"
        />

        <el-button
          type="primary"
          plain
          @click="handleAddLanguage"
          class="flex items-center"
        >
          <el-icon class="mr-1"><Plus /></el-icon>
          Add Language
        </el-button>
      </div>
    </div>

    <div>
      <h3
        class="text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
      >
        Active Languages
      </h3>
      <div class="mt-2 space-y-4">
        <div
          v-for="language in activeLanguages"
          :key="language.code"
          class="rounded-lg border border-gray-200 p-4 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
        >
          <div v-if="editingId !== language.code">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ language.name }} ({{ language.code }})
                </p>
              </div>
              <div class="flex space-x-2">
                <el-button
                  v-if="!language.isDefault"
                  type="warning"
                  plain
                  @click="handleSetDefault(language.code)"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Star /></el-icon>
                  Set Default
                </el-button>
                <el-button
                  type="primary"
                  plain
                  @click="handleEditLanguage(language)"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Edit /></el-icon>
                  Edit
                </el-button>
                <el-button
                  type="danger"
                  plain
                  @click="handleDeleteLanguage(language.code)"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Delete /></el-icon>
                  Delete
                </el-button>
              </div>
            </div>
            <div v-if="language.isDefault" class="mt-2">
              <span
                class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              >
                Default Language
              </span>
            </div>
          </div>
          <div v-else>
            <div class="space-y-4">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
                  >
                    Code
                  </label>
                  <el-input v-model="editLanguage.code" class="mt-1" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <el-input v-model="editLanguage.name" class="mt-1" />
                </div>
              </div>
              <div class="flex space-x-2">
                <el-button
                  type="success"
                  plain
                  @click="handleUpdateLanguage"
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
