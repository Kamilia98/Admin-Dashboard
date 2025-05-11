<script setup lang="ts">
import { useStoreConfigStore } from '../../stores/storeConfigStore';
import { ElInput, ElSelect, ElOption } from 'element-plus';
import { onMounted, ref } from 'vue';

const store = useStoreConfigStore();

onMounted(async () => {
  await store.loadStoreConfig();
});
</script>

<template>
  <div class="space-y-6 font-['Inter',sans-serif]">
    <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <label
        class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
      >
        Store Name
      </label>
      <div class="mt-1">
        <el-input
          v-model="store.storeConfig.storeName"
          placeholder="Your store name"
          class="w-full"
        />
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <label
        class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
      >
        Default Currency
      </label>
      <div class="mt-1">
        <el-select
          v-model="store.storeConfig.defaultCurrency"
          class="w-full"
          placeholder="Select default currency"
        >
          <el-option
            v-for="currency in store.storeConfig.supportedCurrencies"
            :key="currency.code"
            :label="`${currency.name} (${currency.symbol})`"
            :value="currency.code"
          />
        </el-select>
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <label
        class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
      >
        Default Language
      </label>
      <div class="mt-1">
        <el-select
          v-model="store.storeConfig.defaultLanguage"
          class="w-full"
          placeholder="Select default language"
        >
          <el-option
            v-for="language in store.storeConfig.supportedLanguages"
            :key="language.code"
            :label="language.name"
            :value="language.code"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>
