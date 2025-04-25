<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, computed, type Ref } from "vue";

type Theme = "light" | "dark";

interface ThemeContext {
  isDarkMode: Ref<boolean>;
  toggleTheme: () => void;
}

const theme = ref<Theme>("light");
const isInitialized = ref(false);

const isDarkMode = computed(() => theme.value === "dark");

const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme") as Theme | null;
  theme.value = savedTheme || "light";
  isInitialized.value = true;
});

watch([theme, isInitialized], ([newTheme, newIsInitialized]) => {
  if (newIsInitialized) {
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }
});

provide<ThemeContext>("theme", {
  isDarkMode,
  toggleTheme,
});
</script>
