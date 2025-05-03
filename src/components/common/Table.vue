<script setup lang="ts">
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import { ElIcon, ElSkeleton } from 'element-plus';

defineProps<{
  caption: string;
  headers: { key: string; label: string; sortable: boolean }[];
  items: Record<string, any>[];
  loading: boolean;
  rowKey?: string;
}>();

const emit = defineEmits<{
  (e: 'sort', payload: { key: string; direction: 'asc' | 'desc' }): void;
}>();
</script>

<template>
  <div
    class="overflow-hidden rounded-xl border custom-border bg-white dark:bg-white/[0.03]"
  >
    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <table class="min-w-full">
        <caption
          class="border-b custom-border px-5 py-3 text-left text-theme-xl text-gray-800 sm:px-6 dark:text-white/90"
        >
          {{
            caption
          }}
        </caption>

        <thead>
          <tr class="border-b custom-border">
            <th
              v-for="(header, index) in headers"
              :key="index"
              class="w-2/11 px-5 py-3 text-left text-gray-500 sm:px-6 dark:text-gray-400"
            >
              <div class="flex items-center gap-4">
                <p class="text-theme-xs font-medium">
                  {{ header.label }}
                </p>
                <div class="flex w-4 flex-col gap-1" v-if="header.sortable">
                  <el-icon
                    size="14"
                    @click="emit('sort', { key: header.key, direction: 'asc' })"
                    class="cursor-pointer"
                  >
                    <ArrowUp />
                  </el-icon>

                  <el-icon
                    size="14"
                    @click="
                      emit('sort', { key: header.key, direction: 'desc' })
                    "
                    class="cursor-pointer"
                  >
                    <ArrowDown />
                  </el-icon>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="items.length === 0 && !loading">
          <tr class="border-t border-gray-100 dark:border-gray-800">
            <td
              :colspan="headers.length"
              class="px-5 py-4 text-center text-theme-sm text-gray-800 sm:px-6 dark:text-white/90"
            >
              No data available
            </td>
          </tr>
        </tbody>
        <!-- Table body, shows when not loading -->
        <tbody
          class="divide-y divide-gray-200 dark:divide-gray-700"
          v-else-if="!loading"
        >
          <tr
            v-for="item in items"
            :key="rowKey ? item[rowKey] : item.id"
            class="border-t border-gray-100 text-nowrap dark:border-gray-800"
          >
            <td
              v-for="(header, index) in headers"
              :key="index"
              class="px-5 py-4 text-theme-sm text-gray-800 sm:px-6 dark:text-white/90"
            >
              <slot
                :name="`column-${header.key}`"
                :item="item"
                :value="item[header.key]"
              >
                {{ item[header.key] }}
              </slot>
            </td>
          </tr>
        </tbody>

        <!-- Skeleton loader for rows only, shows when loading is true -->
        <tbody v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="i in 5" :key="i" class="border-t custom-border">
            <td
              v-for="(_, index) in headers"
              :key="index"
              class="px-5 py-4 sm:px-6"
            >
              <el-skeleton animated style="width: 100%" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}

tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
}
</style>
