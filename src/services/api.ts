import axios from 'axios';
import { authStorage } from './storage/authStorage';

const api = axios.create({
  baseURL: 'http://192.168.1.3:8080/api',
  timeout: 15000,
});

api.interceptors.request.use(async config => {
  if (config.skipAuth) {
    delete config.headers.Authorization;
    return config;
  }

  const token = await authStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;