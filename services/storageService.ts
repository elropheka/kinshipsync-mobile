// storageService.ts
import { ref, uploadBytesResumable, getDownloadURL, StorageError } from '@firebase/storage';
import * as FileSystem from 'expo-file-system';
import { storage } from './firebaseConfig';
import { Platform } from 'react-native';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

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

// Verify storage is initialized
const verifyStorageInitialized = (): void => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized. Check your Firebase configuration.');
  }
};

// Enhanced error handling
const handleStorageError = (error: StorageError, details: Record<string, any>): string => {
  console.error('=== STORAGE ERROR DEBUG ===');
  console.error('Error Code:', error.code);
  console.error('Error Message:', error.message);
  console.error('Error Name:', error.name);
  console.error('Server Response:', error.serverResponse);
  console.error('Error Stack:', error.stack);
  console.error('Operation Details:', JSON.stringify(details, null, 2));
  console.error('=== END STORAGE ERROR DEBUG ===');

  switch (error.code) {
    case 'storage/unauthorized':
      return 'You do not have permission to perform this operation. Please try again or contact support.';
    case 'storage/canceled':
      return 'Operation was canceled. Please try again.';
    case 'storage/retry-limit-exceeded':
      return 'Network timeout. Please check your connection and try again.';
    case 'storage/invalid-checksum':
      return 'File integrity check failed. Please try again.';
    case 'storage/server-file-wrong-size':
      return 'File size mismatch. Please try again.';
    case 'storage/unknown':
      const serverMsg = error.serverResponse ? 
        `Server response: ${JSON.stringify(error.serverResponse)}` : 
        'No server response available - this usually indicates a configuration issue';
      return `Unknown storage error occurred. ${serverMsg}. Check Firebase console for more details.`;
    default:
      return `Operation failed: ${error.message || 'An unknown error occurred'}. Please try again.`;
  }
};

// Helper function to get file info
const getFileInfo = async (localFileUri: string): Promise<FileInfo> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localFileUri, { size: true });
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
        // Note: blob.name is not standard, using original name
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

// Helper function to determine content type
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

// MAIN UPLOAD FUNCTIONS

