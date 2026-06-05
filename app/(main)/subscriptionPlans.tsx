import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createSubscriptionPlansStyles } from '@/styles/app/(main)/subscriptionPlans.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useCurrentUser } from '@/hooks/useUser';
import { Colors } from '@/constants/Colors';
import { useAlert } from '@/context/AlertContext';

const SubscriptionPlansScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createSubscriptionPlansStyles(currentColors);


  const { 
    availablePlans, 
    subscription: currentUserSubscription, 
    changeSubscription, 
    cancelSubscription, 
    isLoadingPlans, 
    isLoadingSubscription, 
    error 
  } = useCurrentUser();
  const { showSuccess, showError, showInfo, showConfirm } = useAlert();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    const selectedPlan = availablePlans.find(p => p.id === planId);
    if (!selectedPlan) return;

    const handleConfirmPlanChange = async () => {
      setIsProcessing(true);
      try {
        await changeSubscription({ newPlanId: planId, paymentMethodId: 'pm_mock_id' });
        showSuccess('Success!', `You have subscribed to the ${selectedPlan.name}.`);
      } catch (e) {
        console.error("Failed to change subscription:", e);
        showError('Error', (e as Error).message || 'Could not change subscription.');
      } finally {
        setIsProcessing(false);
      }
    };

    showConfirm(
      'info',
      'Confirm Plan Change',
      `Are you sure you want to switch to the ${selectedPlan.name}?`,
      handleConfirmPlanChange,
      {
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      }
    );
  };

  const handleCancelCurrentSubscription = async () => {
    if (!currentUserSubscription || currentUserSubscription.status !== 'active') {
      showError("No Active Subscription", "You do not have an active subscription to cancel.");
      return;
    }

    const handleConfirmCancellation = async () => {
      setIsProcessing(true);
      try {
        await cancelSubscription({ 
          reason: 'User initiated cancellation from app',
          cancelAtPeriodEnd: true
        });
        showSuccess('Subscription Cancelled', 'Your subscription has been set to cancel at the end of the current period.');
      } catch (e) {
        console.error("Failed to cancel subscription:", e);
        showError('Error', (e as Error).message || 'Could not cancel subscription.');
      } finally {
        setIsProcessing(false);
      }
    };

    showConfirm(
      'info',
      'Confirm Cancellation',
      'Are you sure you want to cancel your current subscription? This action may be irreversible depending on the terms.',
      handleConfirmCancellation,
      {
        confirmText: 'Cancel Subscription',
        cancelText: 'Keep Subscription',
      }
    );
  };
  
  if (isLoadingPlans && availablePlans.length === 0) {
    return (
      <SafeAreaView style={[styles.outerContainer, styles.centered]}>
        <ActivityIndicator size="large" color={currentColors.primary} />
        <Text>Loading plans...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.outerContainer, styles.centered]}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.outerContainer} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: "Subscription Plans" }} />
      <ScrollView style={styles.container}>
        <Text style={styles.introText}>Choose the plan that best fits your event planning needs.</Text>
        
        {currentUserSubscription && currentUserSubscription.status === 'active' && (
          <View style={styles.currentPlanInfoCard}>
            <Text style={styles.currentPlanInfoTitle}>Your Current Plan: {availablePlans.find(p => p.id === currentUserSubscription.planId)?.name || currentUserSubscription.planId}</Text>
            <Text style={styles.currentPlanInfoText}>Status: {currentUserSubscription.status}</Text>
            {currentUserSubscription.endDate && <Text style={styles.currentPlanInfoText}>Renews/Expires on: {new Date(currentUserSubscription.endDate).toLocaleDateString()}</Text>}
            <TouchableOpacity 
              style={[styles.selectButton, styles.cancelButton, (isProcessing || isLoadingSubscription) && styles.disabledButton]}
              onPress={handleCancelCurrentSubscription}
              disabled={isProcessing || isLoadingSubscription}
            >
              {isProcessing ? <ActivityIndicator color={currentColors.primaryContrastText} /> : <Text style={styles.selectButtonText}>Cancel Subscription</Text>}
            </TouchableOpacity>
          </View>
        )}

        {availablePlans.map((plan) => {
          const isCurrent = currentUserSubscription?.planId === plan.id && currentUserSubscription?.status === 'active';
          const planColor = plan.metadata?.color || '#757575';
          const planAccentColor = plan.metadata?.accentColor || '#f5f5f5';

          return (
            <View key={plan.id} style={[styles.planCard, {borderColor: planColor, backgroundColor: planAccentColor}]}>
              <View style={[styles.planHeader, {backgroundColor: planColor}]}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>
                  {plan.currency.toUpperCase()} {plan.price / 100} / {plan.interval} 
                </Text>
              </View>
              <View style={styles.featuresContainer}>
                {(plan.features ?? []).map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle-outline" size={18} color={planColor} style={styles.featureIcon} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  isCurrent ? styles.currentPlanButton : { backgroundColor: planColor },
                  (isProcessing || isLoadingSubscription) && !isCurrent && styles.disabledButton
                ]}
                onPress={() => handleSelectPlan(plan.id)}
                disabled={isCurrent || isProcessing || isLoadingSubscription}
              >
                {isProcessing && !isCurrent ? <ActivityIndicator color={currentColors.primaryContrastText} /> :
                <Text style={styles.selectButtonText}>
                  {isCurrent ? 'Current Plan' : 'Choose Plan'}
                </Text>}
              </TouchableOpacity>
            </View>
          );
        })}
         {availablePlans.length === 0 && !isLoadingPlans && (
            <Text style={styles.introText}>No subscription plans available at the moment.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionPlansScreen;
