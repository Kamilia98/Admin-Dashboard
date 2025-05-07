<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCategoryStore } from '../stores/categoryStore';
import { ElIcon, ElMessageBox } from 'element-plus';
import { Edit, Delete, Plus, View } from '@element-plus/icons-vue';
import Table from '../components/common/Table.vue';
import Button from '../components/common/Button.vue';
import Modal from '../components/common/Modal.vue';
import Dropzone from './common/Dropzone.vue';
import type { Category } from '../types/category.d';

// Store
const categoryStore = useCategoryStore();

// Modal States
const isCategoryAddModalOpen = ref(false);
const isCategoryEditModalOpen = ref(false);

// Form States
const formState = ref({
  add: {
    name: '',
    description: '',
    image: '',
  },
  edit: {
    id: '',
    name: '',
    description: '',
    image: '',
  },
});

// Reset form state
const resetFormState = (type: 'add' | 'edit') => {
  if (type === 'add') {
    formState.value.add = {
      name: '',
      description: '',
      image: '',
    };
  } else {
    formState.value.edit = {
      id: '',
      name: '',
      description: '',
      image: '',
    };
  }
};

// Modal Handlers
const handleAddModalClose = () => {
  isCategoryAddModalOpen.value = false;
  resetFormState('add');
};

const handleEditModalClose = () => {
  isCategoryEditModalOpen.value = false;
  resetFormState('edit');
};

// Form Validation
const validateForm = (type: 'add' | 'edit'): boolean => {
  const form = type === 'add' ? formState.value.add : formState.value.edit;
  console.log(form);
  if (!form.name || !form.image) {
    return false;
  }
  return true;
};

const handleAddModalSave = async () => {
  if (!validateForm('add')) return;

  const payload = {
    name: formState.value.add.name,
    description: formState.value.add.description,
    image: formState.value.add.image,
  };

  await categoryStore.createCategoryHandler(payload);
  handleAddModalClose();
};

const handleEditModalSave = async () => {
  if (!validateForm('edit')) return;

  const payload = {
    name: formState.value.edit.name,
    description: formState.value.edit.description,
    image: formState.value.edit.image,
  };

  console.log(payload);
  await categoryStore.updateCategoryHandler(formState.value.edit.id, payload);
  handleEditModalClose();
};

const onEdit = (cat: Category) => {
  console.log(cat);
  formState.value.edit = {
    id: cat._id,
    name: cat.name,
    description: cat.description,
    image: cat.image,
  };
  console.log(formState.value.edit);
  isCategoryEditModalOpen.value = true;
};

const onDelete = async (id: string) => {
  ElMessageBox.confirm(
    'Are you sure you want to delete this category?',
    'Warning',
    {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonClass: 'el-button--danger el-button--plain',
    },
  ).then(async () => {
    await categoryStore.deleteCategoryHandler(id);
  });
};

// Data Fetching
onMounted(() => {
  categoryStore.fetchCategories();
});
</script>

<template>
  <div class="space-y-4">
    <!-- Error Alert -->
    <div
      v-if="categoryStore.error"
      class="rounded-lg bg-red-50 p-4 text-red-500"
    >
      {{ categoryStore.error }}
    </div>

    <Table
      caption="Categories"
      :items="categoryStore.categories"
      :headers="[
        {
          key: 'name',
          label: 'Name',
          sortable: false,
        },
        { key: 'image', label: 'Image', sortable: false },
        { key: 'productCount', label: 'Products', sortable: false },
        { key: 'actions', label: 'Actions', sortable: false },
      ]"
      :loading="categoryStore.loading"
    >
      <template #column-image="{ item }">
        <img
          :src="item.image"
          :alt="item.name"
          class="h-15 w-15 rounded-lg object-cover"
        />
      </template>

      <template #column-actions="{ item }">
        <div class="flex gap-2">
          <Button
            tag="router-link"
            :to="{
              name: 'category-details',
              params: { id: item._id },
            }"
          >
            <template #icon>
              <el-icon><View /></el-icon>
            </template>
          </Button>
          <Button variant="primary" @click="onEdit(item as Category)">
            <template #icon>
              <el-icon><Edit /></el-icon>
            </template>
          </Button>
          <Button variant="danger" @click="onDelete(item._id)">
            <template #icon>
              <el-icon><Delete /></el-icon>
            </template>
          </Button>
        </div>
      </template>

      <template #actions>
        <Button @click="isCategoryAddModalOpen = true">
          <template #icon>
            <el-icon><Plus /></el-icon>
          </template>
          Add Category
        </Button>
      </template>
    </Table>

    <Modal v-if="isCategoryEditModalOpen" @close="handleEditModalClose">
      <template #body>
        <div class="flex flex-col gap-4">
          <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Category
          </h4>
          <form class="flex flex-col gap-4" @submit.prevent>
            <div class="flex custom-scrollbar flex-col gap-4 overflow-y-auto">
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Name
                </label>
                <input
                  placeholder="Enter a name"
                  type="text"
                  v-model="formState.edit.name"
                  class="custom-input"
                  required
                />
              </div>

              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Description
                </label>
                <textarea
                  placeholder="Enter a description..."
                  v-model="formState.edit.description"
                  rows="3"
                  class="custom-input custom-scrollbar h-auto"
                ></textarea>
              </div>

              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Image
                </label>
                <Dropzone
                  v-model="formState.edit.image"
                  :initialImage="formState.edit.image"
                />
              </div>
            </div>
            <div class="flex items-center gap-3 lg:justify-end">
              <Button @click="handleEditModalClose">Close</Button>
              <Button @click="handleEditModalSave">Save Changes</Button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!-- Add Modal -->
    <Modal v-if="isCategoryAddModalOpen" @close="handleAddModalClose">
      <template #body>
        <div class="flex flex-col gap-4">
          <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add Category
          </h4>
          <form class="flex flex-col gap-4" @submit.prevent>
            <div class="flex custom-scrollbar flex-col gap-4 overflow-y-auto">
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Name
                </label>
                <input
                  placeholder="Enter a name"
                  type="text"
                  v-model="formState.add.name"
                  class="custom-input"
                  required
                />
              </div>

              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Description
                </label>
                <textarea
                  placeholder="Enter a description..."
                  v-model="formState.add.description"
                  rows="3"
                  class="custom-input custom-scrollbar h-auto"
                ></textarea>
              </div>

              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Image
                </label>
                <Dropzone
                  v-model="formState.add.image"
                  uploadUrl="https://api.cloudinary.com/v1_1/dddhappm3/image/upload"
                />
              </div>
            </div>
            <div class="flex items-center gap-3 lg:justify-end">
              <Button @click="handleAddModalClose">Close</Button>
              <Button @click="handleAddModalSave">Submit</Button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>
