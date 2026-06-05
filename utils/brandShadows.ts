import { ViewStyle } from 'react-native';
import { brandShadows as shadowTokens } from '@/constants/brandTokens';

type ShadowSize = keyof typeof shadowTokens;

export class BrandShadowHelper {
  public static resolve(size: ShadowSize = 'md'): ViewStyle {
    const opacityMap: Record<ShadowSize, number> = {
      sm: 0.08,
      md: 0.12,
      lg: 0.16,
    };

    const radiusMap: Record<ShadowSize, number> = {
      sm: 8,
      md: 24,
      lg: 40,
    };

    const offsetMap: Record<ShadowSize, number> = {
      sm: 2,
      md: 8,
      lg: 16,
    };

    return {
      shadowColor: '#5D2413',
      shadowOffset: { width: 0, height: offsetMap[size] },
      shadowOpacity: opacityMap[size],
      shadowRadius: radiusMap[size],
      elevation: size === 'sm' ? 2 : size === 'md' ? 4 : 8,
    };
  }
}
