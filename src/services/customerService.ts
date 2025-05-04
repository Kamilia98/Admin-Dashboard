import axios from 'axios';
import type { User } from '../types/user';

const API_BASE = 'http://localhost:5000/users';

export const fetchAllUsers = async (params: any) => {
  const { data } = await axios.get(`${API_BASE}/`, { params });
  return data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const { data } = await axios.get(`${API_BASE}/${id}`);
  return data.data;
};
