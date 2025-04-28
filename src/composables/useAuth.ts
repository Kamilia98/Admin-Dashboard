import { ref, computed } from "vue";
import { useRouter } from "vue-router";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const API_URL = "http://localhost:5000";

export function useAuth() {
  const router = useRouter();
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  // Initialize auth state from localStorage
  const initAuth = () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Check if we have the expected data structure
      if (data.status === "success" && data.data?.token) {
        token.value = data.data.token;
        // Since user data is not in the response, we'll create a minimal user object
        user.value = {
          id: "", // You might want to get this from the token or another endpoint
          name: email.split("@")[0], // Using email username as name
          email: email,
          role: "user", // Default role
        };

        // Save to localStorage
        if (token.value) {
          localStorage.setItem("token", token.value);
        }
        localStorage.setItem("user", JSON.stringify(user.value));

        // Redirect to dashboard
        router.push("/");
      } else {
        throw new Error(data.message || "Invalid response format from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      error.value =
        err instanceof Error ? err.message : "An error occurred during login";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();

      if (data.status === "SUCCESS") {
        // Auto login after registration
        await login(email, password);
      }
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "An error occurred during registration";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout user
  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Get current user
  const getCurrentUser = () => {
    return user.value;
  };

  // Get auth token
  const getAuthToken = () => {
    return token.value;
  };

  return {
    user: computed(() => user.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    initAuth,
    login,
    register,
    logout,
    getCurrentUser,
    getAuthToken,
  };
}
