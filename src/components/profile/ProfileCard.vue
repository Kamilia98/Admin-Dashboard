<template>
  <div>
    <div
      class="mb-6 rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800"
    >
      <div
        class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex w-full flex-col items-center gap-6 xl:flex-row">
          <div
          class="group relative h-15 w-15 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800"
          >
            <template v-if="!isLoading">
              <img
                v-if="user.thumbnail"
                :src="user.thumbnail"
                :alt="user.fullName"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800"
              >
                <span class="text-2xl text-gray-500 dark:text-gray-400">
                  {{ user.fullName?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
            </template>
            <div
              v-else
              class="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700"
            ></div>

            <div
              class="absolute inset-0 flex cursor-pointer items-end justify-center bg-black/30 opacity-0 transition-all duration-300 group-hover:opacity-100"
              @click="isImageModalOpen = true"
            >
              <div
                class="flex h-1/2 w-full translate-y-full transform items-center justify-center bg-gray-300/70 transition-transform duration-300 group-hover:translate-y-0"
              >
                <el-icon class="text-xl text-white" color="#ffff"><UploadFilled /></el-icon>
              </div>
            </div>
          </div>
          <div class="order-3 xl:order-2">
            <template v-if="!isLoading">
              <h4
                class="mb-2 text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90"
              >
                {{ capitalize(user.fullName) }}
              </h4>
              <div
                class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ user.email }}
                </p>
                <div
                  class="hidden h-3.5 w-px bg-gray-300 xl:block dark:bg-gray-700"
                ></div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ user.role || 'User' }}
                </p>
              </div>
            </template>
            <template v-else>
              <div
                class="mb-2 h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
              ></div>
              <div
                class="flex flex-col items-center gap-1 xl:flex-row xl:gap-3"
              >
                <div
                  class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
                ></div>
                <div class="hidden h-3.5 w-px xl:block"></div>
                <div
                  class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
                ></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="isImageModalOpen" @close="isImageModalOpen = false">
      <template #body>
        <div
          class="relative no-scrollbar w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900"
        >
          <button
            @click="isImageModalOpen = false"
            class="transition-color absolute top-5 right-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
          >
            <el-icon size="18"><CloseBold /></el-icon>
          </button>
          <div class="px-2 pr-14">
            <h4
              class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90"
            >
              Change Profile Picture
            </h4>
            <p class="text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
              Upload a new profile picture
            </p>
          </div>
          <div class="mt-6">
            <Dropzone
              v-model="profileImage"
              @update:modelValue="handleImageUpdate"
            />
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, capitalize } from 'vue';
import { useUserProfile } from '../../composables/useUserProfile';
import Modal from './Modal.vue';
import Dropzone from '../common/Dropzone.vue';
import { ElIcon } from 'element-plus';
import { CloseBold, UploadFilled } from '@element-plus/icons-vue';

const { user, isLoading, fetchUserProfile, updateUserImage } = useUserProfile();
const isImageModalOpen = ref(false);
const profileImage = ref(user.value?.thumbnail || '');

const handleImageUpdate = async (newImageUrl: string) => {
  profileImage.value = newImageUrl;
  const success = await updateUserImage(newImageUrl);
  if (success) {
    isImageModalOpen.value = false;
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>