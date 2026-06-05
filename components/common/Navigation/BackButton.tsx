import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';

export type BackButtonContrast = 'onAccent' | 'onRust' | 'onLight';

interface BackButtonProps {
  contrast?: BackButtonContrast;
  tintColor?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ contrast = 'onLight', tintColor }) => {
  const { currentColors } = useAppTheme();

  if (!router.canGoBack()) {
    return null;
  }

  const iconColor =
    tintColor ??
    (contrast === 'onLight' ? currentColors.text : currentColors.accentContrastText);

  return (
    <Pressable
      onPress={() => router.back()}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons name="chevron-back" size={28} color={iconColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 8,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
  },
});

export default BackButton;
