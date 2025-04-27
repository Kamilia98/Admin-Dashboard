<script setup lang="ts">
import Icon from "./Icon.vue";

const props = defineProps<{
  title: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}>();

const emit = defineEmits(["changePage"]);

const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("changePage", page);
  }
};
</script>
<template>
  <div class="flex w-full items-center justify-between">
    <!-- Left side: Status -->
    <div class="text-sm text-gray-700">
      Showing {{ (currentPage - 1) * limit + 1 }} -
      {{ Math.min(currentPage * limit, totalItems) }} of {{ totalItems }}
      {{ title }}
    </div>

    <!-- Right side: Pagination -->
    <div
      class="flex self-end rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex cursor-pointer items-center justify-center p-1 px-4"
        @click="changePage(currentPage - 1)"
      >
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="w-4 cursor-pointer disabled:text-gray-500 dark:text-white"
        >
          <Icon name="arrow" :flip="true" />
        </button>
      </div>
      <div
        class="border-x border-gray-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white"
      >
        {{ currentPage }}
      </div>
      <div
        class="flex cursor-pointer items-center justify-center p-1 px-4"
        @click="changePage(currentPage + 1)"
      >
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="w-4 cursor-pointer disabled:text-gray-500 dark:text-white"
        >
          <Icon name="arrow" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
