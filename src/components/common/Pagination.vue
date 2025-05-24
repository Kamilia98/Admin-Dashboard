<script setup lang="ts">
import { ElIcon } from 'element-plus';
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue';
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}>();

const emit = defineEmits(['changePage']);

const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('changePage', page);
  }
};

const startItem = computed(() => (props.currentPage - 1) * props.limit + 1);
const endItem = computed(() =>
  Math.min(props.currentPage * props.limit, props.totalItems),
);
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <div class="text-sm text-gray-700 dark:text-white">
      <template v-if="totalItems">
        Showing {{ startItem }} - {{ endItem }} of {{ totalItems }} {{ title }}
      </template>
      <template v-else>No {{ title }} to show</template>
    </div>

    <div
      v-if="totalItems > 1"
      class="flex rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="flex items-center justify-center px-4 py-1 disabled:text-gray-500 dark:text-white"
      >
        <ElIcon size="16"><ArrowLeft /></ElIcon>
      </button>

      <div
        class="border-x border-gray-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white"
      >
        {{ currentPage }}
      </div>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="flex items-center justify-center px-4 py-1 disabled:text-gray-500 dark:text-white"
      >
        <ElIcon size="16"><ArrowRight /></ElIcon>
      </button>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
