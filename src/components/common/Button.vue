<template>
  <component
    :is="tag"
    :class="[
      'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-theme-sm font-medium shadow-theme-xs',
      variantClasses,
    ]"
    @click="$emit('click')"
    v-bind="tag === 'router-link' ? { to } : {}"
  >
    <!-- Icon Slot -->
    <slot name="icon" />
    <!-- Button Text -->
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  tag: {
    type: String,
    default: 'button',
    validator: (value: string) => ['button', 'router-link'].includes(value),
  },
  to: {
    type: Object,
    default: '',
    validator: (value: unknown) => {
      try {
        return typeof value === 'string' || typeof value === 'object';
      } catch {
        return false;
      }
    },
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) =>
      ['default', 'primary', 'danger'].includes(value),
  },
});

defineEmits(['click']);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-brand-500 border border-brand-500 hover:bg-brand-100 dark:text-brand-500 dark:bg-gray-800 dark:hover:bg-brand-900/10 dark:border-gray-700';
    case 'danger':
      return 'text-error-500 border border-error-500 hover:bg-error-100 dark:text-error-500 dark:bg-gray-800 dark:bg-gray-800 dark:hover:bg-error-900/10 dark:border-gray-700';
    default:
      return 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200';
  }
});
</script>
