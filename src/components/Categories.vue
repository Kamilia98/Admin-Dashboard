<script setup lang="ts">
import { capitalize, onMounted, ref } from 'vue';
import { ElIcon } from 'element-plus';

import { Edit, Delete, Plus, View } from '@element-plus/icons-vue';
import axios from 'axios';
import Table from '../components/common/Table.vue';
import Button from '../components/common/Button.vue';
import { router } from '../router';
import Modal from '../components/common/Modal.vue';
const loading = ref(false);

const categories = ref<{ _id: string }[]>([]);

const isCategoryAddModalOpen = ref(false);

const AddedCategoryName = ref('');
const AddedCategoryDescription = ref('');
const AddedCategoryImage = ref('');

const handleModalClose = () => {
  isCategoryAddModalOpen.value = false;
};

const handleModalSave = () => {
  isCategoryAddModalOpen.value = false;
};

const onAdd = () => {
  isCategoryAddModalOpen.value = true;
};

interface Category {
  name: string;
}

const fetchCategories = async () => {
  loading.value = true;
  const { data } = await axios.get('http://localhost:5000/categories');
  categories.value = data.data.categories.map((cat: Category) => ({
    ...cat,
    name: capitalize(cat.name),
  }));
  console.log(data.data.categories);
  loading.value = false;
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <Table
    caption="Categories"
    :items="categories"
    :headers="[
      { key: 'name', label: 'Name', sortable: false },
      { key: 'image', label: 'Image', sortable: false },
      { key: 'productCount', label: 'Products', sortable: false },
      { key: 'actions', label: 'Actions', sortable: false },
    ]"
    :loading="loading"
  >
    <template #column-image="{ item }">
      <img :src="item.image" alt="" class="h-15 w-15 rounded-lg object-cover" />
    </template>

    <template #column-actions="{ item }">
      <div class="flex gap-2">
        <Button
          @click="
            router.push({
              name: 'category-details',
              params: {
                id: item._id,
              },
            })
          "
        >
          <template #icon>
            <el-icon>
              <View />
            </el-icon>
          </template>
        </Button>
        <Button variant="primary">
          <template #icon>
            <el-icon>
              <Edit />
            </el-icon>
          </template>
        </Button>
        <Button variant="danger">
          <template #icon>
            <el-icon>
              <Delete />
            </el-icon>
          </template>
        </Button>
      </div>
    </template>

    <template #actions>
      <button
        @click="onAdd"
        class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        <el-icon>
          <Plus />
        </el-icon>
        Add Category
      </button>
    </template>
  </Table>

  <template v-if="isCategoryAddModalOpen">
    <Modal @close="handleModalClose">
      <template #body>
        <!-- close btn -->

        <div class="flex flex-col gap-4">
          <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Category
          </h4>
          <form class="flex flex-col gap-4">
            <div class="flex custom-scrollbar flex-col gap-4 overflow-y-auto">
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Name
                </label>
                <input
                  type="text"
                  v-model="AddedCategoryName"
                  class="custom-input"
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
                  v-model="AddedCategoryDescription"
                  rows="6"
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
                  uploadUrl="https://api.cloudinary.com/v1_1/dddhappm3/image/upload"
                ></Dropzone>
              </div>
            </div>
            <div class="flex items-center gap-3 lg:justify-end">
              <Button @click="handleModalClose">Close</Button>
              <Button @click="handleModalSave">Submit</Button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </template>
</template>
