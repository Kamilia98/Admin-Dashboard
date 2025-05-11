<template>
  <SidebarProvider>
    <ThemeProvider>
      <component :is="currentLayout">
        <router-view></router-view>
      </component>
    </ThemeProvider>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SidebarProvider from './layouts/SidebarProvider.vue';
import AdminLayout from './layouts/AdminLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';
import ThemeProvider from './layouts/ThemeProvider.vue';

const route = useRoute();
const currentLayout = computed(() => {
  if (route.meta.layout === 'auth') return AuthLayout;
  else if (route.meta.layout === 'admin') return AdminLayout;
});
</script>
