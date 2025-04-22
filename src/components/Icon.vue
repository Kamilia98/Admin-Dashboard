<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const props = defineProps<{
  name: string;
  flip?: boolean;
}>();

const svgContent = ref("");

onMounted(async () => {
  try {
    const res = await fetch(
      `/icons/${props.name.replace(" ", "").toLowerCase()}.svg`,
    );
    svgContent.value = await res.text();
  } catch (err) {
    console.error("Failed to load SVG:", err);
  }
});

const transformStyle = computed(() => ({
  transform: props.flip ? "scaleX(-1)" : "none",
}));
</script>

<template>
  <div v-html="svgContent" :style="transformStyle"></div>
</template>
