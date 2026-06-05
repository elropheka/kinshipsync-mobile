import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAuth } from '@/context/AuthContext';
import { deleteUserAccount, checkUserDataExists } from '@/services/accountDeletionService';
import { createDeleteAccountStyles } from '@/styles/app/(auth)/deleteAccount.styles';
import { useAlert } from '@/context/AlertContext';

interface DataCheckResult {
  hasEvents: boolean;
  hasTasks: boolean;
  hasConversations: boolean;
  hasNotifications: boolean;
}

const DeleteAccountScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createDeleteAccountStyles(currentColors);

  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isCheckingData, setIsCheckingData] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dataCheckResult, setDataCheckResult] = useState<DataCheckResult | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { showError, showSuccess, showConfirm } = useAlert();

  useEffect(() => {
    checkUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserData = async () => {
    if (!user?.uid) return;
    
    try {
      setIsCheckingData(true);
      const result = await checkUserDataExists(user.uid);
      setDataCheckResult(result);
    } catch (error) {
      console.error('Error checking user data:', error);
      showError('Error', 'Failed to check your data. Please try again.');
    } finally {
      setIsCheckingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.uid) return;

    showConfirm(
      'warning',
      'Delete Account',
      'Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.',
      () => setShowConfirmation(true),
      {
        confirmText: 'Delete Forever',
        cancelText: 'Cancel',
      }
    );
  };

  const confirmDeleteAccount = async () => {
    if (!user?.uid) return;

    setIsDeleting(true);
    try {
      const result = await deleteUserAccount(user.uid);
      
      if (result.success) {
        showSuccess(
          'Account Deleted',
          'Your account and all associated data have been permanently deleted.',
          {
            onConfirm: async () => {
              try {
                await signOut();
                router.replace('/(auth)/signIn');
              } catch (error) {
                console.error('Error signing out after deletion:', error);
                router.replace('/(auth)/signIn');
              }
            },
            showCancelButton: false,
          }
        );
      } else {
        showError('Deletion Failed', result.error || 'Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Error during account deletion:', error);
      showError('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  const getDataSummary = () => {
    if (!dataCheckResult) return [];
    
    const summary = [];
    if (dataCheckResult.hasEvents) summary.push('Events you\'ve organized');
    if (dataCheckResult.hasTasks) summary.push('Tasks assigned to you');
    if (dataCheckResult.hasConversations) summary.push('Chat conversations');
    if (dataCheckResult.hasNotifications) summary.push('Notifications');
    
    return summary;
  };

  const hasAnyData = dataCheckResult && (
    dataCheckResult.hasEvents || 
    dataCheckResult.hasTasks || 
    dataCheckResult.hasConversations || 
    dataCheckResult.hasNotifications
  );

  if (isCheckingData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentColors.primary} />
          <Text style={styles.loadingText}>Checking your data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom', 'top']}>
      <Stack.Screen 
        options={{ 
          title: "Delete Account",
          headerStyle: { backgroundColor: currentColors.background },
          headerTintColor: currentColors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={currentColors.text} />
            </TouchableOpacity>
          )
        }} 
      />
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Warning Header */}
        <View style={styles.warningHeader}>
          <Ionicons name="warning" size={48} color={currentColors.error} />
          <Text style={styles.warningTitle}>Delete Your Account</Text>
          <Text style={styles.warningSubtitle}>
            This action cannot be undone. All your data will be permanently deleted.
          </Text>
        </View>

        {/* Data Summary */}
        {hasAnyData && (
          <View style={styles.dataSection}>
            <Text style={styles.sectionTitle}>Data That Will Be Deleted</Text>
            {getDataSummary().map((item, index) => (
              <View key={index} style={styles.dataItem}>
                <Ionicons name="trash-outline" size={20} color={currentColors.error} />
                <Text style={styles.dataItemText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {!hasAnyData && (
          <View style={styles.noDataSection}>
            <Ionicons name="checkmark-circle-outline" size={48} color={currentColors.success} />
            <Text style={styles.noDataText}>No data found to delete</Text>
            <Text style={styles.noDataSubtext}>
              Your account appears to be clean with no associated data.
            </Text>
          </View>
        )}

        {/* What Happens Next */}
        <View style={styles.whatHappensSection}>
          <Text style={styles.sectionTitle}>What Happens Next</Text>
          <View style={styles.whatHappensItem}>
            <Ionicons name="close-circle-outline" size={20} color={currentColors.error} />
            <Text style={styles.whatHappensText}>Your account will be permanently deleted</Text>
          </View>
          <View style={styles.whatHappensItem}>
            <Ionicons name="trash-outline" size={20} color={currentColors.error} />
            <Text style={styles.whatHappensText}>All your data will be removed</Text>
          </View>
          <View style={styles.whatHappensItem}>
            <Ionicons name="log-out-outline" size={20} color={currentColors.error} />
            <Text style={styles.whatHappensText}>You&apos;ll be logged out immediately</Text>
          </View>
          <View style={styles.whatHappensItem}>
            <Ionicons name="information-circle-outline" size={20} color={currentColors.warning} />
            <Text style={styles.whatHappensText}>This action cannot be undone</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]} 
            onPress={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="trash" size={20} color="#fff" />
                <Text style={styles.deleteButtonText}>Delete My Account</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
            disabled={isDeleting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <Ionicons name="warning" size={48} color={currentColors.error} />
            <Text style={styles.confirmationTitle}>Final Confirmation</Text>
            <Text style={styles.confirmationText}>
              Are you absolutely sure you want to delete your account? This action cannot be undone.
            </Text>
            
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={styles.confirmDeleteButton} 
                onPress={confirmDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmDeleteButtonText}>Yes, Delete Forever</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelConfirmButton} 
                onPress={() => setShowConfirmation(false)}
                disabled={isDeleting}
              >
                <Text style={styles.cancelConfirmButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};



export default DeleteAccountScreen;
