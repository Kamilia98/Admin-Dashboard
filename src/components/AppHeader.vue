<template>
  <header
    class="sticky top-0 z-99999 flex w-full custom-border bg-white lg:border-b dark:bg-gray-900"
  >
    <div
      class="flex grow flex-col items-center justify-between lg:flex-row lg:px-6"
    >
      <div
        class="flex w-full items-center justify-between gap-2 border-b custom-border px-3 py-3 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4"
      >
        <button
          @click="handleToggle"
          class="z-99999 flex h-10 w-10 items-center justify-center rounded-lg custom-border text-gray-500 lg:h-11 lg:w-11 lg:border dark:text-gray-400"
          :class="[
            isMobileOpen
              ? 'bg-gray-100 lg:bg-transparent dark:bg-gray-800 dark:lg:bg-transparent'
              : '',
          ]"
        >
          <OpenSidebarIcon v-if="isMobileOpen" />
          <CloseSidebarIcon v-else />
        </button>
        <HeaderLogo />
        <button
          @click="toggleApplicationMenu"
          class="z-99999 flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <DotsIcons />
        </button>
      </div>

      <div
        :class="[isApplicationMenuOpen ? 'flex' : 'hidden']"
        class="w-full items-center justify-between gap-4 px-5 py-4 shadow-theme-md lg:flex lg:justify-end lg:px-0 lg:shadow-none"
      >
        <div class="flex items-center gap-2 2xsm:gap-3">
          <ThemeToggler />
          <NotificationMenu />
        </div>
        <UserMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSidebar } from '../composables/useSidebar';
import ThemeToggler from './ThemeToggler.vue';
import HeaderLogo from './header/HeaderLogo.vue';
import NotificationMenu from './header/NotificationMenu.vue';
import UserMenu from './header/UserMenu.vue';
import { DotsIcons, OpenSidebarIcon, CloseSidebarIcon } from '../icons';

const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar();

const handleToggle = () => {
  if (window.innerWidth >= 1024) {
    toggleSidebar();
  } else {
    toggleMobileSidebar();
  }
};

const isApplicationMenuOpen = ref(false);

const toggleApplicationMenu = () => {
  isApplicationMenuOpen.value = !isApplicationMenuOpen.value;
};
</script>
