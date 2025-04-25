<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import Icon from "./Icon.vue";
import TabIndicator from "./TabIndicator.vue";
import TabItem from "./TabItem.vue";
import { useRouter, RouterLink } from "vue-router";

const props = defineProps<{
  tabs: { name: string; path: string }[];
  activeTabIndex: number | null;
}>();

const emit = defineEmits(["updateActiveTab"]);
const tabHeight = 60;
const router = useRouter();

const isSidebarOpen = ref(false);

const checkScreenSize = () => {
  isSidebarOpen.value = window.innerWidth >= 1024;
};

const handleResize = () => {
  checkScreenSize();
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const setActiveTab = (index: number) => {
  if (index < 0 || index >= props.tabs.length) return;

  emit("updateActiveTab", index);
  router.push(props.tabs[index].path);
};

const clearActiveTab = () => {
  emit("updateActiveTab", null);
};

// Auth functions
const handleLogout = async () => {
  try {
    console.log("Logging out...");

    // router.push('/login');
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>

<template>
  <!-- Backdrop for mobile -->
  <div
    v-if="isSidebarOpen"
    class="absolute top-0 right-0 bottom-0 left-0 z-3 h-full w-full bg-black/20 lg:hidden"
    @click="isSidebarOpen = false"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'absolute top-2 bottom-2 z-999 flex flex-col justify-between gap-2 overflow-hidden rounded-2xl bg-primary p-4 text-white transition-all duration-300 ease-in-out lg:relative lg:top-0 lg:bottom-0',
      isSidebarOpen ? 'w-64' : 'w-16',
    ]"
    aria-label="Main navigation"
  >
    <!-- Header -->
    <header
      class="flex h-[60px] items-center border-b-2 border-white/50 py-2"
      :class="{
        'justify-between': isSidebarOpen,
        'justify-center': !isSidebarOpen,
      }"
    >
      <router-link
        v-if="isSidebarOpen"
        class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-full text-white transition-colors hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        @click="clearActiveTab"
        to="/"
        aria-label="Go to dashboard"
      >
        <span class="text-lg font-bold">Dashboard</span>
      </router-link>
      <button
        class="h-5 w-5 cursor-pointer rounded border border-white bg-white/30 p-1 text-white hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        @click="isSidebarOpen = !isSidebarOpen"
        :aria-label="isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
      >
        <Icon name="twoarrows" :flip="isSidebarOpen" />
      </button>
    </header>

    <!-- Main navigation tabs -->
    <nav class="z-10 flex flex-1 flex-col" aria-label="Main menu">
      <TabIndicator
        v-if="activeTabIndex !== null"
        :activeTabIndex="activeTabIndex"
        :tabHeight="tabHeight"
      />
      <TabItem
        v-for="(tab, index) in tabs"
        :key="tab.path"
        :index="index"
        :tab="tab.name"
        :active="activeTabIndex === index"
        :isSidebarOpen="isSidebarOpen"
        @setActiveTab="setActiveTab"
      />
    </nav>

    <!-- Footer/logout -->
    <footer>
      <TabItem
        tab="Log out"
        :isSidebarOpen="isSidebarOpen"
        @click="handleLogout"
        aria-label="Log out"
      />
    </footer>
  </aside>
</template>

<style scoped></style>
