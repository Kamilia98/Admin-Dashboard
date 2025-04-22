<template>
  <div
    class="absolute right-0 flex h-[60px] w-full flex-col bg-primary pl-2 transition-transform duration-300 ease-in-out outline-none"
    :style="{
      transform: `translateY(${activeTabIndex * tabHeight}px)`,
      zIndex: 0,
    }"
  >
    <div class="bg-white">
      <div class="h-[10px] rounded-br-xl bg-primary"></div>
    </div>

    <div class="h-[40px] rounded-l-full bg-white p-2 transition-colors"></div>

    <div class="bg-white">
      <div class="h-[10px] rounded-tr-xl bg-primary"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  activeTabIndex: {
    type: Number,
    required: true,
  },
  tabHeight: {
    type: Number,
    required: true,
  },
});
</script>
