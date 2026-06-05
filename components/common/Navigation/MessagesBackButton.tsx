import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';

export class MessagesBackButton extends React.Component {
  public render(): React.ReactNode {
    return <MessagesBackButtonInner />;
  }
}

const MessagesBackButtonInner: React.FC = () => {
  const { currentColors } = useAppTheme();

  const handlePress = (): void => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/home');
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons name="chevron-back" size={28} color={currentColors.accentContrastText} />
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

export default MessagesBackButton;
