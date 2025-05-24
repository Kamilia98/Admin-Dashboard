<template>
  <div class="file-uploader">
    <form
      ref="dropzoneForm"
      :id="dropzoneId"
      class="dropzone flex justify-center rounded-xl border-dashed border-gray-300 bg-gray-50 p-7 hover:border-brand-500 lg:p-10 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500"
    >
      <!-- Dropzone Message when no uploaded image -->
      <div v-if="!uploadedImage || !modelValue" class="dz-message m-0!">
        <div class="mb-[22px] flex justify-center">
          <div
            class="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >
            <!-- Upload icon -->
            <svg
              class="fill-current"
              width="29"
              height="28"
              viewBox="0 0 29 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
              />
            </svg>
          </div>
        </div>

        <h4
          class="mb-3 text-theme-xl font-semibold text-gray-800 dark:text-white/90"
        >
          Drag & Drop File Here
        </h4>
        <span
          class="mx-auto mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400"
        >
          Drag and drop your PNG, JPG, WebP, SVG images here or browse
        </span>
        <span
          class="cursor-pointer text-theme-sm font-medium text-brand-500 underline"
        >
          Browse File
        </span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';

// v-model support
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue', 'haleem']);

const dropzoneForm = ref(null);
const dropzoneId = `dropzone-${Math.random().toString(36).substr(2, 9)}`;
const uploadedImage = ref(props.modelValue);
let dropzoneInstance: Dropzone | null = null;

onMounted(() => {
  Dropzone.autoDiscover = false;

  dropzoneInstance = new Dropzone(`#${dropzoneId}`, {
    url: '/',
    autoProcessQueue: false,
    addRemoveLinks: true,
    thumbnailWidth: 150,
    maxFilesize: 2,
    acceptedFiles: 'image/*',
    dictDefaultMessage: '',
    init: function () {
      this.on('addedfile', async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');
        formData.append('folder', 'profileIMGs');

        try {
          const res = await fetch(
            'https://api.cloudinary.com/v1_1/dddhappm3/image/upload',
            {
              method: 'POST',
              body: formData,
            },
          );

          const data = await res.json();
          console.log('[DropZone---data]', data);
          uploadedImage.value = data.secure_url;

          emit('update:modelValue', data.secure_url || props.modelValue);
          emit('haleem', data);
          this.emit('success', file, data);
          this.emit('complete', file);
        } catch (err) {
          console.error('Cloudinary Upload Failed:', err);
          this.emit('error', file, err);
        }
      });

      if (props.modelValue) {
        const mockFile = {
          name: 'existing-image.jpg',
          size: 12345,
          accepted: true,
        };
        this.emit('addedfile', mockFile);
        this.emit('thumbnail', mockFile, props.modelValue);
        this.emit('complete', mockFile);
      }
    },
  });
});

onBeforeUnmount(() => {
  if (dropzoneInstance) {
    dropzoneInstance.destroy();
  }
});

// Watch for external model changes
watch(
  () => props.modelValue,
  (newVal) => {
    uploadedImage.value = newVal;
  },
);
</script>

<style>
.dropzone {
  border: 1px dashed #d0d5dd;
  transition: all 0.3s ease;
}

.dropzone:hover {
  border-color: #465fff;
}

.dropzone .dz-preview {
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
}

.dropzone .dz-preview .dz-image {
  border-radius: 0;
  display: flex;
}
.dropzone .dz-preview .dz-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropzone .dz-preview .dz-details {
  padding: 1em;
}

.dropzone .dz-preview .dz-progress {
  height: 10px;
}

.dropzone .dz-preview .dz-progress .dz-upload {
  background: #4f46e5;
}

.dark .dropzone {
  background-color: #111827;
  border-color: #374151;
}

.dark .dropzone:hover {
  border-color: #6366f1;
}
</style>
