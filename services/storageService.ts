import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

// Get storage API URL and token from environment variables
// Priority: process.env (from .env file or EAS secrets) > app.json extra > default
const STORAGE_API_URL = 
  (typeof process !== 'undefined' && process.env?.MESSAGING_API_URL) ||
  Constants.expoConfig?.extra?.messagingApiUrl || 
  'https://kinshipsync-messaging.vercel.app';
  // 'http://localhost:3000';

const STORAGE_API_TOKEN = 
  (typeof process !== 'undefined' && process.env?.MESSAGING_API_TOKEN) ||
  Constants.expoConfig?.extra?.messagingApiToken;

// Create axios instance for storage API (uses same base URL as messaging)
const storageApiClient = axios.create({
  baseURL: STORAGE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add API token to requests
storageApiClient.interceptors.request.use(
  async (config) => {
    let apiToken = STORAGE_API_TOKEN;
    
    if (!apiToken) {
      apiToken = await SecureStore.getItemAsync('messagingApiToken');
    }

    if (apiToken) {
      config.headers.Authorization = `Bearer ${apiToken}`;
      config.headers['x-api-token'] = apiToken;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
storageApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('Storage API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

interface StorageApiResponse {
  success: boolean;
  data?: {
    url: string;
    fileName?: string;
    fileSize?: number;
  };
  message?: string;
  error?: string;
}

interface FileInfo {
  name: string;
  size: number;
  mimeType?: string;
}

interface UploadFileResult {
  mediaUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}

interface UploadAvatarResult {
  avatarUrl: string;
}

interface UploadImageResult {
  imageUrl: string;
}

type ContentType = 'image' | 'file' | 'other';

/**
 * Check if storage API token is available
 */
const checkApiToken = async (): Promise<string | null> => {
  let apiToken = STORAGE_API_TOKEN;
  if (!apiToken) {
    apiToken = await SecureStore.getItemAsync('messagingApiToken');
  }
  return apiToken;
};

const handleStorageError = (error: any, details: Record<string, any>): string => {
  console.error('Storage error:', error);

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unknown error occurred while uploading the file. Please try again.';
};

const getFileInfo = async (localFileUri: string): Promise<FileInfo> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localFileUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist at the given URI.');
    }

    let name = localFileUri.split('/').pop() || 'unknown_file';
    const size = fileInfo.size; 
    let mimeType = undefined; 

    if (Platform.OS === 'web' && localFileUri.startsWith('blob:')) {
      try {
        const response = await fetch(localFileUri);
        const blob = await response.blob();
        mimeType = blob.type || undefined;
      } catch (error: unknown) {
        console.warn("Could not fetch blob to determine MIME type:", error instanceof Error ? error.message : error);
      }
    } else if (Platform.OS === 'web' && localFileUri.startsWith('data:')) {
      try {
        const parts = localFileUri.substring(0, localFileUri.indexOf(',')).split(';');
        mimeType = parts.find(part => part.includes('/'))?.split(':')[1];
      } catch(error: unknown) {
        console.warn("Could not parse data URI for MIME type:", error instanceof Error ? error.message : error);
      }
    }

    return { name, size, mimeType };
  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
};

const determineContentType = (fileName: string, mimeType?: string): ContentType => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('application/pdf') || mimeType.startsWith('text/') || mimeType.startsWith('application/msword') || mimeType.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'file';
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) return 'image';
  if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension || '')) return 'file';
  return 'other';
};

/**
 * Convert file URI to base64 data URI for API upload
 */
const uriToDataUri = async (uri: string, mimeType?: string): Promise<string> => {
  // If already a data URI, return as is
  if (uri.startsWith('data:')) {
    return uri;
  }

  // On web, handle blob URIs
  if (Platform.OS === 'web' && uri.startsWith('blob:')) {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Failed to convert blob to data URI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // On React Native, read file as base64
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Determine MIME type
    const finalMimeType = mimeType || 'application/octet-stream';
    
    // Return as data URI
    return `data:${finalMimeType};base64,${base64}`;
  } catch (error) {
    throw new Error(`Failed to read file as base64: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const uploadFile = async (
  localFileUri: string,
  conversationId: string,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadFileResult> => {
  try {
    const apiToken = await checkApiToken();
    if (!apiToken) {
      throw new Error('Storage API token is not configured. Please set MESSAGING_API_TOKEN in environment variables.');
    }

    console.log(`Starting upload for URI: ${localFileUri}`, { conversationId, userId });
    
    const { name: originalFileName, size: fileSize, mimeType } = await getFileInfo(localFileUri);

    if (!fileSize) {
      throw new Error('Could not determine file size.');
    }

    if (fileSize > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`);
    }

    const contentType = determineContentType(originalFileName, mimeType);
    if (contentType === 'other') {
      console.warn(`Uploading file of 'other' content type: ${originalFileName}`);
    }

    // Determine proper MIME type
    const properMimeType = mimeType || (contentType === 'image' ? 'image/jpeg' : 'application/octet-stream');
    
    // Convert file to base64 data URI
    if (onProgress) {
      onProgress(10); // 10% - reading file
    }
    const dataUri = await uriToDataUri(localFileUri, properMimeType);
    
    if (onProgress) {
      onProgress(50); // 50% - file read, starting upload
    }

    // Determine resource type for API
    const resourceType = contentType === 'image' ? 'image' : 'file';

    // Upload to API
    const response = await storageApiClient.post<StorageApiResponse>('/storage/upload', {
      file: dataUri,
      folder: 'chat_attachments',
      resourceType: resourceType,
    });

    if (onProgress) {
      onProgress(100); // 100% - upload complete
    }

    if (!response.data.success || !response.data.data?.url) {
      throw new Error(response.data.error || response.data.message || 'Upload failed');
    }

    console.log('File available at', response.data.data.url);

    return {
      mediaUrl: response.data.data.url,
      fileName: originalFileName,
      fileSize: fileSize,
      contentType: contentType,
    };
  } catch (error: any) {
    console.error('Error in uploadFile:', error);
    const errorMessage = handleStorageError(error, {
      conversationId,
      userId,
      fileName: localFileUri.split('/').pop(),
    });
    throw new Error(errorMessage);
  }
};

