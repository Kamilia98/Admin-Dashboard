<template>
  <div
    class="relative box-border flex h-screen p-2 transition-all duration-300"
  >
    <!-- Sidebar -->
    <Sidebar
      :tabs="tabs"
      :activeTabIndex="activeTabIndex"
      @updateActiveTab="updateActiveTab"
    />

    <!-- Main Content -->
    <div
      class="ml-16 flex-1 gap-4 overflow-y-scroll bg-white px-4 py-2 transition-all duration-300 lg:ml-0"
    >
      <div class="flex flex-col gap-4">
        <Navbar />
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
const activeTabIndex = ref<number | null>(null);

const tabs = [
  { name: "Products", path: "/products" },
  { name: "Orders", path: "/orders" },
  { name: "Customers", path: "/customers" },
  { name: "Store", path: "/store" },
];

const updateActiveTab = (index: number | null) => {
  activeTabIndex.value = index;
};
</script>
