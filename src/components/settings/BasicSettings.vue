<script setup lang="ts">
import { useStoreConfigStore } from '../../stores/storeConfigStore';
import { ElInput, ElSelect, ElOption } from 'element-plus';
import { onMounted, ref } from 'vue';

const { storeConfig, activeCurrencies, activeLanguages, loadStoreConfig } =
  useStoreConfigStore();

const Basics = ref({});
onMounted(async () => {
  const basics = await loadStoreConfig();
  Basics.value = basics;
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
          v-model="Basics.storeName"
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
          v-model="Basics.defaultCurrency"
          class="w-full"
          placeholder="Select default currency"
        >
          <el-option
            v-for="currency in Basics.supportedCurrencies"
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
          v-model="Basics.defaultLanguage"
          class="w-full"
          placeholder="Select default language"
        >
          <el-option
            v-for="language in Basics.supportedLanguages"
            :key="language.code"
            :label="language.name"
            :value="language.code"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>
