<template>
  <div
    class="flex h-[60px] cursor-pointer flex-col items-center justify-center"
    @click="handleClick"
  >
    <div
      :class="[
        'relative flex items-center gap-2 self-stretch rounded-l-full p-2 transition-colors',
        active ? 'text-primary' : 'text-white',
      ]"
    >
      <div class="w-4">
        <Icon :name="tab" />
      </div>

      <transition name="fade-slide" appear>
        <span v-if="isSidebarOpen">{{ tab }}</span>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "./Icon.vue";

const props = defineProps({
  tab: {type: String, required: true},
  index: Number,
  active: Boolean,
  isSidebarOpen: Boolean,
});

const emit = defineEmits(["setActiveTab"]);

const handleClick = () => {
  emit("setActiveTab", props.index);
};
</script>
