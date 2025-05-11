import { capitalize, ref } from 'vue';
import { defineStore } from 'pinia';
import { OrderStatus, type Order } from '../types/order.d';
import {
  fetchAllOrders,
  fetchOrderById as fetchOrderByIdService,
  updateOrderStatus as updateOrderStatusService,
  fetchOrderAnalytics as fetchOrderAnalyticsService,
} from '../services/orderService';

import { ElMessage } from 'element-plus';

// --- Constants ---
const ORDER_LIMIT = 10;
const ORDER_STAGES: OrderStatus[] = [
  OrderStatus.pending,
  OrderStatus.processing,
  OrderStatus.shipped,
  OrderStatus.delivered,
];

const STATUS_OPTIONS = Object.values(OrderStatus).map((status) => ({
  label: status,
  value: status,
}));

const channel = new BroadcastChannel('orders-sync');

export const useOrdersStore = defineStore('orders', () => {
  // --- State ---
  const orders = ref<Order[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalFilteredOrders = ref(0);
  const limits = ref(ORDER_LIMIT);
  const totalOrders = ref(0);
  const loading = ref(false);
  const error = ref('');

  const userId = ref('');
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

  const statusCounts = ref<Record<OrderStatus, number>>(
    Object.values(OrderStatus).reduce(
      (acc, status) => ({ ...acc, [status]: 0 }),
      {} as Record<OrderStatus, number>,
    ),
  );

  // --- Actions ---
  const fetchOrderAnalytics = async (userId: string = '') => {
    try {
      const data = await fetchOrderAnalyticsService(userId);
      totalOrders.value = data.totalOrders;
      totalRevenue.value = data.totalRevenue;
    } catch (err) {
      console.error('[Analytics Error]:', err);
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    }
  };

  const fetchOrders = async ({
    page = currentPage.value,
    limit = ORDER_LIMIT,
    sortByParam = sortBy.value,
    userId: paramUserId,
  }: {
    page?: number;
    limit?: number;
    sortByParam?: string;
    userId?: string;
  } = {}) => {
    if (loading.value) return;

    loading.value = true;
    try {
      const params: Record<string, any> = {
        page,
        limit,
        sortBy: sortByParam,
        sortOrder: sortOrder.value,
        startDate: startDateFilter.value,
        endDate: endDateFilter.value,
        minAmount: minAmount.value,
        maxAmount: maxAmount.value,
      };

      if (paramUserId) params.userId = paramUserId;
      if (statusFilter.value.length) params.status = statusFilter.value;
      if (searchQuery.value.trim())
        params.searchQuery = searchQuery.value.trim();

      const { data } = await fetchAllOrders(params);

      orders.value = data.orders;
      totalPages.value = data.totalPages;
      totalFilteredOrders.value = data.totalOrders;
      console.log('total', totalFilteredOrders);
      currentPage.value = page;
      limits.value = limit;
    } catch (err) {
      orders.value = [];
      console.error('[Fetch Orders Error]:', err);
      error.value = err instanceof Error ? err.message : String(err);
      // Error message
      ElMessage.error('Failed to fetch orders. Please try again.');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchOrderById = async (id: string): Promise<Order | null> => {
    try {
      loading.value = true;
      return await fetchOrderByIdService(id);
    } catch (err) {
      console.error('[Fetch Order Error]:', err);
      error.value = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      loading.value = true;
      await updateOrderStatusService(orderId, newStatus);
      const order = orders.value.find((o) => o.id === orderId);
      if (order) order.status = newStatus;
      channel.postMessage({ orderId, newStatus });

      ElMessage.success(`Order status updated to ${newStatus}!`);
    } catch (err) {
      console.error('[Update Status Error]:', err);
      error.value = err instanceof Error ? err.message : String(err);

      ElMessage.error('Failed to update order status. Please try again.');
      throw err;
    } finally {
      loading.value = false;
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

    fetchOrders({
      page: 1,
      userId: userId.value,
      limit: limits.value,
    })
      .then(() => {
        ElMessage.success('Filters reset successfully!');
      })
      .catch(() => {
        ElMessage.error('Failed to reset filters. Please try again.');
      });
  };

  const getNextStatusOptions = (status: OrderStatus) => {
    if ([OrderStatus.canceled, OrderStatus.delivered].includes(status))
      return [];

    const nextIndex = ORDER_STAGES.indexOf(status) + 1;
    const nextStatus = ORDER_STAGES[nextIndex];
    const options = nextStatus
      ? [{ label: capitalize(nextStatus), value: nextStatus }]
      : [];

    return [
      ...options,
      { label: OrderStatus.canceled, value: OrderStatus.canceled },
    ];
  };

  // Initialize channel listener
  handleChannelMessage();

  // --- Expose ---
  return {
    // Constants
    ORDER_LIMIT,
    ORDER_STAGES,
    STATUS_OPTIONS,

    // State
    orders,
    currentPage,
    totalPages,
    totalFilteredOrders,
    limits,
    totalOrders,
    totalRevenue,
    statusCounts,
    loading,
    error,
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
