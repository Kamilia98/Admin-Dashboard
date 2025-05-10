<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElUpload,
  ElSteps,
  ElStep,
} from 'element-plus';
import { useProductStore } from '../../stores/productStore';
import { useCategoryStore } from '../../stores/categoryStore';
import Button from '../common/Button.vue';
import PlusIcon from '../../icons/PlusIcon.vue';
import type { FormRules } from 'element-plus';

const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

const activeStep = ref(0);
const formRef = ref();
const isLoading = ref(false);
const selectedCategoryId = ref<string>(''); // New category selector

const formData = reactive<Product>({
  name: '',
  subtitle: '',
  description: '',
  price: 0,
  sale: 0,
  brand: '',
  colors: [
    {
      name: '',
      hex: '#000000',
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
  { title: 'Review' },
];

const rules: FormRules = {
  name: [
    { required: true, message: 'Product name is required', trigger: 'blur' },
  ],
  price: [{ required: true, message: 'Price is required', trigger: 'blur' }],
  brand: [{ required: true, message: 'Brand is required', trigger: 'blur' }],
  categories: [
    {
      type: 'array',
      required: true,
      message: 'Select at least one category',
      trigger: 'change',
    },
  ],
};

const handleImageUpload = (colorIndex: number, response: any) => {
  formData.colors?.[colorIndex]?.images?.push({
    public_id: response.public_id,
    url: response.secure_url,
    _id: Date.now().toString(),
  });
};

const addColor = () => {
  formData.colors?.push({
    name: '',
    hex: '#000000',
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
    await formRef.value.validateField(currentFields);
    activeStep.value++;
  } catch (error) {
    console.error('Validation failed:', error);
  }
};

const submitForm = async () => {
  isLoading.value = true;
  try {
    // Add selected category ID into categories array before submit
    formData.categories = selectedCategoryId.value
      ? [selectedCategoryId.value]
      : [];

    await productStore.addProduct(formData as Product);
    router.push({ name: 'products' });
  } catch (error) {
    console.error('Submission error:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  categoryStore.getCategories();
});
</script>

<template>
  <div class="mx-auto max-w-4xl p-6">
    <h1 class="mb-6 text-2xl font-bold">Add New Product</h1>

    <el-steps :active="activeStep" align-center class="mb-8">
      <el-step
        v-for="(step, index) in steps"
        :key="index"
        :title="step.title"
      />
    </el-steps>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="space-y-8"
      @submit.prevent
    >
      <!-- Step 1 -->
      <div v-show="activeStep === 0">
        <el-form-item label="Product Name" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="Subtitle" prop="subtitle">
          <el-input v-model="formData.subtitle" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="4" />
        </el-form-item>
      </div>

      <!-- Step 2 -->
      <div v-show="activeStep === 1">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Price" prop="price">
            <el-input-number v-model="formData.price" :precision="2" />
          </el-form-item>
          <el-form-item label="Sale (%)" prop="sale">
            <el-input-number v-model="formData.sale" :min="0" :max="100" />
          </el-form-item>
        </div>
        <el-form-item label="Brand" prop="brand">
          <el-input v-model="formData.brand" />
        </el-form-item>
      </div>

      <!-- Step 3 -->
      <div v-show="activeStep === 2">
        <el-form-item label="Category">
          <el-select
            v-model="selectedCategoryId"
            placeholder="Select a category"
            filterable
            class="w-full"
          >
            <el-option
              v-for="cat in categoryStore.categories"
              :key="cat._id"
              :label="cat.name"
              :value="cat._id"
            />
          </el-select>
        </el-form-item>
      </div>

      <!-- Step 4 -->
      <div v-show="activeStep === 3">
        <div
          v-for="(color, index) in formData.colors"
          :key="index"
          class="mb-6 rounded border p-4"
        >
          <el-form-item :label="`Color ${index + 1} Name`">
            <el-input v-model="color.name" />
          </el-form-item>
          <el-form-item label="SKU">
            <el-input v-model="color.sku" />
          </el-form-item>
          <el-form-item label="Quantity">
            <el-input-number v-model="color.quantity" :min="0" />
          </el-form-item>
          <el-form-item label="Images">
            <el-upload
              action="https://api.cloudinary.com/v1_1/dddhappm3/image/upload"
              :data="{ upload_preset: 'your_preset' }"
              :on-success="(res) => handleImageUpload(index, res)"
            >
              <Button>
                <template #icon>
                  <PlusIcon />
                </template>
                Upload Images
              </Button>
            </el-upload>
          </el-form-item>
        </div>
        <Button @click="addColor" variant="default">
          <template #icon>
            <PlusIcon />
          </template>
          Add Another Color
        </Button>
      </div>

      <!-- Step 5 -->
      <div v-show="activeStep === 4" class="space-y-6">
        <div class="rounded border p-4">
          <h3 class="mb-4 font-semibold">General Information</h3>
          <el-form-item label="Sales Package">
            <el-input
              v-model="formData.additionalInformation.general.salesPackage"
            />
          </el-form-item>
          <el-form-item label="Model Number">
            <el-input
              v-model="formData.additionalInformation.general.modelNumber"
            />
          </el-form-item>
        </div>
        <div class="rounded border p-4">
          <h3 class="mb-4 font-semibold">Dimensions</h3>
          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="Width (cm)">
              <el-input-number
                v-model="formData.additionalInformation.dimensions.width"
              />
            </el-form-item>
            <el-form-item label="Height (cm)">
              <el-input-number
                v-model="formData.additionalInformation.dimensions.height"
              />
            </el-form-item>
          </div>
        </div>
      </div>

      <!-- Step 6 -->
      <div v-show="activeStep === 5" class="space-y-4">
        <div class="rounded border p-4">
          <h3 class="mb-2 font-semibold">Product Summary</h3>
          <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-8 flex justify-between">
        <Button
          v-if="activeStep > 0"
          @click="activeStep--"
          variant="default"
          type="button"
        >
          Previous
        </Button>

        <div class="flex-1"></div>

        <Button
          v-if="activeStep < steps.length - 1"
          @click="validateStep"
          variant="default"
          type="button"
        >
          Next
        </Button>

        <Button
          v-if="activeStep === steps.length - 1"
          @click="submitForm"
          :loading="isLoading"
          variant="primary"
          type="submit"
        >
          Submit Product
        </Button>
      </div>
    </el-form>
  </div>
</template>
