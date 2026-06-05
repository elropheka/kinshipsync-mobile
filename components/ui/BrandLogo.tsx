import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

export type BrandLogoVariant = 'light' | 'dark';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  style?: StyleProp<ImageStyle>;
}

export class BrandLogo extends React.Component<BrandLogoProps> {
  public render(): React.ReactNode {
    const { variant = 'light', style } = this.props;
    const source =
      variant === 'dark'
        ? require('@/assets/branding/beige-see-throug-logo.png')
        : require('@/assets/branding/rusty-brown-logo.png');

    return <Image source={source} style={style} resizeMode="contain" accessibilityRole="image" />;
  }
}

export default BrandLogo;
