import { ref } from 'vue';
import { defineStore } from 'pinia';
import { OrderStatus, type Order } from '../types/order.d';
import {
  fetchAllOrders,
  fetchOrderById as fetchOrderByIdService,
  updateOrderStatus as updateOrderStatusService,
  fetchOrderAnalytics as fetchOrderAnalyticsService,
} from '../services/orderService';

// --- Constants ---
const ORDER_LIMIT = 8;
const ORDER_STAGES: OrderStatus[] = [
  OrderStatus.pending,
  OrderStatus.processing,
  OrderStatus.shipped,
  OrderStatus.delivered,
];

const STATUS_OPTIONS = [
  { label: OrderStatus.pending, value: OrderStatus.pending },
  { label: OrderStatus.processing, value: OrderStatus.processing },
  { label: OrderStatus.shipped, value: OrderStatus.shipped },
  { label: OrderStatus.delivered, value: OrderStatus.delivered },
  { label: OrderStatus.canceled, value: OrderStatus.canceled },
];

const channel = new BroadcastChannel('orders-sync');

export const useOrdersStore = defineStore('orders', () => {
  // --- State ---
  const orders = ref<Order[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalOrders = ref(0);
  const loading = ref(false);

  const userId = ref<string>('');
  const searchQuery = ref('');
  const statusFilter = ref<string[]>([]);
  const dateRange = ref<[string, string]>(['', '']);
  const startDateFilter = ref('');
  const endDateFilter = ref('');
  const sortBy = ref('createdAt');
  const sortOrder = ref<'asc' | 'desc'>('desc');
  const minAmount = ref(0);
  const maxAmount = ref(0);

  const totalRevenue = ref(0);
  const statusCounts = ref<Record<OrderStatus, number>>({
    [OrderStatus.pending]: 0,
    [OrderStatus.processing]: 0,
    [OrderStatus.shipped]: 0,
    [OrderStatus.delivered]: 0,
    [OrderStatus.canceled]: 0,
  });

  // --- Actions ---
  const fetchOrderAnalytics = async () => {
    try {
      const data = await fetchOrderAnalyticsService();
      totalOrders.value = data.totalOrders;
      totalRevenue.value = data.totalRevenue;
      statusCounts.value = { ...data.statusCounts };
      console.log(data);
    } catch (error) {
      console.error('Error loading order analytics:', error);
    }
  };

  const fetchOrders = async ({
    page = 1,
    limit = ORDER_LIMIT,
    sortByParam = sortBy.value,
    userId,
  }: {
    page?: number;
    limit?: number;
    sortByParam?: string;
    userId?: string;
  } = {}) => {
    loading.value = true;
    try {
      const params: Record<string, any> = {
        limit,
        page,
        startDate: startDateFilter.value,
        endDate: endDateFilter.value,
        sortBy: sortByParam,
        sortOrder: sortOrder.value,
        minAmount: minAmount.value,
        maxAmount: maxAmount.value,
      };
      // if (limit) params.limit = limit;
      if (userId) params.userId = userId;
      if (statusFilter.value.length) params.status = statusFilter.value;
      if (searchQuery.value.trim())
        params.searchQuery = searchQuery.value.trim();

      const { data } = await fetchAllOrders(params);

      orders.value = data.orders;
      totalOrders.value = data.totalOrders;
      totalPages.value = Math.ceil(data.totalOrders / ORDER_LIMIT);
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
      console.error('[Fetch Order Error]:', err);
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatusService(orderId, newStatus);
      const order = orders.value.find((o) => o.id === orderId);
      if (order) order.status = newStatus;

      // Sync with other tabs
      channel.postMessage({ orderId, newStatus });
    } catch (err) {
      console.error('[Update Status Error]:', err);
    }
  };

  const handleChannelMessage = () => {
    channel.onmessage = ({ data }: MessageEvent) => {
      const { orderId, newStatus } = data;
      const order = orders.value.find((o) => o.id === orderId);
      if (order) order.status = newStatus;
    };
  };

  const handleDateChange = () => {
    const [start, end] = dateRange.value;
    startDateFilter.value = start || '';
    endDateFilter.value = end || '';
  };

  const handleSort = ({
    key,
    direction,
  }: {
    key: string;
    direction: 'asc' | 'desc';
  }) => {
    sortBy.value = key;
    sortOrder.value = direction;
    fetchOrders({ page: 1, userId: userId.value });
  };

  const handleReset = () => {
    searchQuery.value = '';
    statusFilter.value = [];
    dateRange.value = ['', ''];
    startDateFilter.value = '';
    endDateFilter.value = '';
    minAmount.value = 0;
    maxAmount.value = 0;
    sortBy.value = 'createdAt';
    sortOrder.value = 'desc';
    fetchOrders({ page: 1, userId: userId.value });
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
      { label: OrderStatus.canceled, value: OrderStatus.canceled },
    ];
  };

  const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Initialize channel listener once
  handleChannelMessage();

  // --- Expose ---
  return {
    // Constants
    ORDER_LIMIT,
    ORDER_STAGES,
    STATUS_OPTIONS,

    // State
    totalRevenue,
    statusCounts,
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
    userId,

    // Actions
    fetchOrders,
    fetchOrderById,
    fetchOrderAnalytics,
    updateOrderStatus,
    handleDateChange,
    handleSort,
    handleReset,
    getNextStatusOptions,
  };
});
