<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElMessage,
} from 'element-plus';
import { useProductStore } from '../../stores/productStore';
import { useCategoryStore } from '../../stores/categoryStore';
import Button from '../common/Button.vue';
import PlusIcon from '../../icons/PlusIcon.vue';
import type { FormRules, FormInstance } from 'element-plus';
import Dropzone from '../common/Dropzone.vue';
import ResourceWrapper from '../common/ResourceWrapper.vue';

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

const productId = route.params.id as string;
const images = ref<{ public_id: string; url: string }[]>([]);
const activeStep = ref(0);
const formRef = ref<FormInstance>();
const isLoading = ref(false);
const isFetching = ref(true);

interface ProductForm {
  name: string;
  subtitle: string;
  description: string;
  price: number;
  sale: number;
  brand: string;
  colors: Array<{
    name: string;
    quantity: number;
    sku: string;
    images: Array<{
      public_id: string;
      url: string;
    }>;
  }>;
  categories: string[];
  additionalInformation: {
    general: {
      salesPackage: string;
      modelNumber: string;
      configuration: string;
      upholsteryMaterial: string;
      upholsteryColor: string;
    };
    productDetails: {
      fillingMaterial: string;
      finishType: string;
      adjustableHeadrest: boolean;
      maximumLoadCapacity: number;
      originOfManufacture: string;
    };
    dimensions: {
      width: number;
      height: number;
      depth: number;
      seatHeight: number;
      legHeight: number;
    };
    warranty: {
      summary: string;
      serviceType: string;
      covered: string;
      notCovered: string;
      domesticWarranty: string;
    };
  };
}

const formData = reactive<ProductForm>({
  name: '',
  subtitle: '',
  description: '',
  price: 0,
  sale: 0,
  brand: '',
  colors: [
    {
      name: '',
      quantity: 0,
      sku: '',
      images: [],
    },
  ],
  categories: [],
  additionalInformation: {
    general: {
      salesPackage: '',
      modelNumber: '',
      configuration: '',
      upholsteryMaterial: '',
      upholsteryColor: '',
    },
    productDetails: {
      fillingMaterial: '',
      finishType: '',
      adjustableHeadrest: false,
      maximumLoadCapacity: 0,
      originOfManufacture: '',
    },
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
      seatHeight: 0,
      legHeight: 0,
    },
    warranty: {
      summary: '',
      serviceType: '',
      covered: '',
      notCovered: '',
      domesticWarranty: '',
    },
  },
});

const steps = [
  { title: 'Basic Info', fields: ['name', 'subtitle', 'description'] },
  { title: 'Pricing & Brand', fields: ['price', 'sale', 'brand'] },
  { title: 'Categories', fields: ['categories'] },
  { title: 'Colors & Images', fields: [] },
  { title: 'Additional Info', fields: [] },
];

const rules: FormRules = {
  name: [
    { required: true, message: 'Product name is required', trigger: 'blur' },
  ],
  price: [
    {
      required: true,
      message: 'Price is required',
      trigger: 'blur',
      type: 'number',
      min: 0.01,
    },
  ],
  brand: [{ required: true, message: 'Brand is required', trigger: 'blur' }],
  categories: [
    {
      type: 'array',
      required: true,
      message: 'At least one category must be selected',
      trigger: 'change',
    },
  ],
};

const handleHaleam = (data: any, colorIndex: number) => {
  formData.colors[colorIndex].images.push({
    public_id: data.public_id,
    url: data.secure_url,
  });
};

const handleImageRemove = (colorIndex: number, imageIndex?: number) => {
  if (typeof imageIndex === 'number') {
    formData.colors[colorIndex].images.splice(imageIndex, 1);
  } else {
    formData.colors[colorIndex].images = [];
  }
};

const addColor = () => {
  formData.colors.push({
    name: '',
    quantity: 0,
    sku: '',
    images: [],
  });
};

const validateStep = async () => {
  const currentFields = steps[activeStep.value]?.fields || [];

  if (currentFields.length === 0) {
    activeStep.value++;
    return;
  }

  try {
    await formRef.value?.validate((valid, fields) => {
      if (!valid && fields) {
        const firstError = Object.keys(fields)[0];
        const errorElement = document.querySelector(
          `[data-field="${firstError}"]`,
        );
        errorElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        throw new Error('Validation failed');
      }
    });
    activeStep.value++;
  } catch (error) {
    console.error('Validation error:', error);
  }
};

