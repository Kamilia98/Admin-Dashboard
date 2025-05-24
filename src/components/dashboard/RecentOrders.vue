<template>
  <Table
    caption="Recent Orders"
    :loading="store.loading"
    :headers="[
      {
        key: 'orderNumber',
        label: 'Order',
        sortable: true,
      },
      {
        key: 'userName',
        label: 'Customer',
        sortable: false,
      },
      {
        key: 'totalAmount',
        label: 'Total',
        sortable: true,
      },

      {
        key: 'status',
        label: 'Status',
        sortable: false,
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
      },
    ]"
    :items="store.orders"
    row-key="id"
    @sort="store.handleSort"
  >
    <template #column-status="{ item }">
      <OrderStatusSelector
        :status="item.status"
        :order-id="item.id"
        @update="item.status = $event"
      />
    </template>

    <template #column-actions="{ item }">
      <div class="flex justify-center">
        <Button
          tag="router-link"
          :to="{ name: 'order-details', params: { id: item.id } }"
        >
          <template #icon>
            <el-icon><View /></el-icon>
          </template>
        </Button>
      </div>
    </template>

    <template #actions>
      <router-link
        to="/orders"
        class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        See all
      </router-link>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { ElIcon } from 'element-plus';
import { View } from '@element-plus/icons-vue';

import Table from '../common/Table.vue';
import Button from '../common/Button.vue';
import OrderStatusSelector from '../orders/OrderStatusSelector.vue';

import { useOrdersStore } from '../../stores/orderStore';

const store = useOrdersStore();
onMounted(() => {
  store.fetchOrders({ page: 1, limit: 4, sortByParam: 'createdAt' });
});
</script>
