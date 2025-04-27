<script setup lang="ts">
import { ref, watch } from "vue";
import { RefreshLeft } from "@element-plus/icons-vue";
import {
  ElSelect,
  ElOption,
  ElDatePicker,
  ElInputNumber,
  ElButton,
} from "element-plus";

const props = defineProps<{
  statusFilter: string[];
  dateRange: [string, string];
  minAmount: number;
  maxAmount: number;
  STATUS_OPTIONS: { label: string; value: string }[];
}>();

const emit = defineEmits<{
  (e: "update:statusFilter", value: string[]): void;
  (e: "update:dateRange", value: [string, string]): void;
  (e: "update:minAmount", value: number): void;
  (e: "update:maxAmount", value: number): void;
  (e: "applyFilters"): void;
  (e: "resetFilters"): void;
  (e: "handleSelectChange"): void;
  (e: "handleDateChange"): void;
}>();

// Local copies
const localStatusFilter = ref([...props.statusFilter]);
const localDateRange = ref<[string, string]>([...props.dateRange]);
const localMinAmount = ref(props.minAmount);
const localMaxAmount = ref(props.maxAmount);

// Watch and emit when local value changes
watch(localStatusFilter, (newVal) => {
  emit("update:statusFilter", newVal);
});
watch(localDateRange, (newVal) => {
  emit("update:dateRange", newVal);
});
watch(localMinAmount, (newVal) => {
  emit("update:minAmount", newVal);
});
watch(localMaxAmount, (newVal) => {
  emit("update:maxAmount", newVal);
});
</script>

<template>
  <div class="flex max-w-[450px] flex-col gap-4 p-4">
    <!-- Status Filter -->
    <div class="flex items-center gap-1">
      <label class="w-10">Status:</label>
      <el-select
        v-model="localStatusFilter"
        multiple
        style="width: 240px"
        @change="$emit('handleSelectChange')"
      >
        <el-option
          v-for="item in STATUS_OPTIONS"
          :key="item.value"
          v-bind="item"
        />
      </el-select>
    </div>

    <!-- Date Range Filter -->
    <div class="flex items-center gap-1">
      <label class="w-10">Date:</label>
      <el-date-picker
        v-model="localDateRange"
        type="daterange"
        range-separator="to"
        start-placeholder="Start date"
        end-placeholder="End date"
        @change="$emit('handleDateChange')"
      />
    </div>

    <!-- Amount Filter -->
    <div class="flex items-center gap-2">
      <label class="w-10">Total:</label>
      <el-input-number
        v-model="localMinAmount"
        placeholder="Min amount"
        :precision="2"
      />
      <span>to</span>
      <el-input-number
        v-model="localMaxAmount"
        placeholder="Max amount"
        :precision="2"
      />
    </div>

    <!-- Apply / Reset Buttons -->
    <div class="self-center">
      <el-button plain @click="$emit('applyFilters')" size="large">
        Apply Filters
      </el-button>
      <el-button
        plain
        @click="$emit('resetFilters')"
        size="large"
        type="danger"
        :icon="RefreshLeft"
      >
        Reset Filters
      </el-button>
    </div>
  </div>
</template>
