import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.page.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../pages/ForgotPassword.page.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../pages/ResetPassword.page.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: '/signout',
    name: 'signout',
    component: () => import('../pages/Login.page.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../pages/Dashboard.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/',
    redirect: '/dashboard',
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
    path: '/customer/:userId',
    name: 'customer-details',
    component: () => import('../pages/CustomerDetails.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import('../pages/Customers.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
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
  {
    path: '/add-product',
    name: 'add-product',
    component: () => import('../components/products/AddProduct.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/products/:id',
    name: 'product-details',
    component: () => import('../pages/ProductDetails.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('../pages/Categories.page.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/categories/:id',
    name: 'category-details',
    component: () => import('../pages/CategoryDetails.page.vue'),
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

router.beforeEach(async (to, from, next) => {
  const store = useAuthStore();

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    console.log('Route requires auth, redirecting to login');
    return next({ name: 'login' });
  }

  if (to.name === 'login' && store.isAuthenticated && from.name !== 'signout') {
    console.log('Already logged in, redirecting to dashboard');
    console.log(from);
    return next({ name: from.name });
  }
  next();
});
