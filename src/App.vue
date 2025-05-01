<template>
  <SidebarProvider>
    <ThemeProvider>
      <AdminLayout />
    </ThemeProvider>
  </SidebarProvider>
</template>

<script setup lang="ts">
import SidebarProvider from "./layouts/SidebarProvider.vue";
import AdminLayout from "./layouts/AdminLayout.vue";
import ThemeProvider from "./layouts/ThemeProvider.vue";
</script>
