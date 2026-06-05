import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackButton, { type BackButtonContrast } from './BackButton';

type IconName = keyof typeof Ionicons.glyphMap;

export class HeaderButtonItems {
  public static headerLeftBackOptions(
    tintColor: string,
    contrast: BackButtonContrast = 'onAccent',
    fallbackRoute: string = '/home',
  ): {
    headerLeft: () => React.ReactNode;
    headerBackVisible: false;
  } {
    return {
      headerLeft: () =>
        React.createElement(BackButton, { contrast, tintColor, fallbackRoute }),
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
  ): { headerRight: () => React.ReactNode } {
    if (actions.length === 0) {
      return { headerRight: () => null };
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

  public static headerRightIconComponent(params: {
    label: string;
    ionicon: IconName;
    onPress: () => void;
    tintColor: string;
    size?: number;
  }): { headerRight: () => React.ReactNode } {
    return {
      headerRight: () =>
        React.createElement(HeaderIconButtonInner, {
          name: params.ionicon,
          onPress: params.onPress,
          tintColor: params.tintColor,
          size: params.size ?? 24,
        }),
    };
  }

  public static headerRightIconOptions(params: {
    label: string;
    sfSymbol: string;
    ionicon: IconName;
    onPress: () => void;
    tintColor: string;
  }): { headerRight: () => React.ReactNode } {
    return this.headerRightIconComponent({
      label: params.label,
      ionicon: params.ionicon,
      onPress: params.onPress,
      tintColor: params.tintColor,
    });
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
