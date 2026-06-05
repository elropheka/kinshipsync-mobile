import React from 'react';
import { StatusBar } from 'expo-status-bar';

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
  contentStyle = 'light',
}) => (
  <StatusBar style={contentStyle} />
);

