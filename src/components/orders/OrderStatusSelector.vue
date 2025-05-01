<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { OrderStatus } from '../../types/order';
import { useOrdersStore } from '../../stores/orderStore';
import { ElSelect, ElOption, ElTag } from 'element-plus';

const props = defineProps<{
  status: OrderStatus;
  orderId: string;
}>();

const emit = defineEmits<{
  (e: 'update', newStatus: OrderStatus): void;
}>();

const store = useOrdersStore();
const localStatus = ref(props.status);

const statusOptions = computed(() => store.getNextStatusOptions(props.status));

const onStatusChange = async (newStatus: OrderStatus) => {
  await store.updateOrderStatus(props.orderId, newStatus);
  emit('update', newStatus);
};

watch(
  () => props.status,
  (newStatus) => {
    localStatus.value = newStatus;
  },
);
</script>
<template>
  <div>
    <!-- Select dropdown for updatable statuses -->
    <el-select
      v-if="statusOptions.length"
      v-model="localStatus"
      :class="status"
      no-data-text="No options"
      style="width: 120px"
      @change="onStatusChange"
    >
      <el-option v-for="opt in statusOptions" :key="opt.value" v-bind="opt" />
    </el-select>

    <!-- Static tag for final statuses -->
    <el-tag v-else :class="['status-tag', status]">
      {{ status }}
    </el-tag>
  </div>
</template>

<style scoped>
:deep(.Pending .el-select__placeholder span) {
  color: oklch(0.769 0.188 70.08);
}
:deep(.Processing .el-select__placeholder span) {
  color: oklch(0.558 0.288 302.321);
}
:deep(.Shipped .el-select__placeholder span) {
  color: oklch(0.546 0.245 262.881);
}

:deep(.Pending .el-select__wrapper) {
  background-color: var(--color-orange-100) !important;
}
:deep(.Processing .el-select__wrapper) {
  background-color: oklch(0.946 0.033 307.174) !important;
}
:deep(.Shipped .el-select__wrapper) {
  background-color: oklch(0.932 0.032 255.585) !important;
}

html.dark {
  :deep(.Pending .el-select__placeholder span) {
    color: var(--color-orange-400);
  }
  :deep(.Processing .el-select__placeholder span) {
    color: oklch(0.7 0.288 302.321);
  }
  :deep(.Shipped .el-select__placeholder span) {
    color: oklch(0.7 0.245 262.881);
  }

  :deep(.Pending .el-select__wrapper) {
    background-color: oklch(0.25 0.059 95.617) !important;
  }
  :deep(.Processing .el-select__wrapper) {
    background-color: oklch(0.23 0.033 307.174) !important;
  }
  :deep(.Shipped .el-select__wrapper) {
    background-color: oklch(0.22 0.032 255.585) !important;
  }
}
</style>
