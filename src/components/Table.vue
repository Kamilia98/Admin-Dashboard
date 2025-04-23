<script setup>
defineProps({
  headers: Array,
  items: Array,
  rowKey: {
    type: String,
    default: "id",
  },
});
</script>

<template>
  <div class="flex h-min overflow-x-scroll">
    <table class="min-w-full border-separate border-spacing-0 text-left">
      <thead>
        <tr class="font-normal">
          <th
            v-for="(header, index) in headers"
            :key="index"
            :class="[
              'border-y border-gray bg-gray-light p-3 font-semibold',
              index === 0 ? 'rounded-tl-2xl border-r-0 border-l' : '',
              index === headers.length - 1
                ? 'rounded-tr-2xl border-r border-l-0 text-center'
                : '',
            ]"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="text-sm font-normal">
        <tr v-for="item in items" :key="item[rowKey]">
          <td
            v-for="(header, index) in headers"
            :key="index"
            class="border-b border-gray p-3"
            :class="[
              index === 0 ? 'border-l' : '',
              index === headers.length - 1 ? 'border-r text-center' : '',
            ]"
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
</template>

<style scoped>
tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}

tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
}
</style>
