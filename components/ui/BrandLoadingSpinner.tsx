import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';

type BrandLoadingSpinnerSize = 'small' | 'large';

interface BrandLoadingSpinnerProps {
  size?: BrandLoadingSpinnerSize;
  style?: ViewStyle;
}

const SIZE_MAP: Record<BrandLoadingSpinnerSize, { width: number; height: number }> = {
  small: { width: 80, height: 28 },
  large: { width: 220, height: 72 },
};

export class BrandLoadingSpinner extends React.Component<BrandLoadingSpinnerProps> {
  public render(): React.ReactNode {
    return <BrandLoadingSpinnerInner {...this.props} />;
  }
}

const BrandLoadingSpinnerInner: React.FC<BrandLoadingSpinnerProps> = ({
  size = 'large',
  style,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const dimensions = SIZE_MAP[size];

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [spinAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.Image
        source={require('@/assets/branding/rusty-brown-logo.png')}
        style={[
          styles.logo,
          { width: dimensions.width, height: dimensions.height, transform: [{ rotate }] },
        ]}
        resizeMode="contain"
        accessibilityLabel="Loading"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {},
});

export default BrandLoadingSpinner;
