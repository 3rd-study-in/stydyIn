import axios from 'axios';
import { BASE_URL } from '../constants/api';
import useAuthStore from '../stores/authStore';

const axiosInstance = axios.create({ baseURL: BASE_URL });

// 요청 인터셉터 — 모든 요청에 Authorization 헤더 자동 주입
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
