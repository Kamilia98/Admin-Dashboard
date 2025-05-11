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
  ElSteps,
  ElStep,
  ElMessage,
} from 'element-plus';
import { useProductStore } from '../../stores/productStore';
import { useCategoryStore } from '../../stores/categoryStore';
import Button from '../common/Button.vue';
import PlusIcon from '../../icons/PlusIcon.vue';
import type { FormRules, FormInstance } from 'element-plus';
import Dropzone from '../common/Dropzone.vue';

const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

const images = ref<{ public_id: string; url: string }[]>([]);
const activeStep = ref(0);
const formRef = ref<FormInstance>();
const isLoading = ref(false);

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
  { title: 'Review' },
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

const handleHaleam = (data) => {
  console.log('Halemmmmmmmmmmmmmmmmm', data);
  formData.colors[0].images = [
    {
      public_id: data.public_id,
      url: data.secure_url,
    },
  ];
};
const handleImageRemove = (colorIndex: number) => {
  formData.colors[colorIndex].images = [];
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

const submitForm = async () => {
  try {
    // Validate entire form
    console.log('Submission payload:', JSON.parse(JSON.stringify(formData)));
    const isValid = await formRef.value?.validate();
    if (!isValid) {
      ElMessage.error('Please fix all form errors before submitting');
      return;
    }

    isLoading.value = true;
    try {
      const response = await productStore.addProduct(formData);
      console.log('[Debug ----add product ]', response);
      ElMessage.success('Product created successfully!');
      router.push({ name: 'products' });
    } catch (error) {
      ElMessage.error('Failed to create product. Please check your inputs.');
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
      hide-required-asterisk
      :validate-on-rule-change="false"
    >
      <!-- Step 1 - Basic Info -->
      <div v-if="activeStep === 0">
        <el-form-item label="Product Name" prop="name" data-field="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="Subtitle" prop="subtitle" data-field="subtitle">
          <el-input v-model="formData.subtitle" />
        </el-form-item>
        <el-form-item
          label="Description"
          prop="description"
          data-field="description"
        >
          <el-input v-model="formData.description" type="textarea" :rows="4" />
        </el-form-item>
      </div>

      <!-- Step 2 - Pricing & Brand -->
      <div v-if="activeStep === 1">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Price ($)" prop="price" data-field="price">
            <el-input-number
              v-model="formData.price"
              :precision="2"
              :min="0.01"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="Sale (%)">
            <el-input-number
              v-model="formData.sale"
              :min="0"
              :max="100"
              controls-position="right"
            />
          </el-form-item>
        </div>
        <el-form-item label="Brand" prop="brand" data-field="brand">
          <el-input v-model="formData.brand" />
        </el-form-item>
      </div>

      <!-- Step 3 - Categories -->
      <div v-if="activeStep === 2">
        <el-form-item
          label="Category"
          prop="categories"
          data-field="categories"
        >
          <el-select
            v-model="formData.categories"
            placeholder="Select a category"
            filterable
            class="w-full"
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
      </div>

      <!-- Step 4 - Colors & Images -->
      <div v-if="activeStep === 3">
        <div
          v-for="(color, index) in formData.colors"
          :key="index"
          class="mb-6 rounded border p-4"
        >
          <el-form-item
            :label="`Color ${index + 1} Name`"
            :prop="`colors.${index}.name`"
            :rules="{
              required: true,
              message: 'Color name is required',
              trigger: 'blur',
            }"
            data-field="colors"
          >
            <el-input v-model="color.name" />
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
            <el-input v-model="color.sku" />
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
            <el-input-number v-model="color.quantity" :min="0" />
          </el-form-item>
          <el-form-item
            label="Images"
            :prop="`colors.${index}.images`"
            :rules="{
              validator: (_, v, cb) =>
                v.length ? cb() : cb(new Error('At least one image required')),
            }"
            data-field="colors"
          >
            <Dropzone
              @haleem="(data) => handleHaleam(data)"
              @removed-file="() => handleImageRemove(index)"
            />
          </el-form-item>
        </div>
        <Button @click="addColor" variant="default">
          <template #icon>
            <PlusIcon />
          </template>
          Add Another Color
        </Button>
      </div>

      <!-- Step 5 - Additional Info -->
      <div v-if="activeStep === 4" class="space-y-6">
        <!-- General Information -->
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
          <el-form-item label="Upholstery Material">
            <el-input
              v-model="
                formData.additionalInformation.general.upholsteryMaterial
              "
            />
          </el-form-item>
        </div>

        <!-- Product Details -->
        <div class="rounded border p-4">
          <h3 class="mb-4 font-semibold">Product Details</h3>
          <el-form-item label="Filling Material">
            <el-input
              v-model="
                formData.additionalInformation.productDetails.fillingMaterial
              "
            />
          </el-form-item>
          <el-form-item label="Finish Type">
            <el-input
              v-model="formData.additionalInformation.productDetails.finishType"
            />
          </el-form-item>
          <el-form-item label="Origin of Manufacture">
            <el-input
              v-model="
                formData.additionalInformation.productDetails
                  .originOfManufacture
              "
            />
          </el-form-item>
        </div>

        <!-- Dimensions -->
        <div class="rounded border p-4">
          <h3 class="mb-4 font-semibold">Dimensions (cm)</h3>
          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="Width">
              <el-input-number
                v-model="formData.additionalInformation.dimensions.width"
              />
            </el-form-item>
            <el-form-item label="Height">
              <el-input-number
                v-model="formData.additionalInformation.dimensions.height"
              />
            </el-form-item>
            <el-form-item label="Depth">
              <el-input-number
                v-model="formData.additionalInformation.dimensions.depth"
              />
            </el-form-item>
            <el-form-item label="Seat Height">
              <el-input-number
                v-model="formData.additionalInformation.dimensions.seatHeight"
              />
            </el-form-item>
          </div>
        </div>

        <!-- Warranty Information -->
        <div class="rounded border p-4">
          <h3 class="mb-4 font-semibold">Warranty Information</h3>
          <el-form-item label="Warranty Summary">
            <el-input
              v-model="formData.additionalInformation.warranty.summary"
            />
          </el-form-item>
          <el-form-item label="Service Type">
            <el-input
              v-model="formData.additionalInformation.warranty.serviceType"
            />
          </el-form-item>
          <el-form-item label="Covered Items">
            <el-input
              v-model="formData.additionalInformation.warranty.covered"
            />
          </el-form-item>
          <el-form-item label="Exclusions">
            <el-input
              v-model="formData.additionalInformation.warranty.notCovered"
            />
          </el-form-item>
          <el-form-item label="Domestic Warranty">
            <el-input
              v-model="formData.additionalInformation.warranty.domesticWarranty"
            />
          </el-form-item>
        </div>
      </div>

      <!-- Step 6 - Review -->
      <div v-if="activeStep === 5" class="space-y-4">
        <div class="rounded border p-4">
          <h3 class="mb-2 font-semibold">Product Summary</h3>
          <pre class="whitespace-pre-wrap">{{
            JSON.stringify(formData, null, 2)
          }}</pre>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="mt-8 flex justify-between">
        <Button v-if="activeStep > 0" @click="activeStep--" variant="default">
          Previous
        </Button>

        <div class="flex-1"></div>

        <Button
          v-if="activeStep < steps.length - 1"
          @click="validateStep"
          variant="default"
        >
          Next
        </Button>

        <Button
          v-if="activeStep === steps.length - 1"
          @click="submitForm"
          :loading="isLoading"
          variant="primary"
        >
          Submit Product
        </Button>
      </div>
    </el-form>
  </div>
</template>

<style>
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

.el-step.is-process .el-step__title {
  font-weight: 600;
}
</style>
