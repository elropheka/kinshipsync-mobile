import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

const PROD_API_URL = 'https://kinshipsync.vercel.app/api/v1';
const DEV_API_URL = 'http://localhost:5001/api/v1';

const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response) {
      const { data, status } = error.response;
      let errorMessage = 'An unexpected error occurred.';

      if (status === 401 || status === 400) {
        errorMessage = (data as any)?.message || 'Authentication failed. Please log in again.';
       router.replace('/(auth)/signIn'); 
      } else if (status === 403) {
        errorMessage = "You don't have permission to access this resource.";
      } else if (status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (status >= 500) {
        errorMessage = 'A server error occurred. Please try again later.';
      } else if (data && typeof (data as any).message === 'string') {
        errorMessage = (data as any).message;
      } else if (typeof data === 'string' && data.length > 0 && data.length < 100) {
        errorMessage = data;
      }

      Toast.show({
        type: 'error',
        text1: `Error ${status || ''}`,
        text2: errorMessage,
        position: 'bottom',
      });
    } else if (error.request) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Could not connect to the server. Please check your internet connection.',
        position: 'bottom',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'An unknown error occurred.',
        position: 'bottom',
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
