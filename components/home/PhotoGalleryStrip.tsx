import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import { BrandText } from '@/components/ui/BrandText';
import { MockGalleryPhoto, mockGalleryPhotos } from '@/constants/mock/homeDashboard';

interface PhotoGalleryStripProps {
  photos?: MockGalleryPhoto[];
}

export class PhotoGalleryStrip extends React.Component<PhotoGalleryStripProps> {
  public render(): React.ReactNode {
    return <PhotoGalleryStripInner {...this.props} />;
  }
}

const PhotoGalleryStripInner: React.FC<PhotoGalleryStripProps> = ({
  photos = mockGalleryPhotos,
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  return (
    <View style={styles.section}>
      <BrandText variant="h4" style={styles.title}>
        Photo Gallery
      </BrandText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
        {photos.map((photo) => (
          <View key={photo.id} style={styles.photoCard}>
            <Image source={{ uri: photo.uri }} style={styles.photo} />
            <BrandText variant="caption" color="secondary" style={styles.caption}>
              {photo.caption}
            </BrandText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    section: {
      marginBottom: Spacing.xl,
    },
    title: {
      marginBottom: Spacing.s,
    },
    strip: {
      gap: Spacing.s,
      paddingRight: Spacing.m,
    },
    photoCard: {
      width: 140,
    },
    photo: {
      width: 140,
      height: 100,
      borderRadius: BorderRadius.l,
      backgroundColor: theme.border,
    },
    caption: {
      marginTop: Spacing.xs,
    },
  });

export default PhotoGalleryStrip;
