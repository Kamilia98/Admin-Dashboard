import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "../pages/Dashboard.page.vue";
import ProductsPage from "../pages/Products.page.vue";
import OrdersPage from "../pages/Orders.page.vue";
import StorePage from "../pages/Store.page.vue";
import CustomersPage from "../pages/Customers.page.vue";

const routes = [
  { path: "", component: DashboardPage },
  { path: "/orders", component: OrdersPage },
  { path: "/customers", component: CustomersPage },
  { path: "/store", component: StorePage },
  { path: "/products", component: ProductsPage },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
