import { ref } from 'vue';
import { defineStore } from 'pinia';
import { OrderStatus, type Order } from '../types/order.d';
import {
  fetchAllOrders,
  fetchOrderById as fetchOrderByIdService,
  updateOrderStatus as updateOrderStatusService,
} from '../services/orderService';

export const useOrdersStore = defineStore('orders', () => {
  // State
  const orders = ref<any[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalOrders = ref(0);
  const loading = ref(false);

  const searchQuery = ref('');
  const statusFilter = ref<string[]>([]);
  const dateRange = ref<[string, string]>(['', '']);
  const startDateFilter = ref('');
  const endDateFilter = ref('');
  const sortBy = ref('default');
  const sortOrder = ref<'asc' | 'desc'>('desc');
  const minAmount = ref(0);
  const maxAmount = ref(0);

  const ORDER_STAGES: OrderStatus[] = [
    OrderStatus.pending,
    OrderStatus.processing,
    OrderStatus.shipped,
    OrderStatus.delivered,
  ];

  const ORDER_LIMIT = 8;
  const STATUS_OPTIONS = [
    {
      label: OrderStatus.pending,
      value: OrderStatus.pending,
    },
    {
      label: OrderStatus.processing,
      value: OrderStatus.processing,
    },
    {
      label: OrderStatus.shipped,
      value: OrderStatus.shipped,
    },
    {
      label: OrderStatus.delivered,
      value: OrderStatus.delivered,
    },
    {
      label: OrderStatus.canceled,
      value: OrderStatus.canceled,
    },
  ];

  // Actions
  const fetchOrders = async (page = 1) => {
    loading.value = true;
    try {
      const params: any = {
        limit: ORDER_LIMIT,
        page,
        startDate: startDateFilter.value,
        endDate: endDateFilter.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        minAmount: minAmount.value,
        maxAmount: maxAmount.value,
      };

      if (statusFilter.value.length) params.status = statusFilter.value;
      if (searchQuery.value.trim())
        params.searchQuery = searchQuery.value.trim();

      const data = await fetchAllOrders(params);

      orders.value = data.data.orders;
      totalOrders.value = data.data.totalOrders;
      totalPages.value = Math.ceil(totalOrders.value / ORDER_LIMIT);
      currentPage.value = page;
    } catch (err) {
      console.error('[Fetch Orders Error]:', err);
      orders.value = [];
      totalOrders.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const fetchOrderById = async (id: string): Promise<Order | null> => {
    try {
      return await fetchOrderByIdService(id);
    } catch (err) {
      console.error('[Fetch Single Order Error]:', err);
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatusService(orderId, newStatus);
      const order = orders.value.find((o) => o.id === orderId);
      if (order) order.status = newStatus;
    } catch (err) {
      console.error('[Update Status Error]:', err);
    }
  };

  const handleDateChange = () => {
    const [start, end] = dateRange.value;
    startDateFilter.value = start || '';
    endDateFilter.value = end || '';
  };

  const handleSort = (payload: { key: string; direction: 'asc' | 'desc' }) => {
    sortBy.value = payload.key;
    sortOrder.value = payload.direction;
    fetchOrders(1);
  };

  const handleReset = () => {
    statusFilter.value = [];
    dateRange.value = ['', ''];
    startDateFilter.value = '';
    endDateFilter.value = '';
    minAmount.value = 0;
    maxAmount.value = 0;
    fetchOrders(1);
  };

  const getNextStatusOptions = (status: OrderStatus) => {
    if ([OrderStatus.canceled, OrderStatus.delivered].includes(status))
      return [];

    const nextIndex = ORDER_STAGES.indexOf(status) + 1;
    const options =
      nextIndex < ORDER_STAGES.length
        ? [
            {
              label: capitalize(ORDER_STAGES[nextIndex]),
              value: ORDER_STAGES[nextIndex],
            },
          ]
        : [];

    return [
      ...options,
      {
        label: OrderStatus.canceled,
        value: OrderStatus.canceled,
      },
    ];
  };

  const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return {
    // constants
    ORDER_STAGES,
    ORDER_LIMIT,
    STATUS_OPTIONS,
    // state
    orders,
    currentPage,
    totalPages,
    totalOrders,
    loading,
    searchQuery,
    statusFilter,
    dateRange,
    startDateFilter,
    endDateFilter,
    sortBy,
    sortOrder,
    minAmount,
    maxAmount,

    // actions
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    handleDateChange,
    handleSort,
    handleReset,
    getNextStatusOptions,
  };
});
