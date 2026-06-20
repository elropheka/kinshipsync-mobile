import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { BrandLoadingSpinner } from '@/components/ui/BrandLoadingSpinner';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/services/storageService';
import { EventCoverImage } from '@/components/events/EventCoverImage';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAlert } from '@/context/AlertContext';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import Fonts from '@/constants/fonts';

export interface VendorItemImagePickerProps {
  imageUrl?: string;
  onImageUrlChange: (url: string) => void;
  vendorId?: string;
  disabled?: boolean;
}

const VendorItemImagePickerInner: React.FC<VendorItemImagePickerProps> = ({
  imageUrl,
  onImageUrlChange,
  vendorId,
  disabled = false,
}) => {
  const { currentColors } = useAppTheme();
  const { showError, showInfo } = useAlert();
  const [isUploading, setIsUploading] = useState(false);
  const styles = useMemo(() => createStyles(currentColors), [currentColors]);

  const handlePickImage = async (): Promise<void> => {
    if (disabled || isUploading) {
      return;
    }

    if (!vendorId) {
      showError('Upload Unavailable', 'Vendor profile is required before uploading an image.');
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      showError('Permission Required', 'Permission to access the photo library is required.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (pickerResult.canceled || !pickerResult.assets?.length) {
      return;
    }

    const imageUri = pickerResult.assets[0].uri;
    setIsUploading(true);
    try {
      const uploadResult = await uploadImage(imageUri, 'vendor_items', vendorId);
      onImageUrlChange(uploadResult.imageUrl);
      showInfo('Image Uploaded', 'Item image has been updated.');
    } catch (uploadError: unknown) {
      const message = uploadError instanceof Error ? uploadError.message : 'Unknown error';
      console.error('Vendor item image upload failed:', uploadError);
      showError('Upload Failed', `Could not upload item image: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (): void => {
    if (disabled || isUploading) {
      return;
    }
    onImageUrlChange('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Image (Optional)</Text>
      <EventCoverImage imageUrl={imageUrl} contained style={styles.previewImage} />
      <TouchableOpacity
        style={[styles.uploadButton, (disabled || isUploading) && styles.uploadButtonDisabled]}
        onPress={handlePickImage}
        disabled={disabled || isUploading}
      >
        {isUploading ? (
          <BrandLoadingSpinner size="small" />
        ) : (
          <Text style={styles.uploadButtonText}>
            {imageUrl ? 'Change Item Image' : 'Add Item Image'}
          </Text>
        )}
      </TouchableOpacity>
      {imageUrl ? (
        <TouchableOpacity
          style={[styles.uploadButton, styles.removeButton, (disabled || isUploading) && styles.uploadButtonDisabled]}
          onPress={handleRemoveImage}
          disabled={disabled || isUploading}
        >
          <Text style={[styles.uploadButtonText, styles.removeButtonText]}>Remove Image</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export class VendorItemImagePicker extends React.Component<VendorItemImagePickerProps> {
  public render(): React.ReactNode {
    return <VendorItemImagePickerInner {...this.props} />;
  }
}

const createStyles = (theme: ReturnType<typeof useAppTheme>['currentColors']) =>
  StyleSheet.create({
    container: {
      marginBottom: Spacing.m,
    },
    label: {
      fontSize: 16,
      color: theme.text,
      marginBottom: Spacing.s,
      fontWeight: '500',
      fontFamily: Fonts.titleSemiBold,
    },
    previewImage: {
      borderRadius: BorderRadius.m,
      marginBottom: Spacing.s,
      backgroundColor: theme.backgroundSecondary,
    },
    uploadButton: {
      backgroundColor: theme.accent,
      borderRadius: BorderRadius.m,
      paddingVertical: Spacing.s,
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    uploadButtonDisabled: {
      opacity: 0.6,
    },
    uploadButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
      fontFamily: Fonts.titleSemiBold,
    },
    removeButton: {
      backgroundColor: theme.backgroundPaper,
      borderWidth: 1,
      borderColor: theme.error,
    },
    removeButtonText: {
      color: theme.error,
    },
  });

export default VendorItemImagePicker;
