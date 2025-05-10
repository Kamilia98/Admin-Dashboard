<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '../stores/productStore';

const route = useRoute();
const productStore = useProductStore();

const product = ref<Product | null>(null);
const selectedColor = ref<Color | null>(null);
const selectedImage = ref<string | null>(null);

onMounted(async () => {
  const productId = route.params.id as string;
  console.log('[Product-details --- ID]', productId);
  product.value = await productStore.getProductById(productId);
  console.log('[Product-details --- Product Details]', product.value);

  if (product.value?.colors && product.value.colors.length > 0) {
    selectedColor.value = product.value.colors[0];
    selectedImage.value = product.value.colors[0]?.images[0]?.url || '';
  }
});

function selectColor(color: Color) {
  selectedColor.value = color;
  selectedImage.value = color.images[0]?.url || '';
}

function selectImage(imageUrl: string) {
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
    <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
      <!-- Left Section: Image Gallery -->
      <div class="space-y-6">
        <!-- Main Image -->
        <div class="aspect-square rounded-lg bg-gray-50">
          <img
            :src="selectedImage"
            alt="Selected product image"
            class="h-full w-full rounded-lg object-cover"
          />
        </div>

        <!-- Thumbnails Grid -->
        <div class="grid grid-cols-6 gap-4">
          <div
            v-for="img in selectedColor?.images"
            :key="img._id"
            @click="selectImage(img.url)"
            class="aspect-square cursor-pointer rounded-lg bg-gray-50 object-cover transition-all hover:opacity-90"
            :class="{
              'ring-1 ring-brand-500': selectedImage === img.url,
            }"
          >
            <img :src="img.url" class="h-full w-full rounded-lg object-cover" />
          </div>
        </div>
      </div>

      <!-- Right Section: Product Details -->
      <div class="space-y-8">
        <!-- Header -->
        <div class="space-y-4">
          <h1 class="text-4xl font-light text-gray-900 dark:text-gray-100">
            {{ product.name }}
          </h1>
          <p class="text-lg text-gray-500">{{ product.subtitle }}</p>
          <div class="flex items-baseline gap-4">
            <span class="text-3xl font-medium text-brand-500">
              ${{
                (product.price - (product.price * product.sale) / 100).toFixed(
                  2,
                ) || product.price
              }}
            </span>
            <span v-if="product.sale" class="text-gray-400 line-through">
              ${{ product.price }}
            </span>
          </div>
        </div>

        <!-- Color Selection -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            COLOR OPTIONS
          </h3>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="color in product.colors"
              :key="color._id"
              :style="{ backgroundColor: color.hex }"
              class="h-12 w-12 cursor-pointer rounded-full shadow-sm transition-all hover:scale-105"
              :class="[
                selectedColor?._id === color._id
                  ? 'ring-2 ring-brand-500 ring-offset-2'
                  : 'ring-1 ring-white dark:ring-gray-300',
              ]"
              @click="selectColor(color)"
            />
          </div>
        </div>

        <!-- Quantity Selector -->
        <div class="flex items-center gap-2">
          <h3 class="font-medium dark:text-gray-300">QUANTITY :</h3>
          <div class="dark:text-gray-500">
            {{ selectedColor?.quantity }}
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            DESCRIPTION
          </h3>
          <p class="max-w-prose leading-relaxed text-gray-600">
            {{ product.description }}
          </p>
        </div>

        <!-- Specifications -->
        <div class="space-y-6">
          <h3 class="dark:text-gray-2 00 font-medium text-gray-300">
            SPECIFICATIONS
          </h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div
              v-for="(section, title) in product.additionalInformation"
              :key="title"
              class="rounded-lg bg-gray-50 p-6"
            >
              <h4
                class="mb-3 text-xs font-semibold tracking-wider text-gray-600 uppercase"
              >
                {{ title }}
              </h4>
              <dl class="space-y-2">
                <div
                  v-for="(value, key) in section"
                  :key="key"
                  class="flex justify-between text-sm text-gray-700"
                >
                  <dt class="text-gray-600">
                    {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                  </dt>
                  <dd class="font-medium">
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
    <div class="animate-pulse text-brand-500">
      <svg class="h-12 w-12 animate-spin" viewBox="0 0 24 24">
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
    </div>
  </div>
</template>
