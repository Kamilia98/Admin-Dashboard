<script setup lang="ts">
import { useCategoryStore } from '../../stores/categoryStore';
import Button from '../common/Button.vue';
import Dropzone from '../common/Dropzone.vue';
import Modal from '../common/Modal.vue';
const store = useCategoryStore();
</script>
<template>
  <Modal v-if="store.isCategoryAddModalOpen" @close="store.closeAddModal">
    <template #body>
      <div class="flex flex-col gap-4">
        <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Add Category
        </h4>
        <form class="flex flex-col gap-4" @submit.prevent>
          <div class="flex custom-scrollbar flex-col gap-4 overflow-y-auto">
            <div>
              <label
                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Name
              </label>
              <input
                placeholder="Enter a name"
                type="text"
                v-model="store.formState.add.name"
                class="custom-input"
                required
              />
            </div>

            <div>
              <label
                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Description
              </label>
              <textarea
                placeholder="Enter a description..."
                v-model="store.formState.add.description"
                rows="3"
                class="custom-input custom-scrollbar h-auto"
              ></textarea>
            </div>

            <div>
              <label
                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Image
              </label>
              <Dropzone
                v-model="store.formState.add.image"
                uploadUrl="https://api.cloudinary.com/v1_1/dddhappm3/image/upload"
              />
            </div>
          </div>
          <div class="flex items-center gap-3 lg:justify-end">
            <Button @click="store.closeAddModal">Close</Button>
            <Button @click="store.saveAdd">Submit</Button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</template>
