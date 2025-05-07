<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '../components/common/Button.vue';
import Dropzone from '../components/common/Dropzone.vue';
import { ElIcon } from 'element-plus';
import { Edit, Delete } from '@element-plus/icons-vue';
import { BoxCubeIcon } from '../icons';
import Card from '../components/common/Card.vue';
import Modal from '../components/common/Modal.vue';
import { useCategoryStore } from '../stores/categoryStore';
import type { Category } from '../types/category';
import ResourceWrapper from '../components/common/ResourceWrapper.vue';

const route = useRoute();
const router = useRouter();
const store = useCategoryStore();
const category = ref<Category | null>(null);

const editedCategoryName = ref('');
const editedCategoryDescription = ref('');
const editedCategoryImage = ref('');

const isCategoryEditModalOpen = ref(false);

onMounted(() => {
  const id = route.params.id as string;
  fetchCategoryDetails(id);
});

const fetchCategoryDetails = async (id: string) => {
  category.value = await store.fetchCategoryById(id);
};

const onEdit = () => {
  if (category.value) {
    editedCategoryName.value = category.value.name;
    editedCategoryDescription.value = category.value.description;
    editedCategoryImage.value = category.value.image;
    isCategoryEditModalOpen.value = true;
  }
};

const handleModalClose = () => {
  isCategoryEditModalOpen.value = false;
};

const handleModalSave = async () => {
  if (!category.value) return;

  const updatedCategory = {
    name: editedCategoryName.value,
    description: editedCategoryDescription.value,
    image: editedCategoryImage.value,
  };

  await store.updateCategoryHandler(category.value._id, updatedCategory);
  isCategoryEditModalOpen.value = false;
};

const onDelete = async () => {
  if (!category.value) return;
  const confirmed = confirm('Are you sure you want to delete this category?');
  if (confirmed) {
    await store.deleteCategoryHandler(category.value._id);
    router.push({ name: 'categories' });
  }
};
</script>

<template>
  <ResourceWrapper :loading="store.loading" :error="store.error">
    <template v-if="category">
      <div class="space-y-8 rounded-lg bg-white dark:bg-white/[0.03]">
        <div class="p-6">
          <div class="flex flex-col gap-6 md:flex-row">
            <div class="md:w-1/3">
              <img
                :src="
                  category.image ||
                  'https://via.placeholder.com/300x300?text=No+Image'
                "
                :alt="category.name"
                class="h-64 w-full rounded-lg object-cover"
              />
            </div>
            <div class="flex flex-col justify-between gap-4 md:w-2/3">
              <div>
                <div class="mb-2 flex justify-between">
                  <h1
                    class="text-3xl font-bold text-gray-900 capitalize dark:text-gray-100"
                  >
                    {{ category.name }}
                  </h1>

                  <div class="flex gap-2">
                    <Button variant="primary" @click="onEdit">
                      Edit
                      <template #icon>
                        <el-icon>
                          <Edit />
                        </el-icon>
                      </template>
                    </Button>
                    <Button variant="danger" @click="onDelete">
                      Delete
                      <template #icon>
                        <el-icon>
                          <Delete />
                        </el-icon>
                      </template>
                    </Button>
                  </div>
                </div>
                <p class="max-w-lg text-gray-700 dark:text-gray-300">
                  {{ category.description }}
                </p>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                <Card title="Products" value="5" :icon="BoxCubeIcon" />
                <Card title="Sales" value="5" :icon="BoxCubeIcon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ResourceWrapper>

  <template v-if="isCategoryEditModalOpen">
    <Modal @close="handleModalClose">
      <template #body>
        <div class="flex flex-col gap-4">
          <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Category
          </h4>
          <form class="flex flex-col gap-4">
            <div class="flex custom-scrollbar flex-col gap-4 overflow-y-auto">
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >Name</label
                >
                <input
                  type="text"
                  v-model="editedCategoryName"
                  class="custom-input"
                />
              </div>
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >Description</label
                >
                <textarea
                  placeholder="Enter a description..."
                  v-model="editedCategoryDescription"
                  rows="3"
                  class="custom-input custom-scrollbar h-auto"
                ></textarea>
              </div>
              <div>
                <label
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >Image</label
                >
                <Dropzone
                  v-model="editedCategoryImage"
                  :initialImage="category?.image"
                  uploadUrl="https://api.cloudinary.com/v1_1/dddhappm3/image/upload"
                />
              </div>
            </div>
            <div class="flex items-center gap-3 lg:justify-end">
              <Button @click="handleModalClose">Close</Button>
              <Button @click="handleModalSave">Save Changes</Button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </template>
</template>

<style scoped>
.primary {
  color: #4f46e5;
}
</style>
