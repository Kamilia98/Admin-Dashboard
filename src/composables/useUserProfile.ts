import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userProfile';
import { useAuthStore } from '../stores/authStore';

export interface UserProfile {
  fname: string;
  lname: string;
  fullName: string;
  email: string;
  thumbnail: string;
  role: string;
  phone: string;
  bio: string;
  country: string;
  city: string;
}

export function useUserProfile() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const error = ref<string | any>(null);
  const isLoading = ref(false);
  const user = ref<UserProfile>({
    fname: '',
    lname: '',
    fullName: '',
    email: '',
    thumbnail: '',
    role: '',
    phone: '',
    bio: '',
    country: '',
    city: '',
  });

  const userStore = useUserStore();

  const fetchUserProfile = async () => {
    isLoading.value = true;
    error.value = null;
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

      if (response.data.status === 'success') {
        const userData = response.data.data.user;
        const nameParts = userData.username.split(' ');

        user.value = {
          fname: nameParts[0] || '',
          lname: nameParts.slice(1).join(' ') || '',
          fullName: userData.username,
          email: userData.email || '',
          thumbnail: userData.thumbnail || '',
          role: userData.role || 'User',
          phone: userData.phone || '',
          bio: userData.bio,
          country: userData.country,
          city: userData.city,
        };
        userStore.setUserData(user.value);
        // console.log('User profile fetched successfully:', user.value);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        ElMessage({
          message: 'Session expired. Please login again.',
          type: 'error',
          duration: 5000,
          showClose: true,
        });
        logout();
        router.push({ name: 'login' });
        return;
      }
    } finally {
      // console.log('before>>', isLoading.value);
      isLoading.value = false;
      // console.log('end>>', isLoading.value);
    }
  };

  const saveUserProfile = async (profileData: any) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/users/profile',
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.status === 'success') {
        await fetchUserProfile();
        ElMessage.success('Profile updated successfully');
        return true;
      } else {
        error.value = response.data.message || 'Failed to update profile';
        ElMessage.error(error.value);
        return false;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error updating profile';
      ElMessage.error(error.value);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUserImage = async (imageUrl: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/users//profile/change-img',
        { thumbnail: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.status === 'success') {
        user.value.thumbnail = imageUrl;
        userStore.setThumbnail(imageUrl);
        ElMessage.success('Profile picture updated successfully');
        return true;
      } else {
        error.value =
          response.data.message || 'Failed to update profile picture';
        ElMessage.error(error.value);
        return false;
      }
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Error updating profile picture';
      ElMessage.error(error.value);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  return {
    user,
    isLoading,
    fetchUserProfile,
    saveUserProfile,
    updateUserImage,
  };
}
