import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useAuthStore } from './authStore';
const API_BASE = 'http://localhost:5000';
const getAuthHeaders = () => {
  const { token } = useAuthStore();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

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
  const activeShippingMethods = ref([]);
  const currencies = ref([]);
  const languages = ref([]);

  const activeUserRoles = computed(() =>
    storeConfig.value.userRoles.filter(
      (role) => role.isActive && !role.deletedAt,
    ),
  );

  // Actions
  const updateStoreConfig = (config: Partial<StoreConfig>) => {
    storeConfig.value = { ...storeConfig.value, ...config };
  };

  const addShippingMethod = async (method: Omit<ShippingMethod, 'id'>) => {
    try {
      const data = await axios.post(`${API_BASE}/shippings`, method, {
        headers: getAuthHeaders(),
      });
      activeShippingMethods.value = data.data.data.shippingMethods;
      return activeShippingMethods.value;
    } catch (err) {
      console.log(err);
    }
  };

  const updateShippingMethod = async (
    id: string,
    updates: Partial<ShippingMethod>,
  ) => {
    try {
      const data = await axios.put(
        `${API_BASE}/shippings`,
        { name: updates.name, cost: updates.cost },
        { headers: getAuthHeaders(), params: { id } },
      );
      activeShippingMethods.value = data.data.data.shippingMethods;
      return activeShippingMethods.value;
    } catch (err) {
      console.log(err);
    }
  };

  const softDeleteShippingMethod = async (id: string) => {
    storeConfig.value.shippingMethods =
      storeConfig.value.shippingMethods.filter((m) => m.id !== id);
    try {
      const data = await axios.delete(`${API_BASE}/shippings`, {
        headers: getAuthHeaders(),
        params: { id },
      });
      activeShippingMethods.value = data.data.data.shippingMethods;
      return activeShippingMethods.value;
    } catch (err) {
      console.log(err);
    }
  };

  const addCurrency = async (currency: Omit<Currency, 'code'>) => {
    try {
      const data = await axios.post(`${API_BASE}/currency`, currency, {
        headers: getAuthHeaders(),
      });
      currencies.value = data.data.data.supportedCurrencies;
      console.log(currencies.value);
      return currencies.value;
    } catch (err) {
      console.log(err);
    }
  };

  const updateCurrency = async (id: string, updates: Partial<Currency>) => {
    try {
      const data = await axios.put(`${API_BASE}/currency`, updates, {
        headers: getAuthHeaders(),
        params: { id },
      });
      currencies.value = data.data.data.supportedCurrencies;
      return currencies.value;
    } catch (err) {
      console.log(err);
    }
  };
  const setDefaultCurrency = async (id: string) => {
    try {
      const data = await axios.patch(
        `${API_BASE}/currency`,
        {},
        { headers: getAuthHeaders(), params: { id } },
      );
      currencies.value = data.data.data.supportedCurrencies;
      return currencies.value;
    } catch (err) {
      console.log(err);
    }
  };
  const softDeleteCurrency = async (code: string) => {
    try {
      const data = await axios.delete(`${API_BASE}/currency`, {
        headers: getAuthHeaders(),
        params: { id: code },
      });
      currencies.value = data.data.data.supportedCurrencies;
      return currencies.value;
    } catch (err) {
      console.log(err);
    }
  };

  const addLanguage = async (language: Omit<Language, 'code'>) => {
    console.log(language);
    try {
      const data = await axios.post(
        `${API_BASE}/language`,
        { name: language.name },
        {
          headers: getAuthHeaders(),
        },
      );
      languages.value = data.data.data.supportedLanguages;
      console.log(languages.value);
      return languages.value;
    } catch (err) {
      console.log('ERRORRRRR', err);
    }
    return;
  };

  const updateLanguage = async (id: string, updates: Partial<Language>) => {
    try {
      const data = await axios.put(`${API_BASE}/language`, updates, {
        headers: getAuthHeaders(),
        params: { id },
      });
      languages.value = data.data.data.supportedLanguages;
      return languages.value;
    } catch (err) {
      console.log(err);
    }
  };
  const setDefaultLanguage = async (id: string) => {
    try {
      const data = await axios.patch(
        `${API_BASE}/language`,
        {},
        { headers: getAuthHeaders(), params: { id } },
      );
      languages.value = data.data.data.supportedLanguages;

      return languages.value;
    } catch (err) {
      console.log(err);
    }
  };
  const softDeleteLanguage = async (id: string) => {
    try {
      const data = await axios.delete(`${API_BASE}/language`, {
        headers: getAuthHeaders(),
        params: { id },
      });
      languages.value = data.data.data.supportedlanguages;
      return languages.value;
    } catch (err) {
      console.log(err);
    }
  };

  const saveStoreConfig = async () => {
    console.log('kamilaiaaiaiaiaiaiaiaiaiaiaiai');
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
        // ElMessage.error(error.value || 'An unknown error occurred'); // show message
      }
    } catch (err: any) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Failed to save store configuration';
      // ElMessage.error(error.value);
      ElMessage.success('Store configuration saved successfully!');
      console.error('error', err);
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
        console.log('[store settings]', storeConfig.value);
      } else {
        error.value =
          response.data.message || 'Failed to load store configuration';
        ElMessage.error(error.value || 'An unknown error occurred');
      }
      return storeConfig.value;
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
        console.log('[ammmar]-', response.data.data);
        return adminUsers.value;
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
    setDefaultCurrency,
    activeUserRoles,
    setDefaultLanguage,
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
