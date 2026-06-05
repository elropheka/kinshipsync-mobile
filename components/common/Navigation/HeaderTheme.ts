import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ColorPalette } from '@/constants/Colors';
import { HeaderButtonItems } from './HeaderButtonItems';

type ThemeColors = ColorPalette;

export type HeaderSurface = 'accent' | 'rust' | 'light';

export class HeaderTheme {
  public static screenOptions(
    currentColors: ThemeColors,
    surface: HeaderSurface = 'light',
  ): NativeStackNavigationOptions {
    switch (surface) {
      case 'accent':
        return this.accentOptions(currentColors);
      case 'rust':
        return this.rustOptions(currentColors);
      default:
        return this.lightOptions(currentColors);
    }
  }

  public static tabAccentOptions(currentColors: ThemeColors): BottomTabNavigationOptions {
    return {
      headerStyle: { backgroundColor: currentColors.accent },
      headerTintColor: currentColors.accentContrastText,
      headerTitleStyle: {
        color: currentColors.accentContrastText,
        fontFamily: 'Inter-SemiBold',
      },
      headerShadowVisible: false,
    };
  }

  public static accentOptions(currentColors: ThemeColors): NativeStackNavigationOptions {
    return {
      ...this.coloredHeaderBase(currentColors, currentColors.accent, 'onAccent'),
    };
  }

  public static rustOptions(currentColors: ThemeColors): NativeStackNavigationOptions {
    return {
      ...this.coloredHeaderBase(currentColors, currentColors.secondary, 'onRust'),
    };
  }

  public static lightOptions(currentColors: ThemeColors): NativeStackNavigationOptions {
    return {
      headerStyle: { backgroundColor: currentColors.backgroundPrimary },
      headerTintColor: currentColors.text,
      headerTitleStyle: {
        color: currentColors.text,
        fontFamily: 'Inter-SemiBold',
      },
      ...HeaderButtonItems.headerLeftBackOptions(currentColors.text, 'onLight'),
    };
  }

  private static coloredHeaderBase(
    currentColors: ThemeColors,
    backgroundColor: string,
    contrast: 'onAccent' | 'onRust',
  ): NativeStackNavigationOptions {
    const tint = currentColors.accentContrastText;

    return {
      headerStyle: { backgroundColor },
      headerTintColor: tint,
      headerTitleStyle: {
        color: tint,
        fontFamily: 'Inter-SemiBold',
      },
      headerShadowVisible: false,
      ...HeaderButtonItems.headerLeftBackOptions(tint, contrast),
    };
  }
}
