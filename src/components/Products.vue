<script setup lang="ts">
import { ElIcon } from 'element-plus';
import Button from './common/Button.vue';
import ProductManager from './products/ProductManager.vue';
import ProductStatistics from './products/ProductStatistics.vue';
import { Plus } from '@element-plus/icons-vue';
</script>

<template>
  <section class="flex flex-col gap-8">
    <ProductStatistics />
    <div class="flex flex-col gap-4">
      <div class="flex justify-end">
        <Button tag="router-link" :to="{ name: 'add-product' }">
          <template #icon>
            <ElIcon><Plus /></ElIcon>
          </template>
          Add Product
        </Button>
      </div>
      <ProductManager />
    </div>
  </section>
</template>
