<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '../stores/productStore';
import Button from '../components/common/Button.vue';

const route = useRoute();
const productStore = useProductStore();

const product = ref(null);
const selectedColor = ref(null);
const selectedImage = ref(null);
let productId = '';
// Animation states
const imageLoaded = ref(false);

onMounted(async () => {
  productId = route.params.id as string;
  console.log('[Product-details --- ID]', productId);
  product.value = await productStore.getProductById(productId);
  console.log('[Product-details --- Product Details]', product.value);

  if (product.value?.colors && product.value.colors.length > 0) {
    selectedColor.value = product.value.colors[0];
    selectedImage.value = product.value.colors[0]?.images[0]?.url || '';

    // Trigger animation after a short delay
    setTimeout(() => {
      imageLoaded.value = true;
    }, 300);
  }
});

function selectColor(color) {
  selectedColor.value = color;
  selectedImage.value = color.images[0]?.url || '';

  // Reset image animation for new color
  imageLoaded.value = false;
  setTimeout(() => {
    imageLoaded.value = true;
  }, 300);
}

function selectImage(imageUrl) {
  selectedImage.value = imageUrl;
}

function getImageIndex() {
  return (
    selectedColor.value?.images.findIndex(
      (image) => image.url === selectedImage.value,
    ) ?? -1
  );
}
</script>

<template>
  <div v-if="product" class="mx-auto max-w-7xl px-6 py-12">
    <div class="grid grid-cols-1 gap-16 md:grid-cols-2">
      <!-- Left Section: Image Gallery -->
      <div class="flex flex-col space-y-8">
        <!-- Action Buttons -->
        <div class="flex gap-4">
          <Button
            variant="primary"
            @click="productStore.updateProduct(productId)"
          >
            Edit
            <template #icon>
              <el-icon>
                <Edit />
              </el-icon>
            </template>
          </Button>
          <Button
            variant="danger"
            @click="productStore.deleteProductById(productId)"
          >
            Delete
            <template #icon>
              <el-icon>
                <Delete />
              </el-icon>
            </template>
          </Button>
        </div>

        <!-- Main Image -->
        <div
          class="relative aspect-square overflow-hidden rounded-xl bg-gray-50 shadow-md dark:bg-gray-800"
        >
          <img
            :src="selectedImage"
            alt="Selected product image"
            class="h-full w-full rounded-xl object-cover transition-all duration-500"
            :class="
              imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            "
            @load="imageLoaded = true"
          />

          <!-- Sale badge -->
          <div
            v-if="product.sale"
            class="absolute top-4 left-4 rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white"
          >
            {{ product.sale }}% OFF
          </div>
        </div>

        <!-- Thumbnails Grid -->
        <div class="grid grid-cols-6 gap-3">
          <div
            v-for="img in selectedColor?.images"
            :key="img._id"
            @click="selectImage(img.url)"
            class="aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-50 transition-all duration-200 hover:opacity-90 dark:bg-gray-800"
            :class="{
              'ring-2 ring-brand-500 ring-offset-1': selectedImage === img.url,
            }"
          >
            <img :src="img.url" class="h-full w-full rounded-lg object-cover" />
          </div>
        </div>
      </div>

      <!-- Right Section: Product Details -->
      <div class="flex flex-col space-y-10">
        <!-- Header -->
        <div class="space-y-6">
          <div>
            <h1
              class="text-4xl font-light tracking-tight text-gray-900 dark:text-gray-100"
            >
              {{ product.name }}
            </h1>
            <p class="mt-2 text-lg text-gray-500">{{ product.subtitle }}</p>
          </div>

          <div class="flex items-baseline gap-4">
            <span class="text-3xl font-medium text-brand-500">
              ${{
                (product.price - (product.price * product.sale) / 100).toFixed(
                  2,
                ) || product.price
              }}
            </span>
            <span
              v-if="product.sale"
              class="text-lg text-gray-400 line-through"
            >
              ${{ product.price }}
            </span>
          </div>
        </div>

        <!-- Color Selection -->
        <div class="space-y-4">
          <h3
            class="text-sm font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300"
          >
            Color Options
          </h3>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="color in product.colors"
              :key="color._id"
              :style="{ backgroundColor: color.hex }"
              class="h-12 w-12 cursor-pointer rounded-full border border-gray-300 shadow-sm transition-all hover:scale-105"
              :class="[
                selectedColor?._id === color._id
                  ? 'ring-2 ring-brand-500 ring-offset-2'
                  : 'ring-1 ring-white dark:ring-gray-300',
              ]"
              @click="selectColor(color)"
            />
          </div>
        </div>

        <!-- Quantity Information -->
        <div class="flex items-center gap-3">
          <h3
            class="text-sm font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300"
          >
            Quantity:
          </h3>
          <div class="text-lg font-medium dark:text-gray-300">
            {{ selectedColor?.quantity }}
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-3">
          <h3
            class="text-sm font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300"
          >
            Description
          </h3>
          <p
            class="max-w-prose text-base leading-relaxed text-gray-600 dark:text-gray-400"
          >
            {{ product.description }}
          </p>
        </div>

        <!-- Specifications -->
        <div class="space-y-5">
          <h3
            class="text-sm font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300"
          >
            Specifications
          </h3>
          <div class="grid gap-6 sm:grid-cols-2">
            <div
              v-for="(section, title) in product.additionalInformation"
              :key="title"
              class="rounded-lg bg-gray-50 p-6 shadow-sm dark:bg-gray-800"
            >
              <h4
                class="mb-4 text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-300"
              >
                {{ title }}
              </h4>
              <dl class="space-y-3">
                <div
                  v-for="(value, key) in section"
                  :key="key"
                  class="flex justify-between text-sm"
                >
                  <dt class="text-gray-600 dark:text-gray-400">
                    {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                  </dt>
                  <dd class="font-medium text-gray-800 dark:text-gray-200">
                    {{
                      typeof value === 'boolean'
                        ? value
                          ? 'Yes'
                          : 'No'
                        : value
                    }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="flex min-h-screen items-center justify-center">
    <div class="text-center text-brand-500">
      <svg class="mx-auto h-16 w-16 animate-spin" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p class="mt-4 text-gray-600 dark:text-gray-400">
        Loading product details...
      </p>
    </div>
  </div>
</template>
