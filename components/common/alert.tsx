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
  position,
  showIcon = true,
  closable = true,
}) => {
  // Auto-position based on type: error -> top, success -> bottom, info -> center
  const autoPosition = position || (type === 'error' ? 'top' : type === 'success' ? 'bottom' : 'center');
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.8);
      bounceAnim.setValue(0);

      // Playful bounce animation sequence
      Animated.sequence([
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 150,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
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
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, autoHide, autoHideDuration]); // Animation values and handleClose are stable

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
          textColor: Colors.light.success,
        };
      case 'error':
        return {
          backgroundColor: Colors.light.errorLight,
          borderColor: Colors.light.error,
          iconColor: Colors.light.error,
          iconName: 'close-circle' as const,
          textColor: Colors.light.error,
        };
      case 'warning':
        return {
          backgroundColor: Colors.light.warningLight,
          borderColor: Colors.light.warning,
          iconColor: Colors.light.warning,
          iconName: 'warning' as const,
          textColor: Colors.light.warning,
        };
      case 'info':
        return {
          backgroundColor: Colors.light.infoLight,
          borderColor: Colors.light.info,
          iconColor: Colors.light.info,
          iconName: 'information-circle' as const,
          textColor: Colors.light.info,
        };
      default:
        return {
          backgroundColor: Colors.light.backgroundPaper,
          borderColor: Colors.light.primary,
          iconColor: Colors.light.primary,
          iconName: 'information-circle' as const,
          textColor: Colors.light.primary,
        };
    }
  };

  const getPositionStyles = () => {
    switch (autoPosition) {
      case 'top':
        return {
          top: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-150, 0],
              }),
            },
            {
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
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
            {
              scale: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
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
                outputRange: [150, 0],
              }),
            },
            {
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 8],
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

  // Only show overlay for center alerts (modal-like)
  const showOverlay = autoPosition === 'center';

  return (
    <>
      {showOverlay && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: opacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.15], // Lighter overlay for playful feel
              }),
            },
          ]}
          pointerEvents="auto"
        />
      )}
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
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: alertStyles.iconColor,
                  transform: [
                    {
                      scale: bounceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons
                name={alertStyles.iconName}
                size={moderateScale(28)}
                color={Colors.light.textLight}
              />
            </Animated.View>
          )}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: alertStyles.textColor }]}>{title}</Text>
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
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 128, 128, 0.15)', // Light teal overlay for playful feel
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 9999,
  },
  alertContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - Spacing.l * 2,
    maxWidth: moderateScale(400),
    borderRadius: moderateScale(20), // More rounded for playful feel
    borderWidth: 2, // Thicker border for more playful look
    shadowColor: Colors.light.text,
    shadowOffset: {
      width: 0,
      height: 8, // Deeper shadow for playful depth
    },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(12),
    elevation: 8,
    padding: Spacing.l,
    paddingVertical: Spacing.m + Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.s,
  },
  iconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24), // Fully rounded
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
    marginTop: moderateScale(2),
    shadowColor: Colors.light.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(6),
    elevation: 4,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.s,
  },
  title: {
    fontSize: ResponsiveFontSizes.subtitle + 2,
    fontFamily: Fonts.titleSemiBold,
    marginBottom: Spacing.xs,
    lineHeight: ResponsiveFontSizes.subtitle * 1.4,
  },
  message: {
    fontSize: ResponsiveFontSizes.body,
    fontFamily: Fonts.bodyRegular,
    lineHeight: ResponsiveFontSizes.body * 1.5,
  },
  closeButton: {
    padding: Spacing.xs,
    marginTop: moderateScale(2),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.s,
    marginTop: Spacing.m,
  },
  button: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s + 2,
    borderRadius: moderateScale(16), // More rounded buttons
    minWidth: moderateScale(80),
    alignItems: 'center',
    shadowColor: Colors.light.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(4),
    elevation: 3,
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
