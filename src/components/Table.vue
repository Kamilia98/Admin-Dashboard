<script setup lang="ts">
defineProps<{
  caption: string;
  headers: { key: string; label: string }[];
  items: Record<string, any>[];
  rowKey?: string;
}>();
</script>

<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <table class="min-w-full">
        <caption
          class="border-b border-gray-200 px-5 py-3 text-left text-gray-800 sm:px-6 dark:border-gray-800 dark:text-white/90 text-theme-xl"
        >
          {{
            caption
          }}
        </caption>
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th
              v-for="(header, index) in headers"
              :key="index"
              class="w-2/11 px-5 py-3 text-left sm:px-6"
            >
              <p
                class="text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {{ header.label }}
              </p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
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
