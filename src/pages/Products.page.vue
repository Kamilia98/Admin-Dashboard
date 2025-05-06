<script setup lang="ts">
import { ElTabs, ElTabPane } from 'element-plus';

// Components
import Products from '../components/Products.vue';
import Categories from '../components/Categories.vue';
</script>
<template>
  <div class="">
    <el-tabs type="border-card">
      <el-tab-pane label="Products"> <products /> </el-tab-pane>
      <el-tab-pane label="Categories">
        <Categories />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
