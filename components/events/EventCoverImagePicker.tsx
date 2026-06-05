import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/services/storageService';
import { EventCoverImage } from '@/components/events/EventCoverImage';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAlert } from '@/context/AlertContext';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import Fonts from '@/constants/fonts';

export interface EventCoverImagePickerProps {
  coverImageUrl?: string;
  onCoverImageUrlChange: (url: string) => void;
  eventId?: string;
  organizerId?: string;
  disabled?: boolean;
}

const EventCoverImagePickerInner: React.FC<EventCoverImagePickerProps> = ({
  coverImageUrl,
  onCoverImageUrlChange,
  eventId,
  organizerId,
  disabled = false,
}) => {
  const { currentColors } = useAppTheme();
  const { showError, showInfo } = useAlert();
  const [isUploading, setIsUploading] = useState(false);
  const styles = useMemo(() => createStyles(currentColors), [currentColors]);

  const handlePickCoverImage = async (): Promise<void> => {
    if (disabled || isUploading) {
      return;
    }

    const entityId = eventId ?? organizerId;
    if (!entityId) {
      showError('Upload Unavailable', 'Sign in is required before uploading a cover image.');
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
      aspect: [16, 9],
      quality: 0.8,
    });

    if (pickerResult.canceled || !pickerResult.assets?.length) {
      return;
    }

    const imageUri = pickerResult.assets[0].uri;
    setIsUploading(true);
    try {
      const uploadResult = await uploadImage(imageUri, 'event_covers', entityId);
      onCoverImageUrlChange(uploadResult.imageUrl);
      showInfo('Image Uploaded', 'Cover image has been updated.');
    } catch (uploadError: unknown) {
      const message = uploadError instanceof Error ? uploadError.message : 'Unknown error';
      console.error('Cover image upload failed:', uploadError);
      showError('Upload Failed', `Could not upload cover image: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCoverImage = (): void => {
    if (disabled || isUploading) {
      return;
    }
    onCoverImageUrlChange('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cover Image (Optional)</Text>
      <EventCoverImage imageUrl={coverImageUrl} contained style={styles.previewImage} />
      <TouchableOpacity
        style={[styles.uploadButton, (disabled || isUploading) && styles.uploadButtonDisabled]}
        onPress={handlePickCoverImage}
        disabled={disabled || isUploading}
      >
        {isUploading ? (
          <ActivityIndicator size="small" color={currentColors.primaryContrastText} />
        ) : (
          <Text style={styles.uploadButtonText}>
            {coverImageUrl ? 'Change Cover Image' : 'Add Cover Image'}
          </Text>
        )}
      </TouchableOpacity>
      {coverImageUrl ? (
        <TouchableOpacity
          style={[styles.uploadButton, styles.removeButton, (disabled || isUploading) && styles.uploadButtonDisabled]}
          onPress={handleRemoveCoverImage}
          disabled={disabled || isUploading}
        >
          <Text style={[styles.uploadButtonText, styles.removeButtonText]}>Remove Image</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export class EventCoverImagePicker extends React.Component<EventCoverImagePickerProps> {
  public render(): React.ReactNode {
    return <EventCoverImagePickerInner {...this.props} />;
  }
}

const createStyles = (theme: ReturnType<typeof useAppTheme>['currentColors']) =>
  StyleSheet.create({
    container: {
      marginBottom: Spacing.m,
    },
    label: {
      fontSize: 16,
      color: theme.textDarkContrast,
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
      backgroundColor: theme.buttonPrimary,
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
      color: theme.primaryContrastText,
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
