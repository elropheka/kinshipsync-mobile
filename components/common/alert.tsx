import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Fonts from '@/constants/fonts';
import {
  Spacing,
  ResponsiveFontSizes,
  moderateScale,
} from '@/constants/dimensions';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  autoHide?: boolean;
  autoHideDuration?: number;
  position?: 'top' | 'center' | 'bottom';
  showIcon?: boolean;
  closable?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CustomAlert: React.FC<AlertProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancelButton = false,
  autoHide = true,
  autoHideDuration = 2000,
  position = 'top',
  showIcon = true,
  closable = true,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (autoHide) {
        const timer = setTimeout(() => {
          onClose();
        }, autoHideDuration);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, autoHide, autoHideDuration, onClose]);

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: Colors.light.success,
          iconColor: Colors.light.successContrastText,
          iconName: 'checkmark-circle' as const,
          textColor: Colors.light.successContrastText,
        };
      case 'error':
        return {
          backgroundColor: Colors.light.error,
          iconColor: Colors.light.errorContrastText,
          iconName: 'close-circle' as const,
          textColor: Colors.light.errorContrastText,
        };
      case 'warning':
        return {
          backgroundColor: Colors.light.warning,
          iconColor: Colors.light.warningContrastText,
          iconName: 'warning' as const,
          textColor: Colors.light.warningContrastText,
        };
      case 'info':
        return {
          backgroundColor: Colors.light.info,
          iconColor: Colors.light.infoContrastText,
          iconName: 'information-circle' as const,
          textColor: Colors.light.infoContrastText,
        };
      default:
        return {
          backgroundColor: Colors.light.primary,
          iconColor: Colors.light.primaryContrastText,
          iconName: 'information-circle' as const,
          textColor: Colors.light.primaryContrastText,
        };
    }
  };

  const getPositionStyles = () => {
    return {
      top: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
      transform: [
        {
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 0],
          }),
        },
      ],
    };
  };

  const alertStyles = getAlertStyles();
  const positionStyles = getPositionStyles();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.alertContainer,
        positionStyles,
        {
          backgroundColor: alertStyles.backgroundColor,
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.content}>
        {showIcon && (
          <Ionicons
            name={alertStyles.iconName}
            size={moderateScale(20)}
            color={alertStyles.iconColor}
            style={styles.icon}
          />
        )}
        <Text style={[styles.title, { color: alertStyles.textColor }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: Spacing.s,
  },
  title: {
    fontSize: ResponsiveFontSizes.body,
    fontFamily: Fonts.bodyMedium,
    textAlign: 'center',
  },
});

export default CustomAlert;
