import axios from 'axios';
import type { User } from '../types/user';

const API_BASE = 'http://localhost:5000/users';

export const fetchAllUsers = async (params: any) => {
  const { data } = await axios.get(`${API_BASE}/`, { params });
  return data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_BASE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  console.log(data.data.user);
  return data.data.user;
};
