import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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
  id: string;
  name: string;
  cost: number;
  isActive: boolean;
  deletedAt?: Date;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  isActive: boolean;
  deletedAt?: Date;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
  isDefault: boolean;
  isActive: boolean;
  deletedAt?: Date;
}

export interface Language {
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  deletedAt?: Date;
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

  const addUserRole = (role: Omit<UserRole, 'id'>) => {
    const newRole: UserRole = {
      ...role,
      id: crypto.randomUUID(),
      isActive: true,
    };
    storeConfig.value.userRoles.push(newRole);
  };

  const updateUserRole = (id: string, updates: Partial<UserRole>) => {
    const index = storeConfig.value.userRoles.findIndex((r) => r.id === id);
    if (index !== -1) {
      storeConfig.value.userRoles[index] = {
        ...storeConfig.value.userRoles[index],
        ...updates,
      };
    }
  };

  const softDeleteUserRole = (id: string) => {
    const role = storeConfig.value.userRoles.find((r) => r.id === id);
    if (role) {
      role.deletedAt = new Date();
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
      // TODO: Implement API call to load store configuration
      // For now, we'll just simulate loading with some default data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      storeConfig.value = {
        storeName: 'My Store',
        defaultCurrency: 'USD',
        defaultLanguage: 'en',
        shippingMethods: [
          {
            id: '1',
            name: 'Standard Shipping',
            cost: 5.99,
            isActive: true,
          },
          {
            id: '2',
            name: 'Express Shipping',
            cost: 12.99,
            isActive: true,
          },
        ],
        userRoles: [
          {
            id: '1',
            name: 'Owner',
            permissions: ['all'],
            isActive: true,
          },
          {
            id: '2',
            name: 'Admin',
            permissions: ['manage_products', 'manage_orders'],
            isActive: true,
          },
        ],
        supportedCurrencies: [
          {
            code: 'USD',
            symbol: '$',
            name: 'US Dollar',
            exchangeRate: 1,
            isDefault: true,
            isActive: true,
          },
          {
            code: 'EGP',
            symbol: '£',
            name: 'Egyptian Pound',
            exchangeRate: 50.00,
            isDefault: false,
            isActive: true,
          },
        ],
        supportedLanguages: [
          {
            code: 'en',
            name: 'English',
            isDefault: true,
            isActive: true,
          },
          {
            code: 'ar',
            name: 'Arabic',
            isDefault: false,
            isActive: true,
          },
        ],
      };
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Failed to load store configuration';
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
    activeCurrencies,
    activeLanguages,
    updateStoreConfig,
    addShippingMethod,
    updateShippingMethod,
    softDeleteShippingMethod,
    addUserRole,
    updateUserRole,
    softDeleteUserRole,
    addCurrency,
    updateCurrency,
    softDeleteCurrency,
    addLanguage,
    updateLanguage,
    softDeleteLanguage,
    saveStoreConfig,
    loadStoreConfig,
  };
});
