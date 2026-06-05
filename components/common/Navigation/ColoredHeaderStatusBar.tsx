import React from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/context/AppThemeContext';

export type StatusBarContentStyle = 'light' | 'dark';

interface ColoredHeaderStatusBarProps {
  backgroundColor?: string;
  contentStyle?: StatusBarContentStyle;
}

export class ColoredHeaderStatusBar extends React.Component<ColoredHeaderStatusBarProps> {
  public render(): React.ReactNode {
    return <ColoredHeaderStatusBarInner {...this.props} />;
  }
}

const ColoredHeaderStatusBarInner: React.FC<ColoredHeaderStatusBarProps> = ({
  backgroundColor,
  contentStyle = 'light',
}) => {
  const { currentColors } = useAppTheme();
  const bg = backgroundColor ?? currentColors.accent;

  return (
    <StatusBar
      style={contentStyle}
      backgroundColor={Platform.OS === 'android' ? bg : undefined}
      translucent={Platform.OS === 'android' ? false : undefined}
    />
  );
};

export default ColoredHeaderStatusBar;
