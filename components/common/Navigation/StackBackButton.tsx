import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';

interface StackBackButtonProps {
  fallbackRoute?: string;
}

export class StackBackButton extends React.Component<StackBackButtonProps> {
  public static defaultProps: Partial<StackBackButtonProps> = {
    fallbackRoute: '/home',
  };

  public render(): React.ReactNode {
    return <StackBackButtonInner fallbackRoute={this.props.fallbackRoute ?? '/home'} />;
  }
}

const StackBackButtonInner: React.FC<StackBackButtonProps> = ({ fallbackRoute = '/home' }) => {
  const { currentColors } = useAppTheme();

  const handlePress = (): void => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(fallbackRoute as never);
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

export default StackBackButton;
