import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const routes = [
  // {
  //   path: '/signup',
  //   name: 'signup',
  //   component: () => import('../pages/Signup.page.vue'),
  //   meta: { requiresAuth: false, layout: 'auth' },
  // },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.page.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: '/signout',
    name: 'signout',
    component: () => import('../pages/Login.page.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: '',
    name: 'dashboard',
    component: () => import('../pages/Dashboard.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../pages/Orders.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/orders/:id',
    name: 'order-details',
    component: () => import('../pages/Order.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: "/customers/:id",
    name: "edit-customers",
    component: () => import("../pages/Customer.page.vue"),
    // props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/customers",
    name: "customers",
    component: () => import("../pages/Customers.page.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'user-profile',
    component: () => import('../pages/UserProfile.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/store',
    name: 'settings',
    component: () => import('../pages/Store.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('../pages/Products.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const { isAuthenticated, initAuth } = useAuth();

  // Initialize auth state
  initAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'login' });
  } else if (
    to.name === 'login' &&
    isAuthenticated.value &&
    from.name !== 'signout'
  ) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});