const fetchProductData = async () => {
  try {
    isFetching.value = true;
    const product = await productStore.getProductById(productId);
    if (product) {
      // Map product data to form data
      formData.name = product.name || '';
      formData.subtitle = product.subtitle || '';
      formData.description = product.description || '';
      formData.price = product.price || 0;
      formData.sale = product.sale || 0;
      formData.brand = product.brand || '';
      formData.categories =
        product.categories?.map((cat: any) => cat._id || cat) || [];

      // Handle colors with images
      if (product.colors?.length) {
        formData.colors = product.colors.map((color: any) => ({
          name: color.name || '',
          hex: color.hex,
          quantity: color.quantity || 0,
          sku: color.sku || '',
          images: color.images || [],
        }));
      }

      // Handle additional information
      if (product.additionalInformation) {
        // Map general info
        if (product.additionalInformation.general) {
          formData.additionalInformation.general = {
            salesPackage:
              product.additionalInformation.general.salesPackage || '',
            modelNumber:
              product.additionalInformation.general.modelNumber || '',
            configuration:
              product.additionalInformation.general.configuration || '',
            upholsteryMaterial:
              product.additionalInformation.general.upholsteryMaterial || '',
            upholsteryColor:
              product.additionalInformation.general.upholsteryColor || '',
          };
        }

        // Map product details
        if (product.additionalInformation.productDetails) {
          formData.additionalInformation.productDetails = {
            fillingMaterial:
              product.additionalInformation.productDetails.fillingMaterial ||
              '',
            finishType:
              product.additionalInformation.productDetails.finishType || '',
            adjustableHeadrest:
              product.additionalInformation.productDetails.adjustableHeadrest ||
              false,
            maximumLoadCapacity:
              product.additionalInformation.productDetails
                .maximumLoadCapacity || 0,
            originOfManufacture:
              product.additionalInformation.productDetails
                .originOfManufacture || '',
          };
        }

        // Map dimensions
        if (product.additionalInformation.dimensions) {
          formData.additionalInformation.dimensions = {
            width: product.additionalInformation.dimensions.width || 0,
            height: product.additionalInformation.dimensions.height || 0,
            depth: product.additionalInformation.dimensions.depth || 0,
            seatHeight:
              product.additionalInformation.dimensions.seatHeight || 0,
            legHeight: product.additionalInformation.dimensions.legHeight || 0,
          };
        }

        // Map warranty
        if (product.additionalInformation.warranty) {
          formData.additionalInformation.warranty = {
            summary: product.additionalInformation.warranty.summary || '',
            serviceType:
              product.additionalInformation.warranty.serviceType || '',
            covered: product.additionalInformation.warranty.covered || '',
            notCovered: product.additionalInformation.warranty.notCovered || '',
            domesticWarranty:
              product.additionalInformation.warranty.domesticWarranty || '',
          };
        }
      }
    }
  } catch (error) {
    console.error('Error fetching product data:', error);
    ElMessage.error('Failed to load product data');
  } finally {
    isFetching.value = false;
  }
};

const submitForm = async () => {
  try {
    // Validate entire form
    console.log('Update payload:', JSON.parse(JSON.stringify(formData)));
    const isValid = await formRef.value?.validate();
    if (!isValid) {
      ElMessage.error('Please fix all form errors before submitting');
      return;
    }

    isLoading.value = true;
    try {
      const response = await productStore.updateProduct(productId, formData);
      console.log('[Debug ----update product]', response);
      router.push({ name: 'products' });
    } catch (error) {
      ElMessage.error('Failed to update product. Please check your inputs.');
      console.error('Submission error:', error);
    } finally {
      isLoading.value = false;
    }
  } catch (validationError) {
    console.error('Form validation error:', validationError);
  }
};

onMounted(() => {
  categoryStore.getCategories(1, 10);
  fetchProductData();
});

// Show loading while fetching product data
// const isReady = computed(() => !isFetching.value);
</script>

