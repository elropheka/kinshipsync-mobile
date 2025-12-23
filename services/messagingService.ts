import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// Get messaging API URL and token from environment variables
// Priority: process.env (from .env file or EAS secrets) > app.json extra > default
// Note: babel-plugin-inline-dotenv inlines .env variables at build time
const MESSAGING_API_URL = 
  (typeof process !== 'undefined' && process.env?.MESSAGING_API_URL) ||
  Constants.expoConfig?.extra?.messagingApiUrl || 
  'https://kinshipsync-messaging.vercel.app'; 
  // 'http://localhost:3000';

const MESSAGING_API_TOKEN = 
  (typeof process !== 'undefined' && process.env?.MESSAGING_API_TOKEN) ||
  Constants.expoConfig?.extra?.messagingApiToken;

// Create axios instance for messaging API
const messagingApiClient = axios.create({
  baseURL: MESSAGING_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add API token to requests
messagingApiClient.interceptors.request.use(
  async (config) => {
    // Try to get token from environment first, then from SecureStore as fallback
    let apiToken = MESSAGING_API_TOKEN;
    
    if (!apiToken) {
      apiToken = await SecureStore.getItemAsync('messagingApiToken');
    }

    if (apiToken) {
      config.headers.Authorization = `Bearer ${apiToken}`;
      // Also set x-api-token header as alternative (messaging service supports both)
      config.headers['x-api-token'] = apiToken;
    }
    // Note: We don't warn here anymore since individual functions check for token before making requests

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
messagingApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('Messaging API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
}

export interface SendTextParams {
  to: string;
  message: string;
  from?: string;
}

export interface SendPushParams {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  badge?: number;
  sound?: string;
  priority?: 'high' | 'normal';
}

export interface MessagingApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Check if messaging API token is available
 */
const checkApiToken = async (): Promise<string | null> => {
  let apiToken = MESSAGING_API_TOKEN;
  if (!apiToken) {
    apiToken = await SecureStore.getItemAsync('messagingApiToken');
  }
  return apiToken;
};

/**
 * Send email via messaging API
 */
export const sendEmail = async (params: SendEmailParams): Promise<MessagingApiResponse<any>> => {
  try {
    const apiToken = await checkApiToken();
    if (!apiToken) {
      const errorMessage = 'Messaging API token is not configured. Please set MESSAGING_API_TOKEN in environment variables or use setMessagingApiToken() to configure it.';
      console.error('❌', errorMessage);
      return {
        success: false,
        error: 'Unauthorized',
        message: errorMessage,
      };
    }

    const response = await messagingApiClient.post<MessagingApiResponse<any>>('/email', params);
    return response.data;
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to send email',
      message: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Send text message (SMS) via messaging API
 */
export const sendText = async (params: SendTextParams): Promise<MessagingApiResponse<any>> => {
  try {
    const apiToken = await checkApiToken();
    if (!apiToken) {
      const errorMessage = 'Messaging API token is not configured. Please set MESSAGING_API_TOKEN in environment variables or use setMessagingApiToken() to configure it.';
      console.error('❌', errorMessage);
      return {
        success: false,
        error: 'Unauthorized',
        message: errorMessage,
      };
    }

    const response = await messagingApiClient.post<MessagingApiResponse<any>>('/text', params);
    return response.data;
  } catch (error: any) {
    console.error('Error sending text:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to send text message',
      message: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Send push notification via messaging API
 */
export const sendPush = async (params: SendPushParams): Promise<MessagingApiResponse<any>> => {
  try {
    const apiToken = await checkApiToken();
    if (!apiToken) {
      const errorMessage = 'Messaging API token is not configured. Please set MESSAGING_API_TOKEN in environment variables or use setMessagingApiToken() to configure it.';
      console.error('❌', errorMessage);
      return {
        success: false,
        error: 'Unauthorized',
        message: errorMessage,
      };
    }

    const response = await messagingApiClient.post<MessagingApiResponse<any>>('/push', params);
    return response.data;
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to send push notification',
      message: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Set the messaging API token in SecureStore
 * This can be called at app initialization or when the token is obtained
 */
export const setMessagingApiToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync('messagingApiToken', token);
  console.log('✅ Messaging API token stored in SecureStore');
};

/**
 * Get the messaging API token from SecureStore
 */
export const getMessagingApiToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('messagingApiToken');
};

/**
 * Remove the messaging API token from SecureStore
 */
export const removeMessagingApiToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('messagingApiToken');
  console.log('✅ Messaging API token removed from SecureStore');
};

export default messagingApiClient;
