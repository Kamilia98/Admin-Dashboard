  <template>
    <div>
      <div
        class="mb-6 rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800"
      >
        <div
          class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
        >
          <div>
            <h4
              class="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90"
            >
              Personal Information
            </h4>

            <div
              class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32"
            >
              <div>
                <p
                  class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
                >
                  First Name
                </p>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ capitalize(userStore.user.fname) }}
                </p>
              </div>

              <div>
                <p
                  class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
                >
                  Last Name
                </p>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ capitalize(userStore.user.lname) }}
                </p>
              </div>

              <div>
                <p
                  class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
                >
                  Email address
                </p>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ userStore.user.email }}
                </p>
              </div>

              <div>
                <p
                  class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
                >
                  Phone
                </p>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ userStore.user.phone || 'N/A' }}
                </p>
              </div>

              <div>
                <p
                  class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400"
                >
                  Bio
                </p>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ userStore.user.bio || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <button class="edit-button" @click="isProfileInfoModal = true">
            <el-icon size="18"><Edit /></el-icon>
            Edit
          </button>
        </div>
      </div>
      <Modal v-if="isProfileInfoModal" @close="isProfileInfoModal = false">
        <template #body>
          <div
            class="relative no-scrollbar w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900"
          >
            <!-- close btn -->
            <button
              @click="isProfileInfoModal = false"
              class="transition-color absolute top-5 right-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
            >
              <el-icon size="18"><CloseBold /></el-icon>
            </button>
            <div class="px-2 pr-14">
              <h4
                class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90"
              >
                Edit Personal Information
              </h4>
              <p class="text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                Update your details to keep your profile up-to-date.
              </p>
            </div>
            <form class="flex flex-col">
              <div class="custom-scrollbar overflow-y-auto p-2">
                <div class="mt-7">
                  <h5
                    class="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90"
                  >
                    Personal Information
                  </h5>

                  <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div class="col-span-2 lg:col-span-1">
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        v-model="formData.fname"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>

                    <div class="col-span-2 lg:col-span-1">
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        v-model="formData.lname"
                        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>

                    <div class="col-span-2 lg:col-span-1">
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Email Address
                      </label>
                      <input
                        type="text"
                        v-model="formData.email"
                        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>

                    <div class="col-span-2 lg:col-span-1">
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Phone
                      </label>
                      <input
                        type="text"
                        v-model="formData.phone"
                        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>

                    <div class="col-span-2">
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Bio
                      </label>
                      <input
                        type="text"
                        v-model="formData.bio"
                        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex items-center gap-3 px-2 lg:justify-end">
                <button
                  @click="isProfileInfoModal = false"
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
  import { ref, watch, capitalize } from 'vue';
  import Modal from './Modal.vue';
  import { ElIcon } from 'element-plus';
  import { Edit, CloseBold } from '@element-plus/icons-vue';
  import { useUserProfile } from '../../composables/useUserProfile';
  import { useUserStore } from '../../stores/userProfile';

  const { saveUserProfile } = useUserProfile();
  const isProfileInfoModal = ref(false);
  const userStore = useUserStore();
  const formData = ref({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    bio: '',
  });

  watch(
    () => userStore.user,
    (newUser) => {
      if (newUser) {
        formData.value = {
          fname: newUser.fname || '',
          lname: newUser.lname || '',
          email: newUser.email || '',
          phone: newUser.phone || '',
          bio: newUser.bio || '',
        };
      }
    },
    { immediate: true },
  );

  const saveProfile = async () => {
    const success = await saveUserProfile(formData.value);
    if (success) {
      isProfileInfoModal.value = false;
    }
  };
  </script>
