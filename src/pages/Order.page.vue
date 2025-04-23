<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
    <h1 class="mb-6 text-3xl font-bold text-center text-gray-800">Order Details</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-xl text-gray-600">Loading...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-xl text-red-500">
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Order Details -->
    <div v-else-if="order" class="space-y-6">
      <div class="space-y-2">
        <p><strong class="font-semibold">Order ID:</strong> {{ order.id }}</p>
        <p><strong class="font-semibold">Customer:</strong> {{ order?.user?.username }}</p>
        <p><strong class="font-semibold">Status:</strong> {{ order.status }}</p>
        <p><strong class="font-semibold">Total:</strong> ${{ order.totalAmount }}</p>
      </div>

      <!-- Additional order info (customize based on your order structure) -->
      <div v-if="order.orderItems && order.orderItems.length">
        <h2 class="text-xl font-semibold">Order Items:</h2>
        <ul class="space-y-3">
          <li v-for="(item, index) in order.orderItems" :key="index" class="flex justify-between border-b py-2">
            <span class="text-gray-700">{{ item.name }} (x{{ item.quantity }})</span>
            <span class="font-semibold text-gray-900">${{ item.price * item.quantity }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- No Order Found -->
    <div v-else class="text-center text-xl text-gray-600">No order found.</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const order = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchOrderById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Order data:", response.data);
    return response.data.data;
  } catch (err) {
    if (err.response) {
      // Server responded with a status other than 2xx
      throw new Error(err.response.data.message || "Failed to fetch order");
    } else if (err.request) {
      // Request was made but no response
      throw new Error("No response from server");
    } else {
      // Something else happened
      throw new Error(err.message);
    }
  }
};

onMounted(async () => {
  try {
    const id = route.params.id;
    if (id) {
      order.value = await fetchOrderById(id);
    } else {
      error.value = "No order ID provided";
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* You can customize additional styles here */
</style>
