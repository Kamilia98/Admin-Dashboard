<script setup lang="ts">
import { ref } from 'vue';
import { ElIcon, ElCheckbox } from 'element-plus';
import { Hide, Loading, View } from '@element-plus/icons-vue';
import { useAuthStore } from '../stores/authStore';

const { login, error: authError, isLoading } = useAuthStore();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const keepLoggedIn = ref(false);

const errors = ref({
  email: '',
  password: '',
  general: '',
});

const validateForm = () => {
  let isValid = true;
  errors.value = {
    email: '',
    password: '',
    general: '',
  };

  // Email validation
  if (!email.value) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Password validation
  if (!password.value) {
    errors.value.password = 'Password is required';
    isValid = false;
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  return isValid;
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    await login(email.value, password.value, keepLoggedIn.value);
  } catch (err) {
    console.error('Login failed:', err);
    errors.value.general = authError || 'An error occurred during login';
  }
};
</script>

<template>
  <div class="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
    <div
      class="relative flex h-screen w-full flex-col justify-center lg:flex-row dark:bg-gray-900"
    >
      <div class="flex w-full flex-1 flex-col lg:w-1/2">
        <!-- Form -->
        <div
          class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center"
        >
          <div class="mb-5 sm:mb-8">
            <h1
              class="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90"
            >
              Sign In
            </h1>
          </div>
          <form @submit.prevent="handleLogin">
            <div class="space-y-5">
              <!-- Email -->
              <div>
                <label
                  for="email"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Email<span class="text-error-500">*</span>
                </label>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="info@gmail.com"
                  :class="[
                    'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800',
                    errors.email
                      ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10'
                      : 'border-gray-300',
                  ]"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-error-500">
                  {{ errors.email }}
                </p>
              </div>
              <!-- Password -->
              <div>
                <label
                  for="password"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Password<span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    placeholder="Enter your password"
                    :class="[
                      'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent py-2.5 pr-11 pl-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800',
                      errors.password
                        ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10'
                        : 'border-gray-300',
                    ]"
                  />
                  <span
                    @click="togglePasswordVisibility"
                    class="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                  >
                    <el-icon
                      v-if="!showPassword"
                      color="#98A2B3"
                      width="20"
                      height="20"
                      ><View
                    /></el-icon>
                    <el-icon v-else color="#98A2B3" width="20" height="20"
                      ><Hide
                    /></el-icon>
                  </span>
                </div>
                <p v-if="errors.password" class="mt-1 text-sm text-error-500">
                  {{ errors.password }}
                </p>
              </div>
              <!-- Checkbox -->
              <div class="flex items-center justify-between">
                <div>
                  <el-checkbox
                    v-model="keepLoggedIn"
                    label="Keep me logged in"
                    class="text-sm font-normal text-gray-700 dark:text-gray-400"
                  />
                </div>
                <router-link
                  to="/forgot-password"
                  class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >Forgot password?</router-link
                >
              </div>

              <div
                v-if="errors.general"
                class="rounded-md bg-red-50 p-4 dark:bg-red-900/20"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p
                      class="text-sm font-medium text-red-800 dark:text-red-200"
                    >
                      {{ errors.general }}
                    </p>
                  </div>
                </div>
              </div>
              <!-- Button -->
              <div class="space-y-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span v-if="isLoading" class="mr-2">
                    <el-icon><Loading /></el-icon>
                  </span>
                  {{ isLoading ? 'Signing in...' : 'Sign In' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        class="relative hidden h-full w-full items-center bg-brand-950 lg:grid lg:w-1/2 dark:bg-white/5"
      >
        <div class="z-1 flex items-center justify-center">
          <div class="flex max-w-xs flex-col items-center">
            <router-link to="/" class="mb-4 block">
              <img
                width="231"
                height="48"
                src="/images/logo/logo.svg"
                alt="Logo"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
