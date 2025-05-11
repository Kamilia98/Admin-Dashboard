// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const API_URL = 'http://localhost:5000/auth';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  // Reactive state
  const error = ref<string | null>(null);
  const isLoading = ref(false);
  const user = ref(null);
  const token = ref<string | null>(null);
  const rememberMe = ref(false);

  // Computed
  const isAuthenticated = computed(() => !!token.value);

  // Initialization
  const initAuth = () => {
    const savedToken = getToken();
    if (savedToken) {
      token.value = savedToken;
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      rememberMe.value = localStorage.getItem('rememberMe') === 'true';
    }
  };

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Actions
  const login = async (email: string, password: string, remember: boolean) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data.status === 'success') {
        token.value = response.data.data.token;

        // Handle remember me functionality
        if (remember) {
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('rememberMe', 'true');
        } else {
          sessionStorage.setItem('token', response.data.data.token);
          localStorage.removeItem('rememberMe');
        }

        axios.defaults.headers.common['Authorization'] = `
          Bearer ${response.data.data.token}`;
        await router.push('/dashboard');
      }
    } catch (err: any) {
      isLoading.value = false;
      let message = 'Login request failed';
      if (err.response) {
        if (err.response.status === 403) {
          message = 'Only Owners and Admins can log in.';
        } else {
          message = err.response.data.message || 'Invalid email or password';
        }
      } else if (err.request) {
        message = 'No response from server';
      }
      error.value = message;

      ElMessage({
        message: message,
        type: 'error',
        duration: 5000,
        showClose: true,
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      token.value = null;
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('token');
      router.push('/login');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      return response.data.status === 'success';
    } catch (err: any) {
      if (err.response) {
        error.value = err.response.data.message || 'Failed to send reset link';
      } else {
        error.value = 'Request failed';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await axios.post(`${API_URL}/reset-password`, {
        token,
        password,
      });
      return response.data.status === 'success';
    } catch (err: any) {
      if (err.response) {
        error.value = err.response.data.message || 'Password reset failed';
      } else {
        error.value = 'Request failed';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize auth state on store creation
  initAuth();

  return {
    error,
    isLoading,
    user,
    token,
    rememberMe,
    isAuthenticated,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getToken,
    initAuth,
  };
});
