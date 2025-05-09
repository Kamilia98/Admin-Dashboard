<script setup lang="ts">
import { onMounted, watch } from 'vue';

import {
  ElDatePicker,
  ElSelect,
  ElOption,
  ElIcon,
  ElInputNumber,
  ElDropdown,
} from 'element-plus';
import { View, RefreshLeft } from '@element-plus/icons-vue';

import Search from '../common/Search.vue';
import Table from '../common/Table.vue';
import FilterIcon from '../../icons/FilterIcon.vue';
import OrderStatusSelector from './OrderStatusSelector.vue';

import { useOrdersStore } from '../../stores/orderStore';
import Button from '../common/Button.vue';
import Pagination from '../common/Pagination.vue';

const store = useOrdersStore();

const props = defineProps<{
  userId?: string;
  limit?: number;
}>();

/* ========== Lifecycle ========== */
onMounted(async () => {
  if (props.userId) store.userId = props.userId;
  await store.fetchOrders({
    page: 1,
    userId: props.userId,
    limit: props.limit,
  });
});

watch(
  () => props.limit,
  (newLimit) => {
    store.fetchOrders({ page: 1, userId: props.userId, limit: newLimit });
  },
);
</script>

<template>
  <!-- Orders Table -->
  <div class="flex flex-col gap-4">
    <Table
      caption="Orders"
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
          key: 'createdAt',
          label: 'Date',
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
        <div class="flex items-center justify-end gap-4 md:gap-6">
          <Search
            title="orders"
            v-model="store.searchQuery"
            @search="store.fetchOrders({ page: 1, userId })"
          />

          <!-- Filter Button -->

          <el-dropdown
            placement="top-start"
            trigger="click"
            :hide-on-click="false"
          >
            <Button>
              Filter
              <template #icon>
                <FilterIcon />
              </template>
            </Button>
            <template #dropdown>
              <!-- Filters -->
              <div class="rounded-md bg-white dark:bg-gray-900">
                <div
                  class="flex max-w-[450px] flex-col gap-4 bg-white/[0.03] p-4"
                >
                  <!-- Status Filter -->
                  <div class="flex items-center gap-1">
                    <label class="w-10 dark:text-white/90">Status:</label>
                    <el-select
                      v-model="store.statusFilter"
                      multiple
                      style="width: 240px"
                      :teleported="false"
                      class="bg-white/[0.03]"
                    >
                      <el-option
                        v-for="item in store.STATUS_OPTIONS"
                        :key="item.value"
                        v-bind="item"
                      />
                    </el-select>
                  </div>

                  <!-- Date Range Filter -->
                  <div class="flex items-center gap-1">
                    <label class="w-10 dark:text-white/90">Date:</label>
                    <el-date-picker
                      v-model="store.dateRange"
                      type="daterange"
                      range-separator="to"
                      start-placeholder="Start date"
                      end-placeholder="End date"
                      @change="store.handleDateChange"
                    />
                  </div>

                  <div class="flex items-center gap-2">
                    <label class="w-10 dark:text-white/90">Total:</label>
                    <el-input-number
                      v-model="store.minAmount"
                      placeholder="Min amount"
                      :precision="2"
                    />
                    <span class="dark:text-white/90">to</span>
                    <el-input-number
                      v-model="store.maxAmount"
                      placeholder="Max amount"
                      :precision="2"
                    />
                  </div>
                  <div class="flex gap-2 self-center">
                    <Button
                      @click="store.fetchOrders({ page: 1, userId })"
                      variant="primary"
                    >
                      Apply Filters
                    </Button>
                    <Button @click="store.handleReset" variant="danger">
                      Reset Filters
                      <template #icon>
                        <el-icon>
                          <RefreshLeft />
                        </el-icon>
                      </template>
                    </Button>
                  </div>
                </div>
              </div>
            </template>
          </el-dropdown>
        </div>
      </template>
    </Table>

    <Pagination
      title="orders"
      :currentPage="store.currentPage"
      :totalPages="store.totalPages"
      :totalItems="store.totalOrders"
      :limit="store.limits"
      @changePage="(page) => store.fetchOrders({ page, limit: limit })"
    />
  </div>
</template>
