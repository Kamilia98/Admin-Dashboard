<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
      :disabled="isLoading"
    >
      <span class="mr-3 h-8 w-8 overflow-hidden rounded-full">
        <img
          v-if="!isLoading"
          :src="user.thumbnail"
          :alt="user.fullName"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          class="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700"
        ></div>
      </span>

      <span v-if="!isLoading" class="mr-1 block text-theme-sm font-medium">{{
        user.fname
      }}</span>
      <div
        v-else
        class="mr-1 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
      ></div>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
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
          <img
            v-if="!isLoading"
            :src="user.thumbnail"
            :alt="user.fullName"
            class="h-full w-full object-cover"
          />
          <div
            v-else
            class="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700"
          ></div>
        </div>
        <div>
          <span
            class="block text-theme-sm font-medium text-gray-700 dark:text-gray-400"
          >
            {{ user.fullName }}
          </span>
          <span
            class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400"
          >
            {{ user.email }}
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
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, LogoutIcon } from '../../icons';
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuth } from '../../composables/useAuth';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const router = useRouter();
const { logout } = useAuth();

const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const user = ref({
  fname: '',
  fullName: '',
  email: '',
  thumbnail: '',
});

const fetchUserProfile = async () => {
  try {
    isLoading.value = true;
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get('http://localhost:5000/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status === 'success') {
      const userData = response.data.data.user;
      user.value = {
        fname: userData.username.split(' ')[0],
        fullName: userData.username,
        email: userData.email,
        thumbnail: userData.thumbnail || '',
      };
    }
  } catch (error: any) {
    console.error('Error fetching user profile:', error);

    if (error.response?.status === 401) {
      ElMessage({
        message: 'Session expired. Please login again.',
        type: 'error',
        duration: 5000,
        showClose: true,
      });
      logout();
      router.push({ name: 'login' });
      return;
    }

    ElMessage({
      message: 'Failed to load user profile. Please try again.',
      type: 'error',
      duration: 5000,
      showClose: true,
    });
  } finally {
    isLoading.value = false;
  }
};

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
