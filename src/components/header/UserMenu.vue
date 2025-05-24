<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
      :disabled="isLoading"
    >
      <span class="mr-3 h-8 w-8 overflow-hidden rounded-full">
        <template v-if="!isLoading">
          <img
            v-if="userStore.user.thumbnail"
            :src="userStore.user.thumbnail"
            :alt="userStore.user.fullName"
            class="h-full w-full object-cover"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800"
          >
            <span class="text-lg text-gray-500 dark:text-gray-400">
              {{ userStore.user.fullName?.charAt(0)?.toUpperCase() }}
            </span>
          </div>
        </template>
        <div
          v-else
          class="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700"
        ></div>
      </span>

      <span v-if="!isLoading" class="mr-1 block text-theme-sm font-medium">{{
        userStore.user.fname
      }}</span>
      <div
        v-else
        class="mr-1 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
      ></div>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <router-link
        to="/profile"
        class="flex items-center gap-3 border-b border-gray-200 pb-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
        @click="closeDropdown"
      >
        <div class="h-12 w-12 overflow-hidden rounded-full">
          <template v-if="!isLoading">
            <img
              v-if="userStore.user.thumbnail"
              :src="userStore.user.thumbnail"
              :alt="userStore.user.fullName"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800"
            >
              <span class="text-2xl text-gray-500 dark:text-gray-400">
                {{ capitalize(userStore.user.fullName?.charAt(0)) }}
              </span>
            </div>
          </template>
          <div
            v-else
            class="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700"
          ></div>
        </div>

        <div>
          <span
            class="block text-theme-sm font-medium text-gray-700 dark:text-gray-400"
          >
            {{ capitalize(userStore.user.fullName) }}
          </span>
          <span
            class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400"
          >
            {{ userStore.user.email }}
          </span>
        </div>
      </router-link>

      <router-link
        :to="{ name: 'signout' }"
        @click="signOut"
        class="group mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, LogoutIcon } from '../../icons';
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted, capitalize } from 'vue';
import { useUserStore } from '../../stores/userProfile';
import { useUserProfile } from '../../composables/useUserProfile';
import { useAuthStore } from '../../stores/authStore';

const router = useRouter();
const { logout } = useAuthStore();
const userStore = useUserStore();
const isLoading = ref(false);
const { fetchUserProfile } = useUserProfile();

const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};

const signOut = () => {
  logout();
  router.push({ name: 'login' });
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  fetchUserProfile();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
