<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
    <template v-if="bestEntities">
      <!-- Best Product Card -->
      <div
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="mb-3 flex items-center justify-between">
          <h3
            class="text-base font-medium text-gray-900 md:text-lg dark:text-white"
          >
            Best Product
          </h3>
          <div
            class="rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-800 md:text-sm"
          >
            {{ bestEntities.bestProduct?.orderCount }} Orders
          </div>
        </div>

        <div class="flex flex-1 flex-col justify-between gap-3">
          <div
            class="h-24 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-28 md:h-32"
          >
            <img
              v-if="bestEntities.bestProduct?.productImage"
              :src="bestEntities.bestProduct.productImage"
              :alt="bestEntities.bestProduct.productDetails.name"
              class="h-full w-full object-cover object-center"
            />
            <div
              v-else
              class="flex h-full items-center justify-center bg-gray-200"
            >
              <span class="text-gray-400">No image</span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex flex-col sm:flex-row sm:justify-between">
              <h4
                class="truncate text-lg font-semibold text-gray-900 md:text-xl dark:text-white"
              >
                {{ bestEntities.bestProduct?.productDetails?.name }}
              </h4>
              <div class="flex items-center gap-1">
                <span class="text-sm font-medium text-gray-500">{{
                  bestEntities.bestProduct?.productDetails?.brand
                }}</span>
                <span
                  v-if="bestEntities.bestProduct?.productDetails?.sale"
                  class="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-800"
                >
                  {{ bestEntities.bestProduct?.productDetails?.sale }}% OFF
                </span>
              </div>
            </div>

            <p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
              {{ bestEntities.bestProduct?.productDetails?.subtitle }}
            </p>
          </div>

          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                >Price</span
              >
              <div class="flex items-center gap-2">
                <span
                  class="text-base font-bold text-brand-600 md:text-lg dark:text-brand-400"
                >
                  ${{
                    (
                      bestEntities.bestProduct?.productDetails?.price *
                      (1 - bestEntities.bestProduct?.productDetails?.sale / 100)
                    ).toFixed(2)
                  }}
                </span>
                <span
                  v-if="bestEntities.bestProduct?.productDetails?.sale"
                  class="text-xs text-gray-500 line-through md:text-sm"
                >
                  ${{
                    bestEntities.bestProduct?.productDetails?.price.toFixed(2)
                  }}
                </span>
              </div>
            </div>

            <div class="mt-2 flex items-center justify-between">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                >Stock</span
              >
              <div class="flex items-center gap-2">
                <div
                  class="h-3 w-3 rounded-full"
                  :style="`background-color: ${bestEntities.bestProduct?.productColor?.hex}`"
                ></div>
                <span
                  class="text-xs text-gray-700 md:text-sm dark:text-gray-300"
                >
                  {{ bestEntities.bestProduct?.productColor?.name }}
                  ({{ bestEntities.bestProduct?.productColor?.quantity }})
                </span>
              </div>
            </div>
          </div>

          <div class="mt-2 self-center">
            <Button
              tag="router-link"
              :to="{
                name: 'product-details',
                params: { id: bestEntities.bestProduct?.productId },
              }"
              class="w-full sm:w-auto"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>

      <!-- Best Category Card -->
      <div
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="mb-3 flex items-center justify-between">
          <h3
            class="text-base font-medium text-gray-900 md:text-lg dark:text-white"
          >
            Best Category
          </h3>
          <div
            class="rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-800 md:text-sm"
          >
            {{ bestEntities.bestCategory?.orderCount }} Orders
          </div>
        </div>

        <div class="flex flex-1 flex-col justify-between gap-3">
          <div
            class="h-24 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-28 md:h-32"
          >
            <img
              v-if="bestEntities.bestCategory?.image"
              :src="bestEntities.bestCategory.image"
              :alt="bestEntities.bestCategory.name"
              class="h-full w-full object-cover object-center"
            />
            <div
              v-else
              class="flex h-full items-center justify-center bg-gray-200"
            >
              <span class="text-gray-400">No image</span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <h4
              class="text-lg font-semibold text-gray-900 md:text-xl dark:text-white"
            >
              {{ bestEntities.bestCategory?.name }}
            </h4>

            <p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
              {{ bestEntities.bestCategory?.description }}
            </p>
          </div>

          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                >Total Sales</span
              >
              <div class="flex items-center gap-2">
                <span
                  class="text-base font-bold text-brand-600 md:text-lg dark:text-brand-400"
                >
                  ${{ bestEntities.bestCategory?.totalSales }}
                </span>
              </div>
            </div>

            <div class="mt-2 flex items-center justify-between">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                >Total Products</span
              >
              <span
                class="text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                {{ bestEntities.bestCategory?.productCount }}
              </span>
            </div>
          </div>
          <div class="mt-2 self-center">
            <Button
              tag="router-link"
              :to="{
                name: 'category-details',
                params: { id: bestEntities.bestCategory?._id },
              }"
              class="w-full sm:w-auto"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>

      <!-- Best User Card -->
      <div
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="mb-3 flex items-center justify-between">
          <h3
            class="text-base font-medium text-gray-900 md:text-lg dark:text-white"
          >
            Best Customer
          </h3>
          <div
            class="rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-800 md:text-sm"
          >
            ${{ formatNumber(bestEntities.bestUser?.totalSpent) }}
          </div>
        </div>

        <div class="flex flex-1 flex-col justify-between gap-3">
          <div
            class="flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:h-28 md:h-32 dark:bg-white/[0.03]"
          >
            <div
              class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100 md:h-20 md:w-20 dark:bg-white/[0.03]"
            >
              <img
                v-if="bestEntities.bestUser?.thumbnail"
                :src="bestEntities.bestUser.thumbnail"
                :alt="bestEntities.bestUser.name"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-gray-200 text-xl font-medium text-gray-500 md:text-2xl"
              >
                {{ bestEntities.bestUser?.name.charAt(0) }}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <h4
              class="text-lg font-semibold text-gray-900 md:text-xl dark:text-white"
            >
              {{ bestEntities.bestUser?.name }}
            </h4>

            <p class="text-sm break-words text-gray-600 dark:text-gray-300">
              {{ bestEntities.bestUser?.email }}
            </p>
          </div>

          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                >Total Spent</span
              >
              <span
                class="text-base font-bold text-brand-600 md:text-lg dark:text-brand-400"
              >
                ${{
                  bestEntities.bestUser?.totalSpent.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </span>
            </div>

            <div class="mt-2 flex items-center justify-between">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                >Gender</span
              >
              <span class="text-sm text-gray-800 dark:text-gray-200">
                {{
                  bestEntities.bestUser?.gender === 'N/A'
                    ? 'Not specified'
                    : bestEntities.bestUser?.gender
                }}
              </span>
            </div>
          </div>
          <div class="mt-2 self-center">
            <Button
              tag="router-link"
              :to="{
                name: 'customer-details',
                params: { userId: bestEntities.bestUser?._id },
              }"
              class="w-full sm:w-auto"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Button from '../common/Button.vue';

const router = useRouter();
const bestEntities = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchBestEntities = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/dashboard/featured',
    );
    bestEntities.value = response.data.data;
    console.log(bestEntities.value);
  } catch (err) {
    error.value = 'Failed to fetch best entities data.';
    console.error('Error fetching best entities data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBestEntities();
});

const formatNumber = (num) => {
  if (!num) return '0.00';

  if (num >= 1000) {
    const suffixes = ['k', 'M', 'B', 'T'];
    const magnitude = Math.floor(Math.log10(num));
    const suffixIndex = Math.floor(magnitude / 3);

    if (suffixIndex > 0 && suffixIndex <= suffixes.length) {
      const shortNum = (num / Math.pow(1000, suffixIndex)).toFixed(1);
      return `${shortNum}${suffixes[suffixIndex - 1]}`;
    }
  }

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>
