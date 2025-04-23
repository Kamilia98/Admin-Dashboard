<script setup lang="ts">
type Option = {
  label: string;
  value: string;
};

import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modelValue: string;
  options: Option[];
  selectedOption: Option;
  btnBgColorClass?: string;
  btnTextColorClass?: string;
}>();
const emit = defineEmits(["update:modelValue"]);
const selected = ref<Option>(props.selectedOption);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Initialize selected value based on modelValue

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectOption(option: Option) {
  selected.value = option;
  emit("update:modelValue", option.value);
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="relative inline-block w-40" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      :class="[
        'flex w-full items-center justify-between rounded border border-gray-300 px-4 py-2 text-left shadow-sm',
        btnBgColorClass,
        btnTextColorClass,
      ]"
    >
      <span>{{ selected?.label || "Select" }}</span>

      <svg
        v-if="options.length"
        class="ml-2 h-4 w-4 transform transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <div
      v-if="isOpen && options.length"
      class="absolute z-10 mt-1 w-full rounded border border-gray-300 bg-white shadow-lg"
    >
      <div
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="cursor-pointer px-4 py-2 hover:bg-gray-100"
        :class="{ 'bg-gray-100': selected?.value === option.value }"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
button,
div > div {
  transition: all 0.2s ease-in-out;
}
</style>
