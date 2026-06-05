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

  /** Tab screens pushed from sidebar (subscription, delete account) need a back affordance. */
  public static tabPushedScreenOptions(
    currentColors: ThemeColors,
    fallbackRoute: string = '/home',
  ): BottomTabNavigationOptions {
    return {
      headerShown: true,
      ...this.tabAccentOptions(currentColors),
      ...HeaderButtonItems.headerLeftBackOptions(
        currentColors.accentContrastText,
        'onAccent',
        fallbackRoute,
      ),
    };
  }

  public static accentOptions(
    currentColors: ThemeColors,
    fallbackRoute: string = '/home',
  ): NativeStackNavigationOptions {
    return {
      ...this.coloredHeaderBase(currentColors, currentColors.accent, 'onAccent', fallbackRoute),
    };
  }

  public static rustOptions(
    currentColors: ThemeColors,
    fallbackRoute: string = '/home',
  ): NativeStackNavigationOptions {
    return {
      ...this.coloredHeaderBase(currentColors, currentColors.secondary, 'onRust', fallbackRoute),
    };
  }

  /** Rust header styling without back affordance — use with explicit StackBackButton. */
  public static rustSurfaceOptions(currentColors: ThemeColors): NativeStackNavigationOptions {
    return this.coloredHeaderSurface(currentColors, currentColors.secondary);
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

  private static coloredHeaderSurface(
    currentColors: ThemeColors,
    backgroundColor: string,
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
    };
  }

  private static coloredHeaderBase(
    currentColors: ThemeColors,
    backgroundColor: string,
    contrast: 'onAccent' | 'onRust',
    fallbackRoute: string = '/home',
  ): NativeStackNavigationOptions {
    return {
      ...this.coloredHeaderSurface(currentColors, backgroundColor),
      ...HeaderButtonItems.headerLeftBackOptions(
        currentColors.accentContrastText,
        contrast,
        fallbackRoute,
      ),
    };
  }
}