<template>
  <ResourceWrapper :loading="isFetching">
    <div
      class="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow-lg dark:bg-white/[0.03]"
    >
      <!-- Header with progress indicator -->
      <div class="mb-10 text-center">
        <h1 class="mb-2 text-3xl font-bold text-gray-800">Update Product</h1>
        <p class="mb-6 text-gray-500">
          Edit your product information to update your catalog
        </p>

        <!-- Custom Step Progress Bar -->
        <div class="relative">
          <div class="mb-2 flex items-center justify-evenly">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="relative z-10 flex flex-col items-center"
            >
              <div
                :class="[
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-300',
                  index < activeStep
                    ? 'bg-green-500 text-white'
                    : index === activeStep
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-600',
                ]"
              >
                <span v-if="index < activeStep">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div
                class="mt-2 text-xs font-medium"
                :class="{
                  'text-green-600': index < activeStep,
                  'text-blue-600': index === activeStep,
                  'text-gray-500': index > activeStep,
                }"
              >
                {{ step.title }}
              </div>
            </div>
          </div>

          <!-- Connection line -->
          <div
            class="absolute top-5 left-0 -z-10 h-1 w-full -translate-y-1/2 transform bg-gray-200"
          ></div>
          <div
            class="absolute top-5 left-0 -z-10 h-1 -translate-y-1/2 transform bg-blue-500 transition-all duration-500"
            :style="`width: ${(activeStep / (steps.length - 1)) * 100}%`"
          ></div>
        </div>
      </div>

      <!-- Form Content -->
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        class="space-y-8"
        @submit.prevent
        hide-required-asterisk
        :validate-on-rule-change="false"
      >
        <!-- Step 1 - Basic Info -->
        <div v-if="activeStep === 0" class="animate-fadeIn">
          <div class="mb-6 rounded-lg bg-blue-50 p-1">
            <h2 class="px-3 py-2 text-xl font-semibold text-blue-700">
              Basic Information
            </h2>
          </div>

          <div
            class="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <el-form-item label="Product Name" prop="name" data-field="name">
              <el-input
                v-model="formData.name"
                placeholder="Enter product name"
                class="hover:border-blue-500 focus:border-blue-500"
              />
            </el-form-item>

            <el-form-item
              label="Subtitle"
              prop="subtitle"
              data-field="subtitle"
            >
              <el-input
                v-model="formData.subtitle"
                placeholder="Add a brief subtitle"
                class="hover:border-blue-500 focus:border-blue-500"
              />
            </el-form-item>

            <el-form-item
              label="Description"
              prop="description"
              data-field="description"
            >
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="5"
                placeholder="Describe your product in detail"
                class="hover:border-blue-500 focus:border-blue-500"
              />
            </el-form-item>
          </div>
        </div>

        <!-- Step 2 - Pricing & Brand -->
        <div v-if="activeStep === 1" class="animate-fadeIn">
          <div class="mb-6 rounded-lg bg-blue-50 p-1">
            <h2 class="px-3 py-2 text-xl font-semibold text-blue-700">
              Pricing & Brand
            </h2>
          </div>

          <div
            class="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div class="grid gap-6 md:grid-cols-2">
              <el-form-item
                label="Price ($)"
                prop="price"
                data-field="price"
                class="mb-0"
              >
                <div class="relative">
                  <span
                    class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500"
                    >$</span
                  >
                  <el-input-number
                    v-model="formData.price"
                    :precision="2"
                    :min="0.01"
                    controls-position="right"
                    class="w-full pl-6 hover:border-blue-500 focus:border-blue-500"
                  />
                </div>
              </el-form-item>

              <el-form-item label="Sale (%)" class="mb-0">
                <div class="relative">
                  <el-input-number
                    v-model="formData.sale"
                    :min="0"
                    :max="100"
                    controls-position="right"
                    class="w-full hover:border-blue-500 focus:border-blue-500"
                  />
                  <span
                    class="absolute top-1/2 right-12 -translate-y-1/2 transform text-gray-500"
                    >%</span
                  >
                </div>
              </el-form-item>
            </div>

            <el-form-item label="Brand" prop="brand" data-field="brand">
              <el-input
                v-model="formData.brand"
                placeholder="Enter brand name"
                class="hover:border-blue-500 focus:border-blue-500"
              />
            </el-form-item>
          </div>
        </div>

        <!-- Step 3 - Categories -->
        <div v-if="activeStep === 2" class="animate-fadeIn">
          <div class="mb-6 rounded-lg bg-blue-50 p-1">
            <h2 class="px-3 py-2 text-xl font-semibold text-blue-700">
              Product Categories
            </h2>
          </div>

          <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <el-form-item
              label="Category"
              prop="categories"
              data-field="categories"
            >
              <el-select
                v-model="formData.categories"
                placeholder="Select categories (multiple allowed)"
                filterable
                class="w-full hover:border-blue-500 focus:border-blue-500"
                :loading="categoryStore.loading"
                multiple
              >
                <el-option
                  v-for="cat in categoryStore.categories"
                  :key="cat._id"
                  :label="cat.name"
                  :value="cat._id"
                />
              </el-select>
            </el-form-item>

            <div class="mt-4 text-sm text-gray-500">
              <p>
                Tip: Assigning relevant categories helps customers find your
                product more easily
              </p>
            </div>
          </div>
        </div>

        <!-- Step 4 - Colors & Images -->
        <div v-if="activeStep === 3" class="animate-fadeIn">
          <div class="mb-6 rounded-lg bg-blue-50 p-1">
            <h2 class="px-3 py-2 text-xl font-semibold text-blue-700">
              Colors & Images
            </h2>
          </div>

          <div class="space-y-6">
            <div
              v-for="(color, index) in formData.colors"
              :key="index"
              class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-700">
                  Color Option {{ index + 1 }}
                </h3>
                <button
                  v-if="index > 0"
                  @click="formData.colors.splice(index, 1)"
                  class="text-red-500 transition-colors hover:text-red-700"
                  type="button"
                >
                  Remove
                </button>
              </div>

              <div class="grid gap-6 md:grid-cols-3">
                <el-form-item
                  :label="`Color Name`"
                  :prop="`colors.${index}.name`"
                  :rules="{
                    required: true,
                    message: 'Color name is required',
                    trigger: 'blur',
                  }"
                  data-field="colors"
                >
                  <el-input
                    v-model="color.name"
                    placeholder="e.g., Navy Blue"
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>

                <el-form-item
                  label="SKU"
                  :prop="`colors.${index}.sku`"
                  :rules="{
                    required: true,
                    message: 'SKU is required',
                    trigger: 'blur',
                  }"
                  data-field="colors"
                >
                  <el-input
                    v-model="color.sku"
                    placeholder="e.g., PROD-BLU-01"
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>

                <el-form-item
                  label="Quantity"
                  :prop="`colors.${index}.quantity`"
                  :rules="{
                    type: 'number',
                    min: 0,
                    message: 'Quantity must be at least 0',
                    trigger: 'blur',
                  }"
                  data-field="colors"
                >
                  <el-input-number
                    v-model="color.quantity"
                    :min="0"
                    class="w-full hover:border-blue-500 focus:border-blue-500"
                    controls-position="right"
                  />
                </el-form-item>
              </div>

              <el-form-item
                label="Images"
                :prop="`colors.${index}.images`"
                :rules="{
                  validator: (_, v, cb) =>
                    v.length
                      ? cb()
                      : cb(new Error('At least one image required')),
                }"
                data-field="colors"
                class="mt-4"
              >
                <!-- Display existing images -->
                <div
                  v-if="color.images.length"
                  class="mb-4 grid w-full grid-cols-2 gap-4 md:grid-cols-5"
                >
                  <div
                    v-for="(img, imgIndex) in color.images"
                    :key="img.public_id"
                    class="relative h-42 rounded-lg border border-gray-200 bg-gray-50 p-1"
                  >
                    <img
                      :src="img.url"
                      :alt="`Product color ${color.name} image ${imgIndex + 1}`"
                      class="h-full w-full rounded object-cover"
                    />
                    <button
                      @click="handleImageRemove(index, imgIndex)"
                      class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-md"
                      type="button"
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <div class="w-full">
                  <Dropzone
                    @haleem="(data) => handleHaleam(data, index)"
                    @removed-file="() => handleImageRemove(index)"
                    class="rounded-lg border-2 border-dashed border-blue-300 p-8 text-center transition-colors hover:border-blue-500"
                  />
                </div>
              </el-form-item>
            </div>

            <button
              @click="addColor"
              class="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-blue-300 py-3 font-medium text-blue-600 transition-colors hover:border-blue-500 hover:text-blue-700"
              type="button"
            >
              <PlusIcon class="mr-2 h-5 w-5" />
              Add Another Color
            </button>
          </div>
        </div>
        <!-- Step 5 - Additional Info -->
        <div v-if="activeStep === 4" class="animate-fadeIn">
          <div class="mb-6 rounded-lg bg-blue-50 p-1">
            <h2 class="px-3 py-2 text-xl font-semibold text-blue-700">
              Additional Information
            </h2>
          </div>

          <div class="space-y-6">
            <!-- General Information -->
            <div
              class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 class="mb-4 flex items-center font-semibold text-gray-700">
                <span
                  class="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                  >1</span
                >
                General Information
              </h3>

              <div class="space-y-4">
                <el-form-item label="Sales Package">
                  <el-input
                    v-model="
                      formData.additionalInformation.general.salesPackage
                    "
                    placeholder="e.g., Box with assembly instructions"
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>

                <el-form-item label="Model Number">
                  <el-input
                    v-model="formData.additionalInformation.general.modelNumber"
                    placeholder="e.g., FN-2187"
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>

                <el-form-item label="Upholstery Material">
                  <el-input
                    v-model="
                      formData.additionalInformation.general.upholsteryMaterial
                    "
                    placeholder="e.g., 100% Cotton, Leather, etc."
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>
              </div>
            </div>

            <!-- Product Details -->
            <div
              class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 class="mb-4 flex items-center font-semibold text-gray-700">
                <span
                  class="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                  >2</span
                >
                Product Details
              </h3>

              <div class="space-y-4">
                <el-form-item label="Filling Material">
                  <el-input
                    v-model="
                      formData.additionalInformation.productDetails
                        .fillingMaterial
                    "
                    placeholder="e.g., Foam, Polyester Fiber"
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>

                <el-form-item label="Finish Type">
                  <el-input
                    v-model="
                      formData.additionalInformation.productDetails.finishType
                    "
                    placeholder="e.g., Matte, Glossy, Semi-Gloss"
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>

                <el-form-item label="Origin of Manufacture">
                  <el-input
                    v-model="
                      formData.additionalInformation.productDetails
                        .originOfManufacture
                    "
                    placeholder="e.g., Italy, China, USA"
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>
              </div>
            </div>

            <!-- Dimensions -->
            <div
              class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 class="mb-4 flex items-center font-semibold text-gray-700">
                <span
                  class="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                  >3</span
                >
                Dimensions (cm)
              </h3>

              <div class="grid gap-6 md:grid-cols-2">
                <el-form-item label="Width">
                  <div class="relative">
                    <el-input-number
                      v-model="formData.additionalInformation.dimensions.width"
                      class="w-full hover:border-blue-500 focus:border-blue-500"
                      controls-position="right"
                    />
                    <span
                      class="absolute top-1/2 right-12 -translate-y-1/2 transform text-gray-500"
                      >cm</span
                    >
                  </div>
                </el-form-item>

                <el-form-item label="Height">
                  <div class="relative">
                    <el-input-number
                      v-model="formData.additionalInformation.dimensions.height"
                      class="w-full hover:border-blue-500 focus:border-blue-500"
                      controls-position="right"
                    />
                    <span
                      class="absolute top-1/2 right-12 -translate-y-1/2 transform text-gray-500"
                      >cm</span
                    >
                  </div>
                </el-form-item>

                <el-form-item label="Depth">
                  <div class="relative">
                    <el-input-number
                      v-model="formData.additionalInformation.dimensions.depth"
                      class="w-full hover:border-blue-500 focus:border-blue-500"
                      controls-position="right"
                    />
                    <span
                      class="absolute top-1/2 right-12 -translate-y-1/2 transform text-gray-500"
                      >cm</span
                    >
                  </div>
                </el-form-item>

                <el-form-item label="Seat Height">
                  <div class="relative">
                    <el-input-number
                      v-model="
                        formData.additionalInformation.dimensions.seatHeight
                      "
                      class="w-full hover:border-blue-500 focus:border-blue-500"
                      controls-position="right"
                    />
                    <span
                      class="absolute top-1/2 right-12 -translate-y-1/2 transform text-gray-500"
                      >cm</span
                    >
                  </div>
                </el-form-item>
              </div>
            </div>

            <!-- Warranty Information -->
            <div
              class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 class="mb-4 flex items-center font-semibold text-gray-700">
                <span
                  class="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                  >4</span
                >
                Warranty Information
              </h3>

              <div class="space-y-4">
                <el-form-item label="Warranty Summary">
                  <el-input
                    v-model="formData.additionalInformation.warranty.summary"
                    placeholder="e.g., 2 years limited warranty"
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>

                <el-form-item label="Service Type">
                  <el-input
                    v-model="
                      formData.additionalInformation.warranty.serviceType
                    "
                    placeholder="e.g., On-site, Carry-in"
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>

                <div class="grid gap-6 md:grid-cols-2">
                  <el-form-item label="Covered Items">
                    <el-input
                      v-model="formData.additionalInformation.warranty.covered"
                      placeholder="e.g., Manufacturing defects"
                      class="hover:border-blue-500 focus:border-blue-500"
                    />
                  </el-form-item>

                  <el-form-item label="Exclusions">
                    <el-input
                      v-model="
                        formData.additionalInformation.warranty.notCovered
                      "
                      placeholder="e.g., Physical damage"
                      class="hover:border-blue-500 focus:border-blue-500"
                    />
                  </el-form-item>
                </div>

                <el-form-item label="Domestic Warranty">
                  <el-input
                    v-model="
                      formData.additionalInformation.warranty.domesticWarranty
                    "
                    placeholder="e.g., Yes, valid in country of purchase"
                    class="hover:border-blue-500 focus:border-blue-500"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div
          class="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <button
            v-if="activeStep > 0"
            @click="activeStep--"
            class="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <div class="text-sm text-gray-500">
            Step {{ activeStep + 1 }} of {{ steps.length }}
          </div>

          <button
            v-if="activeStep < steps.length - 1"
            @click="validateStep"
            class="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
            type="button"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
            v-if="activeStep === steps.length - 1"
            @click="submitForm"
            :class="{ 'cursor-not-allowed opacity-75': isLoading }"
            class="flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 sm:w-auto"
            :disabled="isLoading"
            type="button"
          >
            <span v-if="isLoading" class="mr-2">
              <svg
                class="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            Save changes
          </button>
        </div>
      </el-form>
    </div>
  </ResourceWrapper>
