import axios from 'axios';
import type { User } from '../types/user';
import { useAuth } from '../composables/useAuth';

const API_BASE = 'http://localhost:5000/users';

const getAuthHeaders = () => {
  const { getToken } = useAuth();
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const fetchAllUsers = async (
  page: number,
  limit: number,
  search: string,
  role = 'USER',
) => {
  const { data } = await axios.get(`${API_BASE}/`, {
    headers: getAuthHeaders(),
    params: { page, limit, search, role },
  });
  return data.data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const { data } = await axios.get(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
  console.log(data.data.user);
  return data.data.user;
};
export const deleteCustomer = async (id: string) => {
  await axios.delete(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
};
