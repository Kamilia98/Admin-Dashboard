<template>
  <div
    class="modal fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto"
  >
    <div
      class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
      aria-hidden="true"
      @click="$emit('close')"
    ></div>

    <div
      class="relative no-scrollbar w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-8 lg:p-11 dark:bg-gray-900"
    >
      <button
        @click="$emit('close')"
        class="transition-color absolute top-5 right-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
      >
        <el-icon><CloseBold /></el-icon>
      </button>
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElIcon } from 'element-plus';

import { CloseBold } from '@element-plus/icons-vue';

defineEmits(['close']);
</script>
