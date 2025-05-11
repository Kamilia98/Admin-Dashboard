import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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

  const activeUserRoles = computed(() =>
    storeConfig.value.userRoles.filter(
      (role) => role.isActive && !role.deletedAt,
    ),
  );

  // const activeCurrencies = computed(() =>
  //   storeConfig.value.supportedCurrencies.filter(
  //     (currency) => currency.isActive && !currency.deletedAt,
  //   ),
  // );

  const activeLanguages = computed(() =>
    storeConfig.value.supportedLanguages.filter(
      (language) => language.isActive && !language.deletedAt,
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
      }
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Failed to save store configuration';
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
      storeConfig.value = response.data.data;
      return storeConfig.value;
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Failed to load store configuration';
    } finally {
      isLoading.value = false;
    }
  };

  // ***********************************************/
  //         Admin User Actions
  // ***********************************************/
  const inviteAdminUser = async (admin: { email: string; role: string }) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/auth/admin/invite',
        admin,
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
        ElMessage.error('An unknown error occurred');
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

  const updateAdminUserRole = async (adminId: string, newRole: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5000/users/admin/users/${adminId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.status === 'success') {
        ElMessage.success('Admin role updated successfully!');
        await loadAdminUsers();
      } else {
        error.value = response.data.message || 'Failed to update admin role.';
        ElMessage.error(error.value || 'An unknown error occurred');
      }
    } catch (err: any) {
      error.value =
        err instanceof Error ? err.message : 'Failed to update admin role.';
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

  return {
    storeConfig,
    isLoading,
    error,
    activeShippingMethods,
    activeUserRoles,
    currencies,
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
    setDefaultCurrency,

    // handle store config
    saveStoreConfig,
    loadStoreConfig,

    // handle admin users
    adminUsers,
    inviteAdminUser,
    updateAdminUserRole,
    removeAdminUser,
    loadAdminUsers,
  };
});
