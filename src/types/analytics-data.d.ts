export interface AnalyticsData {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  trends: {
    orders: { trend: string; percentageChange: string };
    customers: { trend: string; percentageChange: string };
    sales: { trend: string; percentageChange: string };
    products: { trend: string; percentageChange: string };
  };
}
