import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Fonts from '@/constants/fonts';
import {
  Spacing,
  ResponsiveFontSizes,
  moderateScale,
  BorderRadius,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

      // Only auto-hide if there's no confirm button or cancel button
      if (autoHide && !onConfirm && !showCancelButton) {
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
  }, [visible, autoHide, autoHideDuration, onClose, onConfirm, showCancelButton]);

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
    switch (position) {
      case 'top':
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
      case 'center':
        return {
          top: SCREEN_HEIGHT / 2,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-SCREEN_HEIGHT / 2, -SCREEN_HEIGHT / 2],
              }),
            },
            {
              scale: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
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
    }
  };

  const alertStyles = getAlertStyles();
  const positionStyles = getPositionStyles();
  const hasActions = onConfirm || showCancelButton;
  const isModal = position === 'center' || position === 'bottom';

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const renderContent = () => (
    <Animated.View
      style={[
        !isModal && styles.alertContainer,
        !isModal && positionStyles,
        isModal && styles.modalContainer,
        isModal && {
          transform: positionStyles.transform,
        },
        {
          backgroundColor: alertStyles.backgroundColor,
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.content}>
          {showIcon && (
            <Ionicons
              name={alertStyles.iconName}
              size={moderateScale(20)}
              color={alertStyles.iconColor}
              style={styles.icon}
            />
          )}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: alertStyles.textColor }]} numberOfLines={2}>
              {title}
            </Text>
            {message && (
              <Text
                style={[styles.message, { color: alertStyles.textColor }]}
                numberOfLines={isModal ? undefined : 2}
              >
                {message}
              </Text>
            )}
          </View>
        </View>
        {closable && !hasActions && (
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close"
              size={moderateScale(20)}
              color={alertStyles.iconColor}
            />
          </TouchableOpacity>
        )}
      </View>

      {hasActions && (
        <View style={styles.actionsContainer}>
          {showCancelButton && (
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.actionButton,
                styles.cancelButton,
                { borderColor: alertStyles.textColor },
              ]}
            >
              <Text style={[styles.actionButtonText, { color: alertStyles.textColor }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
          )}
          {onConfirm && (
            <TouchableOpacity
              onPress={handleConfirm}
              style={[
                styles.actionButton,
                styles.confirmButton,
                { 
                  backgroundColor: alertStyles.textColor,
                  marginLeft: showCancelButton ? Spacing.s : 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  styles.confirmButtonText,
                  { color: alertStyles.backgroundColor },
                ]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Animated.View>
  );

  if (!visible) return null;

  // For center and bottom positions, wrap in Modal for better UX
  if (isModal) {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closable && !hasActions ? onClose : undefined}
        >
          <View onStartShouldSetResponder={() => true}>
            {renderContent()}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    zIndex: 9999,
  },
  modalContainer: {
    position: 'relative',
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
    borderRadius: BorderRadius.l,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    marginHorizontal: Spacing.l,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  icon: {
    marginRight: Spacing.s,
    marginTop: moderateScale(2),
  },
  title: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontFamily: Fonts.bodyMedium,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  message: {
    fontSize: ResponsiveFontSizes.body,
    fontFamily: Fonts.bodyMedium,
    opacity: 0.9,
    lineHeight: ResponsiveFontSizes.body * 1.4,
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.s,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.l,
    gap: Spacing.s,
  },
  actionButton: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.m,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  confirmButton: {
    // marginLeft will be set dynamically based on showCancelButton
  },
  actionButtonText: {
    fontSize: ResponsiveFontSizes.body,
    fontFamily: Fonts.bodyMedium,
    fontWeight: '600',
  },
  confirmButtonText: {
    // Color will be set dynamically
  },
});

export default CustomAlert;
