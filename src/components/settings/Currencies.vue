<script setup lang="ts">
import { ref } from 'vue';
import { useStoreConfigStore } from '../../stores/storeConfigStore';
import { ElInput, ElButton, ElIcon, ElTag, ElMessageBox } from 'element-plus';
import {
  Plus,
  Star,
  Edit,
  Delete,
  Check,
  Close,
} from '@element-plus/icons-vue';

const editingId = ref<string | null>(null);
const newCurrency = ref({
  code: '',
  name: '',
  symbol: '',
  exchangeRate: 1,
  isActive: true,
  isDefault: false,
});
const editCurrency = ref({
  id: '',
  code: '',
  name: '',
  symbol: '',
  exchangeRate: 1,
  isActive: true,
  isDefault: false,
});

const {
  activeCurrencies,
  addCurrency,
  updateCurrency,
  softDeleteCurrency,
  setDefaultCurrency,
} = useStoreConfigStore();

const handleAddCurrency = () => {
  if (
    newCurrency.value.code &&
    newCurrency.value.name &&
    newCurrency.value.symbol
  ) {
    addCurrency(newCurrency.value);
    newCurrency.value = {
      code: '',
      name: '',
      symbol: '',
      exchangeRate: 0,
      isActive: true,
      isDefault: false,
    };
  }
};

const handleEditCurrency = (currency: any) => {
  editingId.value = currency.code;
  editCurrency.value = {
    id: currency.code,
    code: currency.code,
    name: currency.name,
    symbol: currency.symbol,
    exchangeRate: currency.exchangeRate,
    isActive: currency.isActive,
    isDefault: currency.isDefault,
  };
};

const handleUpdateCurrency = () => {
  if (
    editCurrency.value.code &&
    editCurrency.value.name &&
    editCurrency.value.symbol
  ) {
    updateCurrency(editCurrency.value.id, editCurrency.value);
    editingId.value = null;
  }
};

const handleCancelEdit = () => {
  editingId.value = null;
};

const handleSetDefault = (currencyCode: string) => {
  setDefaultCurrency(currencyCode);
};

const handleDeleteCurrency = async (currencyCode: string) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this currency?',
      'Confirm Deletion',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger el-button--plain',
      },
    );
    softDeleteCurrency(currencyCode);
  } catch (error) {
    console.log('Deletion cancelled');
  }
};
</script>

<template>
  <div class="space-y-6 font-['Inter',sans-serif]">
    <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <label
        class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
      >
        Add New Currency
      </label>
      <div class="mt-1 space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
            >
              Code
            </label>
            <el-input
              v-model="newCurrency.code"
              placeholder="USD"
              class="mt-1"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <el-input
              v-model="newCurrency.name"
              placeholder="US Dollar"
              class="mt-1"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
            >
              Symbol
            </label>
            <el-input
              v-model="newCurrency.symbol"
              placeholder="$"
              class="mt-1"
            />
          </div>
        </div>
        <div>
          <label
            class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
          >
            Exchange Rate
          </label>
          <el-input
            v-model="newCurrency.exchangeRate"
            placeholder="0.00"
            class="mt-1"
            style="width: 280px"
          />
        </div>
        <el-button
          type="primary"
          plain
          @click="handleAddCurrency"
          class="flex items-center"
        >
          <el-icon class="mr-1"><Plus /></el-icon>
          Add Currency
        </el-button>
      </div>
    </div>

    <div>
      <h3
        class="text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
      >
        Active Currencies
      </h3>
      <div class="mt-2 space-y-4">
        <div
          v-for="currency in activeCurrencies"
          :key="currency.code"
          class="rounded-lg border border-gray-200 p-4 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
        >
          <div v-if="editingId !== currency.code">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ currency.name }} ({{ currency.code }})
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Symbol: {{ currency.symbol }} | Exchange Rate:
                  {{ currency.exchangeRate }}
                </p>
              </div>
              <div class="flex space-x-2">
                <el-button
                  v-if="!currency.isDefault"
                  type="warning"
                  plain
                  @click="handleSetDefault(currency.code)"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Star /></el-icon>
                  Set Default
                </el-button>
                <el-button
                  type="primary"
                  plain
                  @click="handleEditCurrency(currency)"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Edit /></el-icon>
                  Edit
                </el-button>
                <el-button
                  type="danger"
                  plain
                  @click="handleDeleteCurrency(currency.code)"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Delete /></el-icon>
                  Delete
                </el-button>
              </div>
            </div>
            <div v-if="currency.isDefault" class="mt-2">
              <el-tag type="warning" effect="light"> Default Currency </el-tag>
            </div>
          </div>
          <div v-else>
            <div class="space-y-4">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
                  >
                    Code
                  </label>
                  <el-input v-model="editCurrency.code" class="mt-1" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <el-input v-model="editCurrency.name" class="mt-1" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
                  >
                    Symbol
                  </label>
                  <el-input v-model="editCurrency.symbol" class="mt-1" />
                </div>
              </div>
              <div>
                <label
                  class="block text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300"
                >
                  Exchange Rate
                </label>
                <el-input
                  v-model="newCurrency.exchangeRate"
                  placeholder="0.00"
                  class="mt-1 w-full"
                  style="width: 280px"
                />
              </div>
              <div class="flex space-x-2">
                <el-button
                  type="success"
                  plain
                  @click="handleUpdateCurrency"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Check /></el-icon>
                  Save
                </el-button>
                <el-button
                  plain
                  @click="handleCancelEdit"
                  class="flex items-center"
                >
                  <el-icon class="mr-1"><Close /></el-icon>
                  Cancel
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
