import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../../styles/components/common/Ads/InterstitialAdModal.styles';

interface InterstitialAdModalProps {
  visible: boolean;
  onClose: () => void;
  duration?: number; // Duration in milliseconds before auto-closing
}

const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  visible,
  onClose,
  duration = 3000, // Default to 3 seconds
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible && duration) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose} // For Android back button
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.adTitle}>Advertisement</Text>
          <View style={styles.adBody}>
            <Text style={styles.adText}>
              Your amazing ad content would appear here!
            </Text>
            <Text style={styles.adTextSmall}>
              (This is a simulated interstitial ad)
            </Text>
            <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 20}}/>
          </View>
          <Text style={styles.closingText}>
            {duration ? `Closing in ${Math.ceil(duration/1000)}s...` : 'Tap X to close'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default InterstitialAdModal;
