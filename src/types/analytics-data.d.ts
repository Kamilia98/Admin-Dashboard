export interface AnalyticsData {
  totalCustomers: number;
  totalOrders: number;
  trends: {
    orders: { trend: string; percentageChange: string };
    customers: { trend: string; percentageChange: string };
  };
}
