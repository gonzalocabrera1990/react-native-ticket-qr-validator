import axios from 'axios';
import { CONFIG } from '../constants/Config';
import * as SecureStore from 'expo-secure-store';

// Interfaces para tipado de respuestas
export interface LoginResponse {
  status: string;
  token: string;
  username: string;
}

export interface ValidateQRResponse {
  status: string;
  mensaje?: string;
  detalle?: string;
  sector?: string;
  razon?: string;
}

const api = axios.create({
  baseURL: CONFIG.BASE_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funciones de API centralizadas
export const authApi = {
  login: (username: string, password: string) => 
    api.post<LoginResponse>('/api/login/', { username, password }),
};

export const qrApi = {
  validarQR: (uuid: string, modo: 'check_in' | 'read_only') => 
    api.post<ValidateQRResponse>('/api/validar-qr/', { uuid, modo }),
};

export default api;
