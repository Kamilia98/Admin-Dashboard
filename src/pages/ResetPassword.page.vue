<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { ElIcon, ElMessage } from 'element-plus';
import { Loading, View, Hide } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errors = ref({
  password: '',
  confirmPassword: '',
  general: '',
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const validatePassword = () => {
  errors.value.password = '';
  if (!password.value) {
    errors.value.password = 'Password is required';
    return false;
  }
  if (password.value.length < 8) {
    errors.value.password = 'Password must be at least 8 characters';
    return false;
  }
  return true;
};

const validateConfirmPassword = () => {
  errors.value.confirmPassword = '';
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password';
    return false;
  }
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match';
    return false;
  }
  return true;
};

const handleResetPassword = async () => {
  if (!validatePassword() || !validateConfirmPassword()) return;

  try {
    isLoading.value = true;
    const response = await axios.post(
      'http://localhost:5000/auth/reset-password',
      {
        token: route.query.token,
        password: password.value,
      },
    );

    if (response.data.status === 'success') {
      ElMessage({
        message: 'Password has been reset successfully.',
        type: 'success',
        duration: 5000,
        showClose: true,
      });
      router.push({
        name: 'login',
      });
    }
  } catch (err: any) {
    console.error('Reset password error:', err);
    if (err.response?.data?.message) {
      errors.value.general = err.response.data.message;
    } else if (err.response?.status === 400) {
      errors.value.general =
        'Invalid or expired reset token. Please request a new password reset.';
    } else {
      errors.value.general = 'Failed to reset password. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (!route.query.token) {
    router.push({ name: 'login' });
  }
});
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
              Reset Password
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Enter your new password below
            </p>
          </div>

          <form @submit.prevent="handleResetPassword">
            <div class="space-y-5">
              <div>
                <label
                  for="password"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  New Password<span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    placeholder="Enter your new password"
                    :class="[
                      'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800',
                      errors.password
                        ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10'
                        : 'border-gray-300',
                    ]"
                  />
                  <span
                    @click="togglePasswordVisibility"
                    class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <el-icon v-if="!showPassword"><View /></el-icon>
                    <el-icon v-else><Hide /></el-icon>
                  </span>
                </div>
                <p v-if="errors.password" class="mt-1 text-sm text-error-500">
                  {{ errors.password }}
                </p>
              </div>

              <div>
                <label
                  for="confirmPassword"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Confirm Password<span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirmPassword"
                    placeholder="Confirm your new password"
                    :class="[
                      'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800',
                      errors.confirmPassword
                        ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10'
                        : 'border-gray-300',
                    ]"
                  />
                  <span
                    @click="toggleConfirmPasswordVisibility"
                    class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <el-icon v-if="!showConfirmPassword"><View /></el-icon>
                    <el-icon v-else><Hide /></el-icon>
                  </span>
                </div>
                <p
                  v-if="errors.confirmPassword"
                  class="mt-1 text-sm text-error-500"
                >
                  {{ errors.confirmPassword }}
                </p>
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

              <div class="space-y-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span v-if="isLoading" class="mr-2">
                    <el-icon><Loading /></el-icon>
                  </span>
                  {{ isLoading ? 'Resetting Password...' : 'Reset Password' }}
                </button>

                <router-link
                  to="/login"
                  class="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Back to Login
                </router-link>
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
