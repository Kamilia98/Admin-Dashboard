<script setup lang="ts">
import Modal from '../common/Modal.vue';

import { useCategoryStore } from '../../stores/categoryStore';
import Button from '../common/Button.vue';
import Dropzone from '../common/Dropzone.vue';
const store = useCategoryStore();
</script>

<template>
  <Modal v-if="store.isCategoryEditModalOpen" @close="store.closeEditModal">
    <template #body>
      <div class="flex flex-col gap-4">
        <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Edit Category
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
                v-model="store.formState.edit.name"
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
                v-model="store.formState.edit.description"
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
                v-model="store.formState.edit.image"
                :initialImage="store.formState.edit.image"
              />
            </div>
          </div>
          <div class="flex items-center gap-3 lg:justify-end">
            <Button @click="store.closeEditModal">Close</Button>
            <Button @click="store.saveEdit">Save Changes</Button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</template>
