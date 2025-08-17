import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
  BorderRadius,
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
  autoHide = false,
  autoHideDuration = 3000,
  position = 'top',
  showIcon = true,
  closable = true,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.8);

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
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      if (autoHide) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoHideDuration);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, autoHide, autoHideDuration]);

  const handleClose = () => {
    if (closable) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: Colors.light.successLight,
          borderColor: Colors.light.success,
          iconColor: Colors.light.success,
          iconName: 'checkmark-circle' as const,
        };
      case 'error':
        return {
          backgroundColor: Colors.light.errorLight,
          borderColor: Colors.light.error,
          iconColor: Colors.light.error,
          iconName: 'close-circle' as const,
        };
      case 'warning':
        return {
          backgroundColor: Colors.light.warningLight,
          borderColor: Colors.light.warning,
          iconColor: Colors.light.warning,
          iconName: 'warning' as const,
        };
      case 'info':
        return {
          backgroundColor: Colors.light.infoLight,
          borderColor: Colors.light.info,
          iconColor: Colors.light.info,
          iconName: 'information-circle' as const,
        };
      default:
        return {
          backgroundColor: Colors.light.backgroundPaper,
          borderColor: Colors.light.border,
          iconColor: Colors.light.text,
          iconName: 'information-circle' as const,
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return {
          top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        };
      case 'center':
        return {
          top: '50%' as const,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, -50],
              }),
            },
          ],
        };
      case 'bottom':
        return {
          bottom: Platform.OS === 'ios' ? 34 : 20,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        };
      default:
        return {};
    }
  };

  const alertStyles = getAlertStyles();
  const positionStyles = getPositionStyles();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: opacityAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.alertContainer,
          positionStyles,
          {
            backgroundColor: alertStyles.backgroundColor,
            borderColor: alertStyles.borderColor,
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          {showIcon && (
            <View style={[styles.iconContainer, { backgroundColor: alertStyles.backgroundColor }]}>
              <Ionicons
                name={alertStyles.iconName}
                size={moderateScale(24)}
                color={alertStyles.iconColor}
              />
            </View>
          )}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: Colors.light.text }]}>{title}</Text>
            {message && (
              <Text style={[styles.message, { color: Colors.light.textSecondary }]}>
                {message}
              </Text>
            )}
          </View>
          {closable && (
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={moderateScale(20)}
                color={Colors.light.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Actions */}
        {(onConfirm || showCancelButton) && (
          <View style={styles.actionsContainer}>
            {showCancelButton && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={[styles.buttonText, { color: Colors.light.textSecondary }]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity
                style={[styles.button, styles.confirmButton, { backgroundColor: alertStyles.iconColor }]}
                onPress={handleConfirm}
              >
                <Text style={[styles.buttonText, { color: Colors.light.textLight }]}>
                  {confirmText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 9999,
  },
  alertContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - Spacing.l * 2,
    maxWidth: moderateScale(400),
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    shadowColor: Colors.light.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 5,
    padding: Spacing.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.s,
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.s,
    marginTop: moderateScale(2),
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.s,
  },
  title: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontFamily: Fonts.titleSemiBold,
    marginBottom: Spacing.xs,
    lineHeight: ResponsiveFontSizes.subtitle * 1.3,
  },
  message: {
    fontSize: ResponsiveFontSizes.body,
    fontFamily: Fonts.bodyRegular,
    lineHeight: ResponsiveFontSizes.body * 1.5,
  },
  closeButton: {
    padding: Spacing.xs,
    marginTop: moderateScale(2),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.s,
    marginTop: Spacing.m,
  },
  button: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.s,
    minWidth: moderateScale(80),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  confirmButton: {
  },
  buttonText: {
    fontSize: ResponsiveFontSizes.body,
    fontFamily: Fonts.buttonMedium,
    textAlign: 'center',
  },
});

export default CustomAlert;
