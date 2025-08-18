import React from 'react';
import { Modal, View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface ResponsiveModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  visible,
  onClose,
  children,
  style,
  animationType = 'fade',
  transparent = true,
}) => {
  const { isTablet, screenWidth } = useResponsiveLayout();

  const getModalStyle = (): ViewStyle => {
    if (isTablet) {
      // For tablets, use a larger modal with more padding
      const modalWidth = Math.min(screenWidth * 0.8, 800);
      const modalHeight = Math.min(Dimensions.get('window').height * 0.8, 600);
      
      return {
        width: modalWidth,
        height: modalHeight,
        margin: 20,
        borderRadius: 16,
        padding: 32,
      };
    }
    
    // For phones, use full screen with safe margins
    return {
      margin: 20,
      borderRadius: 12,
      padding: 20,
    };
  };

  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContent, getModalStyle(), style]}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
