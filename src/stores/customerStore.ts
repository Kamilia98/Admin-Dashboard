// import { ref } from 'vue';
// import type { User } from '../types/user';
// import { defineStore } from 'pinia';
// import { fetchAllUsers, fetchUserById } from '../services/customerService';

// const CUSTOMER_LIMIT = 10;

// export const useCustomersStore = defineStore('customers', () => {
//   // --- State ---
//   const customers = ref<User[]>([]);
//   const currentPage = ref(1);
//   const totalPages = ref(1);
//   const totalCustomers = ref(0);
//   const loading = ref(false);

//   const searchQuery = ref('');
//   const roleFilter = ref<string[]>([]);
//   const dateRange = ref<[string, string]>(['', '']);
//   const startDateFilter = ref('');
//   const endDateFilter = ref('');
//   const userId = ref<string>('');

//   // --- Actions ---
//   const fetchCustomers = async (page = 1) => {
//     loading.value = true;
//     try {
//       const params: Record<string, any> = {
//         limit: CUSTOMER_LIMIT,
//         page,
//       };

//       if (roleFilter.value.length) params.role = roleFilter.value;
//       if (searchQuery.value.trim())
//         params.searchQuery = searchQuery.value.trim();

//       const { data } = await fetchAllUsers(params);

//       customers.value = data.users;
//       totalCustomers.value = data.totalUsers;
//       totalPages.value = Math.ceil(data.totalUsers / CUSTOMER_LIMIT);
//       currentPage.value = page;
//     } catch (error) {
//       console.error('Error loading customers:', error);
//     } finally {
//       loading.value = false;
//     }
//   };
//   const fetchCustomerById = async (id: string): Promise<User> => {
//     const data = await fetchUserById(id);
//     return data;
//   };

//   return {
//     customers,
//     currentPage,
//     totalPages,
//     totalCustomers,
//     loading,
//     searchQuery,
//     roleFilter,
//     userId,
//     fetchCustomers,
//     fetchCustomerById,
//   };
// });

// // const resetFilters = () => {
// //     searchQuery.value = '';
// //     roleFilter.value = [];
// // };
import { defineStore } from 'pinia';
import {
  deleteCustomer,
  fetchAllUsers,
  fetchUserById,
} from '../services/customerService';
import { ref } from 'vue';
import { useProductStore } from './productStore';
export interface Customer {
  username: string;
  email: string;
  thumbnail: string;
  phone: number;
  role: string;
  _id: string;
  createdAt: string;
  gender: string;
  favourites: string[];
  isEstablished: boolean;
}
export const useCustomerStore = defineStore('customers', () => {
  const customer = ref<Customer | null>(null);
  const customers = ref<Customer[]>([]);
  const total = ref(0);
  const newCustomers = ref(0);
  const returningCustomers = ref(0);
  const loading = ref(false);
  const favourites = ref<string[]>([]);
  const productStore = useProductStore();
  const getFormattedDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  const fetchAllCustomers = async (
    page: number,
    limit: number,
    search: string,
  ) => {
    loading.value = true;
    try {
      const data = await fetchAllUsers(page, limit, search);
      customers.value = data.users.map((user: Customer) => ({
        ...user,
        createdAt: getFormattedDate(user.createdAt),
        phone: String(user.phone || 'N/A'),
        isEstablished: new Date(user.createdAt) < new Date('2025-04-20'),
      }));
      total.value = data.totalUsers;
      newCustomers.value = data.newCustomers;
      returningCustomers.value = data.totalUsersWithOrders;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  const fetchCustomer = async (userId: string) => {
    try {
      loading.value = true;
      const user = (await fetchUserById(userId)) as Customer;
      const formatted = getFormattedDate(user.createdAt);
      user.createdAt = formatted;
      user.isEstablished = new Date(user.createdAt) < new Date('2025-04-20');
      customer.value = user;
      favourites.value = await Promise.all(
        user.favourites.map(async (id) => {
          const product = await productStore.getProductById(id);
          return product ? product.name : '';
        }),
      );
      return customer.value;
    } catch (err) {
      console.error('Failed to fetch customer', err);
    } finally {
      loading.value = false;
    }
    console.log('customer', customer.value);
  };
  const removeCustomer = async (id: string) => {
    await deleteCustomer(id);
    customers.value = customers.value.filter((u) => u._id !== id);
  };

  return {
    customers,
    total,
    newCustomers,
    returningCustomers,
    customer,
    loading,
    favourites,
    fetchCustomer,
    fetchAllCustomers,
    removeCustomer,
  };
});
