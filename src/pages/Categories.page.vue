<script setup lang="ts">
import { onMounted } from 'vue';
import { useCategoryStore } from '../stores/categoryStore';
import { ElIcon } from 'element-plus';
import { Edit, Delete, Plus, View } from '@element-plus/icons-vue';
import Table from '../components/common/Table.vue';
import Button from '../components/common/Button.vue';
import type { Category } from '../types/category.d';
import Search from '../components/common/Search.vue';
import Pagination from '../components/common/Pagination.vue';
import EditModal from '../components/categories/EditModal.vue';
import AddModal from '../components/categories/AddModal.vue';
import CategoriesStatistics from '../components/categories/CategoriesStatistics.vue';

// Store
const store = useCategoryStore();

// Data Fetching
onMounted(() => {
  store.getCategories();
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <CategoriesStatistics />

    <div class="flex flex-col gap-4">
      <div class="flex justify-end">
        <Button @click="store.isCategoryAddModalOpen = true">
          <template #icon>
            <el-icon><Plus /></el-icon>
          </template>
          Add Category
        </Button>
      </div>
      <Table
        caption="Categories"
        :items="store.categories"
        :headers="[
          {
            key: 'name',
            label: 'Name',
            sortable: true,
          },
          {
            key: 'description',
            label: 'Description',
            sortable: false,
          },
          { key: 'image', label: 'Image', sortable: false },
          { key: 'productCount', label: 'Products', sortable: true },
          { key: 'totalSales', label: 'Sales', sortable: true },
          { key: 'actions', label: 'Actions', sortable: false },
        ]"
        @sort="store.handleSort"
        :loading="store.loading"
      >
        <template #column-description="{ item }">
          <div class="line-clamp-2 max-w-50 text-wrap">
            {{ item.description }}
          </div>
        </template>
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
            <Button
              variant="primary"
              @click="store.openEditModal(item as Category)"
            >
              <template #icon>
                <el-icon><Edit /></el-icon>
              </template>
            </Button>
            <Button variant="danger" @click="store.confirmDelete(item._id)">
              <template #icon>
                <el-icon><Delete /></el-icon>
              </template>
            </Button>
          </div>
        </template>

        <template #actions>
          <Search
            title="categories"
            v-model="store.searchQuery"
            @search="store.getCategories(1)"
          />
        </template>
      </Table>
      <Pagination
        title="categories"
        :currentPage="store.currentPage"
        :totalPages="store.totalPages"
        :totalItems="store.totalFilteredCategories"
        :limit="store.CATEGORY_LIMIT"
        @changePage="store.getCategories"
      />
    </div>

    <EditModal />
    <AddModal />
  </div>
</template>
