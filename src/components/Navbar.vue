<script setup lang="ts">
import { ref } from "vue";
import Icon from "./Icon.vue";

const searchQuery = ref("");

const handleSearch = () => {
  console.log("Searching for:", searchQuery.value);
};
</script>

<template>
  <nav class="flex items-center justify-between gap-2">
    <!-- Search Field -->
    <div class="relative max-w-xl flex-1">
      <input
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        type="text"
        placeholder="Search..."
        class="w-full rounded-full bg-gray-100 px-4 py-2 text-black focus:outline-none"
      />
      <button
        @click="handleSearch"
        class="absolute top-1/2 right-2 w-4 -translate-y-1/2 cursor-pointer text-sm text-gray-500"
      >
        <Icon name="search" />
      </button>
    </div>

    <!-- User Icon -->

    <div class="rounded-full bg-gray-100 p-2">
      <div class="w-4 ">
        <Icon name="user" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
input::placeholder {
  color: #aaa;
}
</style>
