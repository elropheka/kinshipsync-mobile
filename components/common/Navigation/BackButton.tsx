import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';

export type BackButtonContrast = 'onAccent' | 'onRust' | 'onLight';

interface BackButtonProps {
  contrast?: BackButtonContrast;
  tintColor?: string;
  fallbackRoute?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  contrast = 'onLight',
  tintColor,
  fallbackRoute = '/home',
}) => {
  const { currentColors } = useAppTheme();

  const canNavigateBack = router.canGoBack() || Boolean(fallbackRoute);
  if (!canNavigateBack) {
    return null;
  }

  const iconColor =
    tintColor ??
    (contrast === 'onLight' ? currentColors.text : currentColors.accentContrastText);

  const handlePress = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (fallbackRoute) {
      router.replace(fallbackRoute as never);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
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
