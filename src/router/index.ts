import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "",
    name: "dashboard",
    component: () => import("../pages/Dashboard.page.vue"),
  },
  {
    path: "/orders",
    name: "orders",
    component: () => import("../pages/Orders.page.vue"),
  },
  {
    path: "/orders/:id",
    name: "order-details",
    component: () => import("../pages/Order.page.vue"),
  },
  {
    path: "/customers",
    name: "customers",
    component: () => import("../pages/Customers.page.vue"),
  },
  {
    path: "/store",
    name: "store",
    component: () => import("../pages/Store.page.vue"),
  },
  {
    path: "/products",
    name: "products",
    component: () => import("../pages/Products.page.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
  routes,
});
