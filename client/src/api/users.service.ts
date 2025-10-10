import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface User {
  _id: string;
  email: string;
  name: string;
  contactPhone: string;
  role: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  contactPhone: string;
  password: string;
  role: string;
}

export async function getUsers(role: 'admin' | 'manager'): Promise<User[]> {
  const token = localStorage.getItem('token');
  const res = await axios.get<User[]>(`${API_URL}/${role}/users`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function createUser(userData: CreateUserData) {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/admin/users`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getUserById(id: string): Promise<User> {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole') as 'admin' | 'manager' | null;

  if (!role) {
    throw new Error('Роль не найдена');
  }

  const res = await axios.get<User>(`${API_URL}/${role}/users/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
