import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { getApiErrorMessage } from '@/utils/errorUtils';

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
  async (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response) {
      const { status } = error.response;
      const errorMessage = getApiErrorMessage(error);

      if (status === 401) {
        await SecureStore.deleteItemAsync('authToken');
        router.replace('/(auth)/signIn');
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
