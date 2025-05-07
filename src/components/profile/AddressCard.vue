<template>
  <div>
    <div
      class="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800"
    >
      <div
        class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
      >
        <div>
          <h4
            class="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90"
          >
            Address
          </h4>

          <div
            class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32"
          >
            <div>
              <p
                class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
              >
                Country
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                Egypt
              </p>
            </div>

            <div>
              <p
                class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
              >
                City/State
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                Ismailiya, Egypt
              </p>
            </div>
          </div>
        </div>

        <button
          @click="isProfileAddressModal = true"
          class="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          <el-icon size="18"><Edit /></el-icon>
          Edit
        </button>
      </div>
    </div>
    <Modal v-if="isProfileAddressModal" @close="isProfileAddressModal = false">
      <template #body>
        <div
          class="relative no-scrollbar w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900"
        >
          <!-- close btn -->
          <button
            @click="isProfileAddressModal = false"
            class="transition-color absolute top-5 right-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
          >
            <el-icon><CloseBold /></el-icon>
          </button>
          <div class="px-2 pr-14">
            <h4
              class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90"
            >
              Edit Address
            </h4>
            <p class="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form class="flex flex-col">
            <div class="custom-scrollbar overflow-y-auto px-2">
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <label
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    value="Egypt"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>

                <div>
                  <label
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    City/State
                  </label>
                  <input
                    type="text"
                    value="Ismailiya, Egypt"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            </div>
            <div class="mt-6 flex items-center gap-3 lg:justify-end">
              <button
                @click="isProfileAddressModal = false"
                type="button"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              >
                Close
              </button>
              <button
                @click="saveProfile"
                type="button"
                class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './Modal.vue';
import { ElIcon } from 'element-plus';
import { Edit, CloseBold } from '@element-plus/icons-vue';
const isProfileAddressModal = ref(false);

const saveProfile = () => {
  // Implement save profile logic here
  console.log('Profile saved');
  isProfileAddressModal.value = false;
};
</script>

<style></style>
