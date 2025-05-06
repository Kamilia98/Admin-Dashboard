import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

export const useAuth = () => {
  const router = useRouter();
  const error = ref<string | null>(null);
  const isLoading = ref(false);
  const user = ref(null);
  const token = ref<string | null>(null);
  const rememberMe = ref(false);

  const isAuthenticated = computed(() => !!token.value);

  const initAuth = () => {
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (savedToken) {
      token.value = savedToken;
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      rememberMe.value = localStorage.getItem('rememberMe') === 'true';
    }
  };

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

        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        await router.push('/dashboard');
      }
    } catch (err: any) {
      if (err.response) {
        error.value = err.response.data.message || 'Invalid email or password';
      } else if (err.request) {
        error.value = 'No response from server';
      } else {
        error.value = 'Login request failed';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, null, {
        headers: { Authorization: `Bearer ${token.value}` },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      token.value = null;
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      delete axios.defaults.headers.common['Authorization'];
      router.push('/login');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      
      if (response.data.status === 'success') {
        return true;
      }
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
      
      if (response.data.status === 'success') {
        return true;
      }
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

  return {
    login,
    logout,
    forgotPassword,
    resetPassword,
    initAuth,
    error,
    isLoading,
    user,
    isAuthenticated,
    token,
    rememberMe,
  };
};