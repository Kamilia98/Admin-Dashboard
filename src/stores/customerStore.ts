import { ref } from 'vue';
import type { User } from '../types/user';
import { defineStore } from 'pinia';
import { fetchAllUsers, fetchUserById } from '../services/customerService';

const CUSTOMER_LIMIT = 10;

export const useCustomersStore = defineStore('customers', () => {
  // --- State ---
  const customers = ref<User[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalCustomers = ref(0);
  const loading = ref(false);

  const searchQuery = ref('');
  const roleFilter = ref<string[]>([]);
  const dateRange = ref<[string, string]>(['', '']);
  const startDateFilter = ref('');
  const endDateFilter = ref('');
  const userId = ref<string>('');

  // --- Actions ---
  const fetchCustomers = async (page = 1) => {
    loading.value = true;
    try {
      const params: Record<string, any> = {
        limit: CUSTOMER_LIMIT,
        page,
      };

      if (roleFilter.value.length) params.role = roleFilter.value;
      if (searchQuery.value.trim())
        params.searchQuery = searchQuery.value.trim();

      const { data } = await fetchAllUsers(params);

      customers.value = data.users;
      totalCustomers.value = data.totalUsers;
      totalPages.value = Math.ceil(data.totalUsers / CUSTOMER_LIMIT);
      currentPage.value = page;
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      loading.value = false;
    }
  };
  const fetchCustomerById = async (id: string): Promise<User> => {
    const data = await fetchUserById(id);
    return data;
  };

  return {
    customers,
    currentPage,
    totalPages,
    totalCustomers,
    loading,
    searchQuery,
    roleFilter,
    userId,
    fetchCustomers,
    fetchCustomerById,
  };
});

// const resetFilters = () => {
//     searchQuery.value = '';
//     roleFilter.value = [];
// };
