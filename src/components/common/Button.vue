<template>
  <component
    :is="tag"
    :class="[
      'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-theme-sm font-medium shadow-theme-xs',
      variantClasses,
    ]"
    @click="$emit('click')"
    v-bind="tag === 'router-link' ? { to: to || null } : {}"
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
    type: [String, Object], // Accepting both string or object for 'to'
    default: null, // Default to null
    required: false,
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) =>
      ['default', 'primary', 'danger'].includes(value),
  },
  type: {
    type: String,
    default: 'plain',
    validator: (value: string) => ['plain', 'filled'].includes(value),
  },
});

defineEmits(['click']);

const variantClasses = computed(() => {
  const base = {
    default: {
      plain:
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200',
      filled:
        'bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500',
    },
    primary: {
      plain:
        'text-brand-500 border border-brand-500 hover:bg-brand-100 dark:text-brand-500 dark:bg-gray-800 dark:hover:bg-brand-900/10 dark:border-gray-700',
      filled:
        'bg-brand-500 text-white hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500',
    },
    danger: {
      plain:
        'text-error-500 border border-error-500 hover:bg-error-100 dark:text-error-500 dark:bg-gray-800 dark:hover:bg-error-900/10 dark:border-gray-700',
      filled:
        'bg-error-500 text-white hover:bg-error-600 dark:bg-error-600 dark:hover:bg-error-500',
    },
  };

  return base[props.variant as keyof typeof base][
    props.type as keyof typeof base.default
  ];
});
</script>
