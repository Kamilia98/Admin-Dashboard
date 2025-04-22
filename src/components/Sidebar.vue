<script setup lang="ts">
import { ref } from "vue";
import Icon from "./Icon.vue";
import TabIndicator from "./TabIndicator.vue";
import TabItem from "./TabItem.vue";
import { useRouter, RouterLink } from "vue-router";

const props = defineProps<{
  tabs: { name: string; path: string }[];
  activeTabIndex: number | null;
}>();

const emit = defineEmits(["updateActiveTab"]);
const isSidebarOpen = ref(true);
const tabHeight = 60;
const router = useRouter();

const setActiveTab = (index: number) => {
  emit("updateActiveTab", index);
  router.push(props.tabs[index].path);
};

const clearActiveTab = () => {
  emit("updateActiveTab", null);
};

const handleLogout = () => {
  console.log("Logging out...");
};
</script>

<template>
  <div
    v-if="isSidebarOpen"
    class="absolute top-0 right-0 bottom-0 left-0 z-3 h-full w-full bg-black/20 lg:hidden"
    @click="isSidebarOpen = !isSidebarOpen"
  ></div>
  <aside
    :class="[
      'absolute top-2 bottom-2 z-999 flex flex-col justify-between gap-2 overflow-hidden rounded-2xl bg-primary p-4 text-white transition-all duration-300 ease-in-out lg:relative lg:top-0 lg:bottom-0',
      isSidebarOpen ? 'w-64' : 'w-16',
    ]"
  >
    <!-- Header -->
    <div
      class="flex h-[60px] items-center border-b-2 border-white/50 py-2"
      :class="{
        'justify-between': isSidebarOpen,
        'justify-center': !isSidebarOpen,
      }"
    >
      <router-link
        v-if="isSidebarOpen"
        class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-full text-white transition-colors"
        @click="clearActiveTab"
        to="/"
      >
        <span class="text-lg font-bold">Dashboard</span>
      </router-link>
      <div
        class="h-5 w-5 cursor-pointer rounded border-1 border-white bg-white/30 p-1 text-white"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        <Icon name="twoarrows" :flip="isSidebarOpen" />
      </div>
    </div>

    <!-- Tabs -->
    <div class="z-10 flex flex-1 flex-col">
      <TabIndicator
        v-if="activeTabIndex !== null"
        :activeTabIndex="activeTabIndex ?? -1"
        :tabHeight="tabHeight"
      />
      <TabItem
        v-for="(tab, index) in tabs"
        :key="index"
        :index="index"
        :tab="tab.name"
        :active="activeTabIndex === index"
        :isSidebarOpen="isSidebarOpen"
        @setActiveTab="setActiveTab"
      />
    </div>

    <!-- Log out Tab -->
    <div>
      <TabItem
        tab="Log out"
        :isSidebarOpen="isSidebarOpen"
        @click="handleLogout"
      />
    </div>
  </aside>
</template>
<style scoped lang="css">
x {
  color: #3b099d;
}
</style>