export const uploadUserAvatar = async (
  localFileUri: string,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadAvatarResult> => {
  try {
    const apiToken = await checkApiToken();
    if (!apiToken) {
      throw new Error('Storage API token is not configured. Please set MESSAGING_API_TOKEN in environment variables.');
    }
    
    const { name: originalFileName, size: fileSize, mimeType } = await getFileInfo(localFileUri);

    if (!fileSize) {
      throw new Error('Could not determine file size for avatar.');
    }
    if (fileSize > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Avatar file is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`);
    }

    const contentType = determineContentType(originalFileName, mimeType);
    
    if (contentType !== 'image') {
      throw new Error('Invalid file type for avatar. Only images are allowed.');
    }

    // Determine proper MIME type
    const properMimeType = mimeType || 'image/jpeg';
    
    // Convert file to base64 data URI
    if (onProgress) {
      onProgress(10);
    }
    const dataUri = await uriToDataUri(localFileUri, properMimeType);
    
    if (onProgress) {
      onProgress(50);
    }

    // Upload to API
    const response = await storageApiClient.post<StorageApiResponse>('/storage/upload', {
      file: dataUri,
      folder: 'profile_avatar',
      resourceType: 'image',
    });

    if (onProgress) {
      onProgress(100);
    }

    if (!response.data.success || !response.data.data?.url) {
      throw new Error(response.data.error || response.data.message || 'Avatar upload failed');
    }

    return { avatarUrl: response.data.data.url };
  } catch (error: any) {
    console.error('Error in uploadUserAvatar:', error);
    const errorMessage = handleStorageError(error, {
      userId,
      fileName: localFileUri.split('/').pop(),
    });
    throw new Error(`Avatar upload failed: ${errorMessage}`);
  }
};

export const uploadImage = async (
  localFileUri: string,
  storagePathPrefix: string,
  entityId?: string,
  onProgress?: (progress: number) => void
): Promise<UploadImageResult> => {
  try {
    const apiToken = await checkApiToken();
    if (!apiToken) {
      throw new Error('Storage API token is not configured. Please set MESSAGING_API_TOKEN in environment variables.');
    }

    console.log(`Starting generic image upload from URI: ${localFileUri} to prefix: ${storagePathPrefix}`);
    
    const { name: originalFileName, size: fileSize, mimeType } = await getFileInfo(localFileUri);

    if (!fileSize) {
      throw new Error('Could not determine file size for image.');
    }
    if (fileSize > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Image file is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`);
    }

    const contentType = determineContentType(originalFileName, mimeType);
    if (contentType !== 'image') {
      throw new Error('Invalid file type. Only images are allowed for this function.');
    }

    // Determine proper MIME type
    const properMimeType = mimeType || 'image/jpeg';
    
    // Convert file to base64 data URI
    if (onProgress) {
      onProgress(10);
    }
    const dataUri = await uriToDataUri(localFileUri, properMimeType);
    
    if (onProgress) {
      onProgress(50);
    }

    // Use storagePathPrefix as folder name (sanitize it)
    const folder = storagePathPrefix.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();

    // Upload to API
    const response = await storageApiClient.post<StorageApiResponse>('/storage/upload', {
      file: dataUri,
      folder: folder,
      resourceType: 'image',
    });

    if (onProgress) {
      onProgress(100);
    }

    if (!response.data.success || !response.data.data?.url) {
      throw new Error(response.data.error || response.data.message || 'Image upload failed');
    }

    console.log(`Image for ${storagePathPrefix} available at`, response.data.data.url);
    return { imageUrl: response.data.data.url };
  } catch (error: any) {
    console.error('Error in uploadImage:', error);
    const errorMessage = handleStorageError(error, {
      storagePathPrefix,
      entityId,
    });
    throw new Error(`Image upload failed: ${errorMessage}`);
  }
};

export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    const apiToken = await checkApiToken();
    if (!apiToken) {
      console.error('Storage API token is not configured');
      return false;
    }
    // Test by making a simple request (you might want to add a health check endpoint)
    return true;
  } catch (error) {
    console.error('Storage connection test failed:', error);
    return false;
  }
};

export default {
  uploadFile,
  uploadUserAvatar,
  uploadImage,
  testFirebaseConnection
};
