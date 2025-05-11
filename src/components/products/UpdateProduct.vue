<template>
  <div>
    <h2>Update Product Test</h2>
    <input v-model="newName" placeholder="New Name" />
    <button @click="update">Update Product</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '../../stores/productStore';

// Grab ID from route
const route = useRoute();
const productId = route.params.id as string;
console.log('[productid]', productId);
const store = useProductStore();
const newName = ref('');

// Optional: Fetch product and pre-fill the name
onMounted(async () => {
  const product = await store.getProductById(productId);
  if (product) {
    newName.value = product.name;
  }
});

const update = async () => {
  await store.updateProduct(productId, { name: newName.value });
};
</script>
