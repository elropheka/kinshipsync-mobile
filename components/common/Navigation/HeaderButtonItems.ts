import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { NativeStackHeaderItem } from '@react-navigation/native-stack';
import BackButton, { type BackButtonContrast } from './BackButton';

type IconName = keyof typeof Ionicons.glyphMap;

export class HeaderButtonItems {
  public static createBackButtonItems(
    tintColor?: string,
    fallbackRoute: string = '/home',
  ): NativeStackHeaderItem[] {
    if (!router.canGoBack() && !fallbackRoute) {
      return [];
    }

    return [
      {
        type: 'button',
        label: 'Back',
        icon: { type: 'sfSymbol', name: 'chevron.left' },
        tintColor: tintColor ?? '#FFFFFF',
        hidesSharedBackground: true,
        variant: 'plain',
        onPress: () => {
          if (router.canGoBack()) {
            router.back();
          } else if (fallbackRoute) {
            router.replace(fallbackRoute as never);
          }
        },
        accessibilityLabel: 'Go back',
      },
    ];
  }

  public static createIconButtonItem(params: {
    label: string;
    sfSymbol: string;
    onPress: () => void;
    tintColor?: string;
  }): NativeStackHeaderItem {
    return {
      type: 'button',
      label: params.label,
      icon: { type: 'sfSymbol', name: params.sfSymbol as never },
      tintColor: params.tintColor ?? '#FFFFFF',
      hidesSharedBackground: true,
      variant: 'plain',
      onPress: params.onPress,
    };
  }

  public static headerLeftBackOptions(
    tintColor: string,
    contrast: BackButtonContrast = 'onAccent',
    fallbackRoute: string = '/home',
  ): {
    unstable_headerLeftItems?: () => NativeStackHeaderItem[];
    headerLeft?: () => React.ReactNode;
    headerBackVisible: false;
  } {
    const backButton = () =>
      React.createElement(BackButton, { contrast, tintColor, fallbackRoute });

    if (Platform.OS === 'ios') {
      return {
        unstable_headerLeftItems: () =>
          this.createBackButtonItems(tintColor, fallbackRoute),
        headerLeft: backButton,
        headerBackVisible: false,
      };
    }

    return {
      headerLeft: backButton,
      headerBackVisible: false,
    };
  }

  public static headerRightActionsOptions(
    tintColor: string,
    actions: Array<{
      label: string;
      sfSymbol: string;
      ionicon: IconName;
      onPress: () => void;
      size?: number;
    }>,
  ): {
    unstable_headerRightItems?: () => NativeStackHeaderItem[];
    headerRight?: () => React.ReactNode;
  } {
    if (actions.length === 0) {
      return {};
    }

    if (Platform.OS === 'ios') {
      return {
        unstable_headerRightItems: () =>
          actions.map((action) =>
            this.createIconButtonItem({
              label: action.label,
              sfSymbol: action.sfSymbol,
              onPress: action.onPress,
              tintColor,
            }),
          ),
      };
    }

    return {
      headerRight: () =>
        React.createElement(
          View,
          { style: { flexDirection: 'row', alignItems: 'center' } },
          ...actions.map((action) =>
            React.createElement(HeaderIconButtonInner, {
              key: action.label,
              name: action.ionicon,
              onPress: action.onPress,
              tintColor,
              size: action.size ?? 24,
            }),
          ),
        ),
    };
  }

  public static headerRightIconOptions(params: {
    label: string;
    sfSymbol: string;
    ionicon: IconName;
    onPress: () => void;
    tintColor: string;
  }): {
    unstable_headerRightItems?: () => NativeStackHeaderItem[];
    headerRight?: () => React.ReactNode;
  } {
    if (Platform.OS === 'ios') {
      return {
        unstable_headerRightItems: () => [
          this.createIconButtonItem({
            label: params.label,
            sfSymbol: params.sfSymbol,
            onPress: params.onPress,
            tintColor: params.tintColor,
          }),
        ],
      };
    }

    return {
      headerRight: () =>
        React.createElement(HeaderIconButtonInner, {
          name: params.ionicon,
          onPress: params.onPress,
          tintColor: params.tintColor,
        }),
    };
  }
}

interface HeaderIconButtonInnerProps {
  name: IconName;
  onPress: () => void;
  tintColor: string;
  size?: number;
}

const HeaderIconButtonInner: React.FC<HeaderIconButtonInnerProps> = ({
  name,
  onPress,
  tintColor,
  size = 24,
}) =>
  React.createElement(
    Pressable,
    { onPress, style: { marginRight: 12, backgroundColor: 'transparent' } },
    React.createElement(Ionicons, { name, size, color: tintColor }),
  );
