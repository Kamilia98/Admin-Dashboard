import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  status: string;
  createdAt?: string;
}
export interface StoreConfig {
  storeName: string;
  defaultCurrency: string;
  defaultLanguage: string;
  shippingMethods: ShippingMethod[];
  userRoles: UserRole[];
  supportedCurrencies: Currency[];
  supportedLanguages: Language[];
}

export interface ShippingMethod {
  id?: string;
  name: string;
  cost: number;
  isActive: boolean;
  deletedAt?: Date | null;
}

export interface UserRole {
  id?: string;
  name: string;
  permissions: string[];
  isActive: boolean;
  deletedAt?: Date | null;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
  isDefault: boolean;
  isActive: boolean;
  deletedAt?: Date | null;
}

export interface Language {
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  deletedAt?: Date | null;
}

export const useStoreConfigStore = defineStore('storeConfig', () => {
  const storeConfig = ref<StoreConfig>({
    storeName: '',
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    shippingMethods: [],
    userRoles: [],
    supportedCurrencies: [],
    supportedLanguages: [],
  });

  const adminUsers = ref<AdminUser[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const activeShippingMethods = computed(() =>
    storeConfig.value.shippingMethods.filter(
      (method) => method.isActive && !method.deletedAt,
    ),
  );

  const activeUserRoles = computed(() =>
    storeConfig.value.userRoles.filter(
      (role) => role.isActive && !role.deletedAt,
    ),
  );

  const activeCurrencies = computed(() =>
    storeConfig.value.supportedCurrencies.filter(
      (currency) => currency.isActive && !currency.deletedAt,
    ),
  );

  const activeLanguages = computed(() =>
    storeConfig.value.supportedLanguages.filter(
      (language) => language.isActive && !language.deletedAt,
    ),
  );

  // Actions
  const updateStoreConfig = (config: Partial<StoreConfig>) => {
    storeConfig.value = { ...storeConfig.value, ...config };
  };

  const addShippingMethod = (method: Omit<ShippingMethod, 'id'>) => {
    const newMethod: ShippingMethod = {
      ...method,
      id: crypto.randomUUID(),
      isActive: true,
    };
    storeConfig.value.shippingMethods.push(newMethod);
  };

  const updateShippingMethod = (
    id: string,
    updates: Partial<ShippingMethod>,
  ) => {
    const index = storeConfig.value.shippingMethods.findIndex(
      (m) => m.id === id,
    );
    if (index !== -1) {
      storeConfig.value.shippingMethods[index] = {
        ...storeConfig.value.shippingMethods[index],
        ...updates,
      };
    }
  };

  const softDeleteShippingMethod = (id: string) => {
    const method = storeConfig.value.shippingMethods.find((m) => m.id === id);
    if (method) {
      method.deletedAt = new Date();
    }
  };

  const addCurrency = (currency: Omit<Currency, 'code'>) => {
    const newCurrency: Currency = {
      ...currency,
      code: currency.symbol.toUpperCase(),
      isActive: true,
    };
    storeConfig.value.supportedCurrencies.push(newCurrency);
  };

  const updateCurrency = (code: string, updates: Partial<Currency>) => {
    const index = storeConfig.value.supportedCurrencies.findIndex(
      (c) => c.code === code,
    );
    if (index !== -1) {
      storeConfig.value.supportedCurrencies[index] = {
        ...storeConfig.value.supportedCurrencies[index],
        ...updates,
      };
    }
  };

  const softDeleteCurrency = (code: string) => {
    const currency = storeConfig.value.supportedCurrencies.find(
      (c) => c.code === code,
    );
    if (currency) {
      currency.deletedAt = new Date();
    }
  };

  const addLanguage = (language: Omit<Language, 'code'>) => {
    const newLanguage: Language = {
      ...language,
      code: language.name.substring(0, 2).toLowerCase(),
      isActive: true,
    };
    storeConfig.value.supportedLanguages.push(newLanguage);
  };

  const updateLanguage = (code: string, updates: Partial<Language>) => {
    const index = storeConfig.value.supportedLanguages.findIndex(
      (l) => l.code === code,
    );
    if (index !== -1) {
      storeConfig.value.supportedLanguages[index] = {
        ...storeConfig.value.supportedLanguages[index],
        ...updates,
      };
    }
  };

  const softDeleteLanguage = (code: string) => {
    const language = storeConfig.value.supportedLanguages.find(
      (l) => l.code === code,
    );
    if (language) {
      language.deletedAt = new Date();
    }
  };

  const saveStoreConfig = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/settings',
        storeConfig.value,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.status === 'success') {
        ElMessage.success('Store configuration saved successfully!');
        console.log('Store configuration saved successfully!');
      } else {
        error.value =
          response.data.message || 'Failed to save store configuration';
        ElMessage.error(error.value || 'An unknown error occurred'); // show message
      }
    } catch (err: any) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Failed to save store configuration';
      ElMessage.error(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const loadStoreConfig = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        storeConfig.value = response.data.data;
      } else {
        error.value =
          response.data.message || 'Failed to load store configuration';
        ElMessage.error(error.value || 'An unknown error occurred');
      }
    } catch (err: any) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Failed to load store configuration';
      ElMessage.error(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  // ***********************************************/
  //                Admin User Actions
  // ***********************************************/
  const inviteAdminUser = async (admin: {
    email: string;
    role: string;
    permissions?: string[];
  }) => {
    //add permission
    isLoading.value = true;
    error.value = null;
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/auth/admin/invite',
        {
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.status === 'success') {
        ElMessage.success('Invitation sent successfully!');
        await loadAdminUsers();
      } else {
        error.value = response.data.message || 'Failed to send invitation.';
        ElMessage.error(error.value || 'An unknown error occurred');
      }
    } catch (err: any) {
      error.value =
        err instanceof Error ? err.message : 'Failed to send invitation.';
      ElMessage.error('Failed to send invitation.');
    } finally {
      isLoading.value = false;
    }
  };
  const loadAdminUsers = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/users/admin/users',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === 'success') {
        adminUsers.value = response.data.data;
      } else {
        error.value = response.data.message || 'Failed to load admin users.';
        ElMessage.error(error.value || 'An unknown error occurred');
      }
    } catch (err: any) {
      error.value =
        err instanceof Error ? err.message : 'Failed to load admin users.';
      ElMessage.error(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const updateAdminUserPermissions = async (
    adminId: string,
    updates: { permissions: string[] },
  ) => {
    // Updated action name
    isLoading.value = true;
    error.value = null;
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5000/users/admin/users/${adminId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.status === 'success') {
        ElMessage.success('Admin permissions updated successfully!');
        await loadAdminUsers();
      } else {
        error.value =
          response.data.message || 'Failed to update admin permissions.';
        ElMessage.error(error.value || 'An unknown error occurred');
      }
    } catch (err: any) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Failed to update admin permissions.';
      ElMessage.error(error.value);
    } finally {
      isLoading.value = false;
    }
  };
  const removeAdminUser = async (adminId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5000/users/admin/users/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === 'success') {
        ElMessage.success('Admin user removed successfully!');
        await loadAdminUsers(); // Reload the list
      } else {
        error.value = response.data.message || 'Failed to remove admin user.';
        ElMessage.error(error.value || 'An unknown error occurred');
      }
    } catch (err: any) {
      error.value =
        err instanceof Error ? err.message : 'Failed to remove admin user.';
      ElMessage.error(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  // Watch for changes in storeConfig
  watch(
    () => storeConfig.value,
    (newConfig, prevConfig) => {
      if (prevConfig) {
        if (newConfig.storeName !== prevConfig.storeName) {
          console.log('Store name changed:', newConfig.storeName);
        }
        if (newConfig.defaultCurrency !== prevConfig.defaultCurrency) {
          console.log('Default currency changed:', newConfig.defaultCurrency);
        }
        if (newConfig.defaultLanguage !== prevConfig.defaultLanguage) {
          console.log('Default language changed:', newConfig.defaultLanguage);
        }
      }
    },
    { deep: true },
  );

  //add new user role
  const addRole = (role: Omit<UserRole, 'id'>) => {
    const newRole: UserRole = {
      ...role,
      id: crypto.randomUUID(),
      isActive: true,
    };
    storeConfig.value.userRoles.push(newRole);
  };

  const updateRole = (id: string, updates: Partial<UserRole>) => {
    const index = storeConfig.value.userRoles.findIndex((r) => r.id === id);
    if (index !== -1) {
      storeConfig.value.userRoles[index] = {
        ...storeConfig.value.userRoles[index],
        ...updates,
      };
    }
  };

  const softDeleteRole = (id: string) => {
    const role = storeConfig.value.userRoles.find((r) => r.id === id);
    if (role) {
      role.deletedAt = new Date();
    }
  };

  return {
    storeConfig,
    isLoading,
    error,
    activeShippingMethods,
    activeUserRoles,
    activeCurrencies,
    activeLanguages,
    updateStoreConfig,
    addShippingMethod,
    updateShippingMethod,
    softDeleteShippingMethod,
    addCurrency,
    updateCurrency,
    softDeleteCurrency,
    addLanguage,
    updateLanguage,
    softDeleteLanguage,
    saveStoreConfig,
    loadStoreConfig,
    adminUsers,
    inviteAdminUser,
    updateAdminUserPermissions,
    removeAdminUser,
    loadAdminUsers,
    addRole,
    updateRole,
    softDeleteRole,
  };
});
