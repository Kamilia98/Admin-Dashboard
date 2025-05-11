import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

import axios from 'axios';
import { ElMessage } from 'element-plus';
const fetchUserProfile = async () => {
  try {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get('http://localhost:5000/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = response.data.data.user;
    console.log(data);
    return data;
  } catch (error: any) {
    console.log('Error fetching user profile:', error);
  }
};
const userRole: any = fetchUserProfile();
console.log(userRole);
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
    path: '/edit-product/:id',
    name: 'edit-product',
    component: () => import('../components/products/UpdateProduct.vue'),
    props: true,
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
  const userRole = await fetchUserProfile();
  console.log(userRole);
  if (to.meta.requiresAuth && !store.isAuthenticated) {
    console.log('Route requires auth, redirecting to login');
    next({ name: 'login' });
  } else if (
    to.name === 'login' &&
    store.isAuthenticated.value &&
    from.name !== 'signout'
    // auth ---> store
  ) {
    console.log('Already logged in, redirecting to dashboard');

    console.log(from);
    return next({ name: from.name });
  }

  if (to.name === 'settings' && userRole.role !== 'OWNER') {
    console.log(userRole.role);
    ElMessage({
      message: 'Access denied: Only OWNER can access the settings page',
      type: 'error',
      duration: 5000,
    });

    console.log('Access denied: Only OWNER role can access the settings page');
    return next({ name: from.name });
  }
  next();
});