</template>

<style scoped>
.el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input-number .el-input__inner,
.el-form-item.is-error .el-textarea__inner {
  border-color: var(--el-color-danger) !important;
}

.el-form-item__error {
  color: var(--el-color-danger);
  font-size: 12px;
  padding-top: 4px;
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
}

.el-form-item__label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.animate-fadeIn {
  animation: fadeInAnimation 0.4s ease forwards;
}

@keyframes fadeInAnimation {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom styles for Element Plus components */
.el-input__wrapper,
.el-textarea__wrapper {
  box-shadow: none !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 0.5rem !important;
  padding: 0.5rem 0.75rem !important;
  transition: all 0.3s ease;
}

.el-input__wrapper:hover,
.el-textarea__wrapper:hover {
  border-color: #3b82f6 !important;
}

.el-input__wrapper:focus-within,
.el-textarea__wrapper:focus-within {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}

.el-input-number.is-controls-right .el-input__wrapper {
  padding-right: 2.5rem !important;
}

/* Focus and hover states for input fields */
.hover\:border-blue-500:hover,
.focus\:border-blue-500:focus {
  border-color: #3b82f6 !important;
}

/* Dropdown select styling */
.el-select .el-input.is-focus .el-input__wrapper {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
  border-color: #3b82f6 !important;
}

.el-select-dropdown__item.selected {
  color: #3b82f6 !important;
  font-weight: 600;
}

.el-select .el-select__tags .el-tag {
  background-color: #eff6ff !important;
  border-color: #bfdbfe !important;
  color: #3b82f6 !important;
  margin: 2px;
}
</style>
