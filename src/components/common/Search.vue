<script setup lang="ts">
import { ref, watch } from 'vue';
import { SearchIcon } from '../../icons';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
}>();

const searchQuery = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    searchQuery.value = newValue;
  },
);

function updateInput(value: string) {
  searchQuery.value = value;
  emit('update:modelValue', value);
  handleSubmit();
}

function handleSubmit() {
  emit('search', searchQuery.value.trim());
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="relative">
      <button
        type="submit"
        aria-label="Search"
        class="absolute top-1/2 left-4 -translate-y-1/2"
      >
        <SearchIcon />
      </button>

      <input
        :value="searchQuery"
        @input="updateInput(($event.target as HTMLInputElement).value)"
        @change="updateInput(($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="`Search ${title}...`"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none xl:w-[430px] dark:border-gray-800 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
  </form>
</template>
