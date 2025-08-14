import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CustomAlert, { AlertType } from './alert';
import { Colors } from '../../constants/Colors';
import { Spacing, ResponsiveFontSizes } from '../../constants/dimensions';
import Fonts from '../../constants/fonts';

const AlertExample: React.FC = () => {
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: AlertType;
    title: string;
    message?: string;
    position?: 'top' | 'center' | 'bottom';
    showCancelButton?: boolean;
    autoHide?: boolean;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    position: 'top',
    showCancelButton: false,
    autoHide: false,
  });

  const showAlert = (
    type: AlertType,
    title: string,
    message?: string,
    position: 'top' | 'center' | 'bottom' = 'top',
    showCancelButton = false,
    autoHide = false
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      position,
      showCancelButton,
      autoHide,
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const handleConfirm = () => {
    console.log('Alert confirmed!');
    hideAlert();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Custom Alert Examples</Text>
      
      {/* Success Alert Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Success Alerts</Text>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.success }]}
          onPress={() => showAlert('success', 'Success!', 'Operation completed successfully.')}
        >
          <Text style={styles.buttonText}>Simple Success Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.success }]}
          onPress={() => showAlert(
            'success',
            'Account Created!',
            'Your account has been successfully created. Welcome to KinshipSync!',
            'center',
            true
          )}
        >
          <Text style={styles.buttonText}>Success with Actions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.success }]}
          onPress={() => showAlert(
            'success',
            'Auto-hide Success',
            'This alert will automatically disappear in 3 seconds.',
            'top',
            false,
            true
          )}
        >
          <Text style={styles.buttonText}>Auto-hide Success</Text>
        </TouchableOpacity>
      </View>

      {/* Error Alert Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Error Alerts</Text>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.error }]}
          onPress={() => showAlert('error', 'Error!', 'Something went wrong. Please try again.')}
        >
          <Text style={styles.buttonText}>Simple Error Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.error }]}
          onPress={() => showAlert(
            'error',
            'Connection Failed',
            'Unable to connect to the server. Please check your internet connection and try again.',
            'center',
            true
          )}
        >
          <Text style={styles.buttonText}>Error with Actions</Text>
        </TouchableOpacity>
      </View>

      {/* Warning Alert Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Warning Alerts</Text>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.warning }]}
          onPress={() => showAlert('warning', 'Warning!', 'Please review your input before proceeding.')}
        >
          <Text style={styles.buttonText}>Simple Warning Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.warning }]}
          onPress={() => showAlert(
            'warning',
            'Storage Space Low',
            'Your device storage is running low. Consider clearing some space.',
            'bottom',
            true
          )}
        >
          <Text style={styles.buttonText}>Bottom Position Warning</Text>
        </TouchableOpacity>
      </View>

      {/* Info Alert Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Info Alerts</Text>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.info }]}
          onPress={() => showAlert('info', 'Information', 'Here is some helpful information for you.')}
        >
          <Text style={styles.buttonText}>Simple Info Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.info }]}
          onPress={() => showAlert(
            'info',
            'New Feature Available',
            'We\'ve added new event planning tools! Check them out in the events section.',
            'center',
            true
          )}
        >
          <Text style={styles.buttonText}>Info with Actions</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Alert Component */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        position={alertConfig.position}
        showCancelButton={alertConfig.showCancelButton}
        onClose={hideAlert}
        onConfirm={alertConfig.showCancelButton ? handleConfirm : undefined}
        confirmText="OK"
        cancelText="Cancel"
        autoHide={alertConfig.autoHide}
        autoHideDuration={3000}
        showIcon={true}
        closable={true}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: Spacing.m,
  },
  header: {
    fontSize: ResponsiveFontSizes.header2,
    fontFamily: Fonts.headerSemiBold,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.l,
    marginTop: Spacing.m,
  },
  section: {
    marginBottom: Spacing.l,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontFamily: Fonts.titleSemiBold,
    color: Colors.light.text,
    marginBottom: Spacing.m,
  },
  button: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: 8,
    marginBottom: Spacing.s,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.light.textLight,
    fontSize: ResponsiveFontSizes.body,
    fontFamily: Fonts.buttonMedium,
  },
});

export default AlertExample;
