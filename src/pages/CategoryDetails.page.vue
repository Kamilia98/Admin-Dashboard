<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Button from '../components/common/Button.vue';
import { ElIcon } from 'element-plus';
import { Edit, Delete } from '@element-plus/icons-vue';
import { BoxCubeIcon } from '../icons';
import Card from '../components/common/Card.vue';
import { useCategoryStore } from '../stores/categoryStore';
import type { Category } from '../types/category';
import ResourceWrapper from '../components/common/ResourceWrapper.vue';
import EditModal from '../components/categories/EditModal.vue';

const route = useRoute();
const store = useCategoryStore();
const category = ref<Category | null>(null);

onMounted(() => {
  const id = route.params.id as string;
  fetchCategoryDetails(id);
});

const fetchCategoryDetails = async (id: string) => {
  category.value = await store.getCategory(id);
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
                    <Button
                      variant="primary"
                      @click="store.openEditModal(category)"
                    >
                      Edit
                      <template #icon>
                        <el-icon>
                          <Edit />
                        </el-icon>
                      </template>
                    </Button>
                    <Button
                      variant="danger"
                      @click="store.confirmDelete(category._id)"
                    >
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

  <EditModal />
</template>

<style scoped>
.primary {
  color: #4f46e5;
}
</style>
