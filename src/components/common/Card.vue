<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  icon?: any; //
}>();
</script>

<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div
      class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
    >
      <component :is="icon" v-if="icon" />
    </div>
    <div class="mt-5 flex items-end justify-between">
      <div>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{
          title
        }}</span>
        <h4
          class="mt-2 text-left text-title-sm font-bold text-gray-800 dark:text-white/90"
        >
          {{ value }}
        </h4>
      </div>
    </div>
  </div>
</template>
