<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElIcon, ElMessage } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';
import axios from 'axios';

const router = useRouter();
const isLoading = ref(false);
const email = ref('');
const errors = ref({
  email: '',
  general: '',
});

const validateEmail = () => {
  errors.value.email = '';
  if (!email.value) {
    errors.value.email = 'Email is required';
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errors.value.email = 'Please enter a valid email address';
    return false;
  }
  return true;
};

const handleSendResetLink = async () => {
  if (!validateEmail()) return;

  try {
    isLoading.value = true;
    const response = await axios.post(
      'http://localhost:5000/auth/forgot-password',
      {
        email: email.value,
      },
    );

    if (response.data.status === 'success') {
      // Show success toast
      ElMessage({
        message: 'Reset link has been sent to your email',
        type: 'success',
        duration: 5000,
        showClose: true,
      });

      // Redirect to login
      router.push({
        name: 'login',
      });
    }
  } catch (err: any) {
    console.error('Send reset link error:', err);
    console.error('Error details:', {
      status: err.response?.status,
      message: err.response?.data?.message,
      data: err.response?.data,
      error: err.response?.data?.error || err.message,
    });

    // Show error toast
    ElMessage({
      message:
        err.response?.data?.message ||
        'Failed to send reset link. Please try again.',
      type: 'error',
      duration: 5000,
      showClose: true,
    });

    // Handle different error cases based on backend responses
    if (err.response?.status === 500) {
      // Check for specific error messages from backend
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || err.message;

      if (errorMessage === 'Error sending email.') {
        errors.value.general =
          'Unable to send reset email. Please check your email configuration.';
      } else if (errorMessage?.includes('token')) {
        errors.value.general =
          'Error generating reset token. Please try again.';
      } else {
        errors.value.general =
          'An unexpected error occurred. Please try again later.';
      }
    } else if (err.response?.status === 400) {
      if (err.response.data.message === "User with this email doesn't exist.") {
        errors.value.general = 'No account found with this email address.';
      } else {
        errors.value.general = 'Invalid email address or account not found';
      }
    } else if (err.response?.status === 404) {
      errors.value.general =
        'Service temporarily unavailable. Please try again later.';
    } else {
      errors.value.general = 'Failed to send reset link. Please try again.';
    }
  } finally {
    isLoading.value = false;
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
              Forgot Password
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a reset link
            </p>
          </div>

          <form @submit.prevent="handleSendResetLink">
            <div class="space-y-5">
              <div>
                <label
                  for="email"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Email Address<span class="text-error-500">*</span>
                </label>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
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
                  {{ isLoading ? 'Sending Reset Link...' : 'Send Reset Link' }}
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
