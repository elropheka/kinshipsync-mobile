import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { getInitials, getAvatarColor } from '../../utils/avatarUtils';
import Fonts from '../../constants/fonts';
import { moderateScale } from '../../constants/dimensions';

interface AvatarProps {
  name?: string;
  avatarUrls?: string[];
  avatarUrl?: string; // For backward compatibility
  size?: number;
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = '?',
  avatarUrls,
  avatarUrl, // For backward compatibility
  size = moderateScale(50),
  style,
}) => {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => StyleSheet.create({
    avatarImage: {
      backgroundColor: currentColors.divider,
    },
    avatarContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    initialsText: {
      color: currentColors.primaryContrastText,
      fontWeight: Fonts.weights.bold,
      textAlign: 'center',
    },
  }), [currentColors]);

  // Support both new avatarUrls array and legacy avatarUrl prop
  const urlsToTry = avatarUrls || (avatarUrl ? [avatarUrl] : []);

  // Try each URL in priority order, skip empty/null URLs
  for (const url of urlsToTry) {
    if (url && url.trim()) {
      return (
        <Image
          source={{ uri: url }}
          style={[
            styles.avatarImage,
            { width: size, height: size, borderRadius: size / 2 },
            style,
          ]}
        />
      );
    }
  }
  const initials = getInitials(name);
  const backgroundColor = getAvatarColor(name);

  return (
    <View
      style={[
        styles.avatarContainer,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
        style,
      ]}
    >
      <Text style={[styles.initialsText, { fontSize: size * 0.4 }]}>
        {initials}
      </Text>
    </View>
  );
};
