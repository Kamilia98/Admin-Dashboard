<!-- src/components/ActionsList.vue -->
<template>
  <div class="dropdown-container relative">
    <button
      @click="toggleOpen"
      class="rounded bg-gray-100 px-3 py-1 text-sm font-medium shadow"
    >
      ...
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 z-10 mt-2 w-40 rounded-lg border border-gray-300 bg-white shadow-lg"
    >
      <button
        v-for="(item, index) in items"
        :key="index"
        @click="handleAction(item.action)"
        class="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

defineProps<{
  items: { label: string; action: () => void }[];
}>();

const isOpen = ref(false);
const toggleOpen = () => (isOpen.value = !isOpen.value);
const close = () => (isOpen.value = false);

const handleAction = (action: () => void) => {
  action();
  close();
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".dropdown-container")) close();
};

onMounted(() => window.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => window.removeEventListener("click", handleClickOutside));
</script>