export const uploadFile = async (
  localFileUri: string,
  conversationId: string,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadFileResult> => {
  try {
    verifyStorageInitialized();
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

    const timestamp = new Date().getTime();
    const uniqueFileName = `${timestamp}_${originalFileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `chat_attachments/${uniqueFileName}`;
    const metadata = {
      customMetadata: {
        uploadedBy: userId,
        conversationId,
        originalFileName,
        uploadTimestamp: new Date().toISOString()
      }
    };
    const fileRef = ref(storage, storagePath);

    console.log(`Uploading to: ${storagePath}`, { fileSize, contentType });

    const response = await fetch(localFileUri);
    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, blob, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error: StorageError) => {
          const errorMessage = handleStorageError(error, {
            storagePath,
            fileSize,
            contentType,
            conversationId,
            userId
          });
          reject(new Error(errorMessage));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            resolve({
              mediaUrl: downloadURL,
              fileName: originalFileName,
              fileSize: fileSize,
              contentType: contentType,
            });
          } catch (error: unknown) {
            console.error('Failed to get download URL:', error);
            reject(error instanceof Error ? error : new Error('Failed to get download URL'));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
};

export const uploadUserAvatar = async (
  localFileUri: string,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadAvatarResult> => {
  try {
    verifyStorageInitialized();
    console.log(`=== AVATAR UPLOAD START ===`);
    console.log(`Starting avatar upload for user ${userId} from URI: ${localFileUri}`);
    
    const { name: originalFileName, size: fileSize, mimeType } = await getFileInfo(localFileUri);
    console.log('File Info:', { originalFileName, fileSize, mimeType });

    if (!fileSize) {
      throw new Error('Could not determine file size for avatar.');
    }
    if (fileSize > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Avatar file is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`);
    }

    const contentType = determineContentType(originalFileName, mimeType);
    console.log('Determined content type:', contentType);
    
    if (contentType !== 'image') {
      throw new Error('Invalid file type for avatar. Only images are allowed.');
    }

    const timestamp = new Date().getTime();
    const uniqueFileName = `${timestamp}_${originalFileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `profile_avatar/${uniqueFileName}`; 
    
    console.log('Storage path:', storagePath);
    console.log('Unique filename:', uniqueFileName);
    
    const metadata = {
      customMetadata: {
        uploadedBy: userId,
        originalFileName,
        uploadTimestamp: new Date().toISOString()
      }
    };
    const fileRef = ref(storage, storagePath);
    console.log('File reference created:', fileRef.fullPath);

    console.log(`Uploading avatar to: ${storagePath}`);

    const response = await fetch(localFileUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    console.log('Blob created:', {
      size: blob.size,
      type: blob.type
    });

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, blob, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Avatar upload progress: ${progress.toFixed(2)}% (${snapshot.bytesTransferred}/${snapshot.totalBytes} bytes)`);
          console.log('Upload state:', snapshot.state);
          
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error: StorageError) => {
          console.error('=== AVATAR UPLOAD FAILED ===');
          const errorDetails = {
            storagePath,
            fileSize,
            contentType,
            userId,
            fileName: uniqueFileName,
            timestamp,
            blobSize: blob.size,
            blobType: blob.type
          };
          
          const userFriendlyMessage = handleStorageError(error, errorDetails);
          reject(new Error(`Avatar upload failed: ${userFriendlyMessage}`));
        },
        async () => {
          try {
            console.log('Avatar upload completed, getting download URL...');
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Avatar available at', downloadURL);
            console.log('=== AVATAR UPLOAD SUCCESS ===');
            
            resolve({ avatarUrl: downloadURL });
          } catch (error: unknown) {
            console.error('Failed to get avatar download URL:', error);
            reject(new Error(`Avatar upload completed but failed to get download URL: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('=== AVATAR UPLOAD ERROR ===');
    console.error('Error in uploadUserAvatar:', error);
    throw error;
  }
};

export const uploadImage = async (
  localFileUri: string,
  storagePathPrefix: string,
  entityId?: string,
  onProgress?: (progress: number) => void
): Promise<UploadImageResult> => {
  try {
    verifyStorageInitialized();
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

    const timestamp = new Date().getTime();
    const uniqueFileName = `${timestamp}_${originalFileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `${storagePathPrefix}/${uniqueFileName}`;
    
    const metadata = {
      customMetadata: {
        uploadedBy: entityId || 'unknown',
        storagePathPrefix,
        originalFileName,
        uploadTimestamp: new Date().toISOString()
      }
    };
    const fileRef = ref(storage, storagePath);

    console.log(`Uploading image to: ${storagePath}`);

    const response = await fetch(localFileUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, blob, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Image upload to ${storagePathPrefix} is ${progress}% done`);
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error: StorageError) => {
          console.error(`Image upload to ${storagePathPrefix} failed:`, error);
          const errorDetails = {
            storagePath,
            fileSize,
            contentType,
            storagePathPrefix,
            entityId
          };
          
          const userFriendlyMessage = handleStorageError(error, errorDetails);
          reject(new Error(`Image upload failed: ${userFriendlyMessage}`));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(`Image for ${storagePathPrefix} available at`, downloadURL);
            resolve({ imageUrl: downloadURL });
          } catch (error: unknown) {
            console.error(`Failed to get image download URL for ${storagePathPrefix}:`, error);
            reject(error instanceof Error ? error : new Error('Failed to get image download URL'));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
};

// Test functions for debugging
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    console.log('=== FIREBASE CONNECTION TEST ===');
    console.log('Storage instance exists:', !!storage);
    console.log('Storage app:', storage?.app?.name);
    
    const testRef = ref(storage, 'test/connection');
    console.log('Test reference created:', testRef.fullPath);
    console.log('=== CONNECTION TEST PASSED ===');
    return true;
  } catch (error) {
    console.error('=== CONNECTION TEST FAILED ===');
    console.error('Error:', error);
    return false;
  }
};

// Default export (optional, for backward compatibility)
export default {
  uploadFile,
  uploadUserAvatar,
  uploadImage,
  testFirebaseConnection
};
