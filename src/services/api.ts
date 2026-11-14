
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import { authStorage } from './storage/authStorage';
import { store } from '../store';
import { logout } from '../store/feature/auth/authSlice';

const BASE_URL = 'http://192.168.1.3:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Separate Axios instance to prevent refresh interceptor loops.
const refreshApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

interface CustomAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

// Prevent multiple simultaneous refresh requests.
let refreshPromise: Promise<string> | null = null;

// Attach access token to every request.
api.interceptors.request.use(async config => {
  if (config.skipAuth) {
    config.headers.delete('Authorization');
    return config;
  }

  const token = await authStorage.getAccessToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.headers.delete('Authorization');
  }

  return config;
});

// Handle unauthorized responses.
api.interceptors.response.use(
  response => response,

  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await authStorage.clear();

      store.dispatch(logout());
    }

    return Promise.reject(error);
  },
);

export default api;
