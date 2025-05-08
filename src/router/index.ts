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
    path: '/customers/:id',
    name: 'edit-customers',
    component: () => import('../pages/Customer.page.vue'),
    // props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/customer/:userId',
    name: 'customer-details',
    component: () => import('../pages/CustomerDetails.page.vue'),
    // props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import('../pages/Customers.page.vue'),
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
  const auth = useAuth();

  auth.initAuth();

  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    console.log('Route requires auth, redirecting to login');
    next({ name: 'login' });
  } else if (
    to.name === 'login' &&
    auth.isAuthenticated.value &&
    from.name !== 'signout'
  ) {
    console.log('Already logged in, redirecting to dashboard');
    next({ name: 'dashboard' });
  } else {
    next();
  }
});
