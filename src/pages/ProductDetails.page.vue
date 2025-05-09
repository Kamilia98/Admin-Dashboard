<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '../stores/productStore';

const route = useRoute();
const productStore = useProductStore();

const product = ref<Product | null>(null);
const selectedColor = ref<Color | null>(null); // Selected color state
const selectedImage = ref<string | null>(null); // Image for the selected color

// Fetch the product details when the component is mounted
onMounted(async () => {
  const productId = route.params.id as string;
  console.log('[Product-details --- ID]', productId);
  product.value = await productStore.getProductById(productId);
  console.log('[Product-details --- Product Details]', product.value);

  // Set the initial selected color and image (first color and its corresponding image)
  if (product.value?.colors && product.value.colors.length > 0) {
    selectedColor.value = product.value.colors[0];
    selectedImage.value = product.value.colors[0]?.images[0]?.url || ''; // Use the URL field here
  }
});

// Function to handle color selection and update the displayed image
function selectColor(color: Color) {
  selectedColor.value = color;
  selectedImage.value = color.images[0]?.url || ''; // Use the URL field here
}

// Function to handle image selection
function selectImage(imageUrl: string) {
  selectedImage.value = imageUrl; // Update the selected image
}

// Helper function to get the index of the selected image
function getImageIndex() {
  return (
    selectedColor.value?.images.findIndex(
      (image) => image.url === selectedImage.value,
    ) ?? -1
  );
}

// function goToPreviousImage() {
//   const currentIndex = getImageIndex();
//   if (currentIndex > 0) {
//     selectedImage.value =
//       selectedColor.value?.images[currentIndex - 1].url || '';
//   }
// }

// // Function to go to the next image
// function goToNextImage() {
//   const currentIndex = getImageIndex();
//   if (currentIndex < (selectedColor.value?.images.length ?? 0) - 1) {
//     selectedImage.value =
//       selectedColor.value?.images[currentIndex + 1].url || '';
//   }
// }
</script>

<template>
  <div v-if="product" class="mx-auto max-w-7xl px-6 py-10">
    <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
      <!-- Left Section: Image and Colors -->
      <div class="space-y-6">
        <!-- Color Selection -->
        <div>
          <h3 class="mb-2 text-sm font-semibold text-gray-700">Select Color</h3>
          <div class="flex gap-3">
            <div
              v-for="color in product.colors"
              :key="color._id"
              :style="{ backgroundColor: color.hex }"
              class="h-8 w-8 cursor-pointer rounded-full border"
              :class="{
                'border-gray-800': selectedColor?._id === color._id,
                'border-gray-300': selectedColor?._id !== color._id,
              }"
              @click="selectColor(color)"
            />
          </div>
        </div>

        <!-- Main Image -->
        <div class="rounded-lg border bg-white p-4">
          <img
            :src="selectedImage"
            alt="Selected product image"
            class="h-96 w-full object-contain"
          />
        </div>

        <!-- Thumbnails -->
        <div class="flex gap-3 overflow-x-auto pt-2">
          <img
            v-for="img in selectedColor?.images"
            :key="img._id"
            :src="img.url"
            @click="selectImage(img.url)"
            class="h-16 w-16 cursor-pointer rounded-md border object-cover"
            :class="{
              'border-gray-800': selectedImage === img.url,
              'border-gray-300': selectedImage !== img.url,
            }"
          />
        </div>
      </div>

      <!-- Right Section: Details -->
      <div class="space-y-6">
        <!-- Title -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
          <p class="mt-2 text-gray-500">{{ product.subtitle }}</p>
        </div>

        <!-- Price -->
        <div class="flex items-center gap-4">
          <span class="text-2xl font-semibold text-gray-900">
            ${{ product.sale || product.price }}
          </span>
          <span v-if="product.sale" class="text-gray-400 line-through">
            ${{ product.price }}
          </span>
        </div>

        <!-- Description -->
        <div>
          <h3 class="mb-2 text-sm font-semibold text-gray-700">Description</h3>
          <p class="leading-relaxed text-gray-600">{{ product.description }}</p>
        </div>

        <!-- Additional Information -->
        <div>
          <h3 class="mb-4 text-sm font-semibold text-gray-700">
            Additional Information
          </h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              v-for="(section, title) in product.additionalInformation"
              :key="title"
              class="rounded-md border p-4"
            >
              <h4 class="mb-2 text-xs font-bold text-gray-600 uppercase">
                {{ title }}
              </h4>
              <dl class="space-y-1">
                <div
                  v-for="(value, key) in section"
                  :key="key"
                  class="flex justify-between text-sm text-gray-700"
                >
                  <dt>{{ key.replace(/([A-Z])/g, ' $1').trim() }}:</dt>
                  <dd>
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

  <!-- Loading -->
  <div
    v-else
    class="flex min-h-[50vh] items-center justify-center text-gray-500"
  >
    Loading...
  </div>
</template>
