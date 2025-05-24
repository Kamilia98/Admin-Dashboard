<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStoreConfigStore } from '../stores/storeConfigStore';
import BasicSettings from '../components/settings/BasicSettings.vue';
import ShippingMethods from '../components/settings/ShippingMethods.vue';
import UserRoles from '../components/settings/UserRoles.vue';
import Currencies from '../components/settings/Currencies.vue';
import Languages from '../components/settings/Languages.vue';
import HomeIcon from '../icons/HomeIcon.vue';
import UserGroupIcon from '../icons/UserGroupIcon.vue';
import MoneyIcon from '../icons/MoneyIcon.vue';
import LanguageIcon from '../icons/LanguageIcon.vue';
import ShippingIcon from '../icons/ShippingIcon.vue';

interface Tab {
  id: string;
  label: string;
  icon: any;
}

const activeTab = ref<string>('basic');
const storeConfigStore = useStoreConfigStore();
const { saveStoreConfig, loadStoreConfig, isLoading } = storeConfigStore;

const tabs: Tab[] = [
  {
    id: 'basic',
    label: 'Basic Settings',
    icon: HomeIcon,
  },
  {
    id: 'shipping',
    label: 'Shipping Methods',
    icon: ShippingIcon,
  },
  {
    id: 'roles',
    label: 'User Roles',
    icon: UserGroupIcon,
  },
  {
    id: 'currencies',
    label: 'Currencies',
    icon: MoneyIcon,
  },
  {
    id: 'languages',
    label: 'Languages',
    icon: LanguageIcon,
  },
];

const handleSave = async () => {
  try {
    await saveStoreConfig();
  } catch (error) {
    console.error('Failed to save store configuration:', error);
  }
};

onMounted(async () => {
  try {
    console.log('STORE PAGE MOUNTED');
    await loadStoreConfig();
  } catch (error) {
    console.error('Failed to load store configuration:', error);
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 font-['Inter',sans-serif] dark:bg-gray-900"
  >
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex items-center justify-between">
        <h1
          class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Store Configuration
        </h1>
        <button
          @click="handleSave"
          :disabled="isLoading"
          class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          <svg
            class="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save Changes
        </button>
      </div>

      <div class="mb-6">
        <nav class="flex space-x-4" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200',
            ]"
          >
            <component
              v-if="typeof tab.icon !== 'string'"
              :is="tab.icon"
              class="mr-2 h-4 w-4"
            />
            <svg
              v-else
              class="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="tab.icon"
              />
            </svg>
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div
        class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <BasicSettings v-if="activeTab === 'basic'" />
        <ShippingMethods v-if="activeTab === 'shipping'" />
        <UserRoles v-if="activeTab === 'roles'" />
        <Currencies v-if="activeTab === 'currencies'" />
        <Languages v-if="activeTab === 'languages'" />
      </div>
    </div>
  </div>
</template>
