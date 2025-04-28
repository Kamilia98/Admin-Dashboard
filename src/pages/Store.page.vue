<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useSettings } from "../composables/useSettings";

const showSuccess = ref(false);

const {
  profile,
  theme,
  notifications,
  security,
  isLoading,
  error,
  updateProfile,
  updateTheme,
  updateNotifications,
  updateSecurity,
  saveSettings,
  resetSettings,
  loadSettings,
} = useSettings();


const handleProfilePicture = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    updateProfile({ picture: input.files[0] });
  }
};


const handleSave = async () => {
  try {
    showSuccess.value = false;
    console.log("Saving settings:", {
      profile: { ...profile },
      theme: { ...theme },
      notifications: { ...notifications },
      security: { ...security },
    });
    await saveSettings();
    console.log("Settings saved successfully");
    showSuccess.value = true;

    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  } catch (err) {
    console.error("Failed to save settings:", err);
  }
};


const handleReset = () => {
  resetSettings();
};

onMounted(() => {
  loadSettings();
});
</script>

<template>
  <div class="container mx-auto max-w-7xl px-8 py-8">
    <h1 class="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
      Settings
    </h1>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
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
          <p class="text-sm font-medium text-red-800 dark:text-red-200">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="showSuccess"
      class="mb-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800 dark:text-green-200">
            Settings saved successfully!
          </p>
        </div>
      </div>
    </div>

    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- Profile Settings -->
      <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Profile Settings
        </h2>
        <div class="space-y-4">
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Name</label
            >
            <input
              type="text"
              :value="profile.name"
              @input="
                updateProfile({
                  name: ($event.target as HTMLInputElement).value,
                })
              "
              placeholder="Your name"
              class="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Email</label
            >
            <input
              type="email"
              :value="profile.email"
              @input="
                updateProfile({
                  email: ($event.target as HTMLInputElement).value,
                })
              "
              placeholder="Your email"
              class="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Profile Picture</label
            >
            <input
              type="file"
              @change="handleProfilePicture"
              accept="image/*"
              class="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
            />
          </div>
        </div>
      </div>

      <!-- Theme Settings -->
      <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Theme Settings
        </h2>
        <div class="space-y-4">
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Theme Mode</label
            >
            <select
              :value="theme.mode"
              @change="
                updateTheme({
                  mode: ($event.target as HTMLSelectElement)
                    .value as Theme['mode'],
                })
              "
              class="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Primary Color</label
            >
            <input
              type="color"
              :value="theme.primaryColor"
              @change="
                updateTheme({
                  primaryColor: ($event.target as HTMLInputElement).value,
                })
              "
              class="h-10 w-full rounded-md border border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Notification Settings
        </h2>
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              :checked="notifications.email"
              @change="
                updateNotifications({
                  email: ($event.target as HTMLInputElement).checked,
                })
              "
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Email Notifications</label
            >
          </div>
        
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              :checked="notifications.sms"
              @change="
                updateNotifications({
                  sms: ($event.target as HTMLInputElement).checked,
                })
              "
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >SMS Notifications</label
            >
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Security Settings
        </h2>
        <div class="space-y-4">
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Two-Factor Authentication</label
            >
            <select
              :value="security.twoFactor"
              @change="
                updateSecurity({
                  twoFactor: ($event.target as HTMLSelectElement)
                    .value as Security['twoFactor'],
                })
              "
              class="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Password</label
            >
            <input
              type="password"
              :value="security.password"
              @input="
                updateSecurity({
                  password: ($event.target as HTMLInputElement).value,
                })
              "
              placeholder="Change password"
              class="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-4">
      <button
        @click="handleSave"
        :disabled="isLoading"
        class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span v-if="isLoading" class="flex items-center">
          <svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Saving...
        </span>
        <span v-else>Save Changes</span>
      </button>
      <button
        @click="handleReset"
        :disabled="isLoading"
        class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Reset to Default
      </button>
    </div>
  </div>
</template>

