import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for consistency
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(main)/subscriptionPlans.styles';
import { useCurrentUser } from '../../hooks/useUser';
import { SubscriptionPlan, UserSubscription } from '../../types/userTypes';
import { Colors } from 'constants/Colors';

const SubscriptionPlansScreen = () => {
  const router = useRouter();
  const { 
    availablePlans, 
    subscription: currentUserSubscription, 
    changeSubscription, 
    cancelSubscription, 
    isLoadingPlans, 
    isLoadingSubscription, 
    error 
  } = useCurrentUser();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    const selectedPlan = availablePlans.find(p => p.id === planId);
    if (!selectedPlan) return;

    Alert.alert(
      'Confirm Plan Change', 
      `Are you sure you want to switch to the ${selectedPlan.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: async () => {
            setIsProcessing(true);
            try {
              // The 'paymentMethodId' below is a placeholder. 
              // Actual implementation would involve a payment gateway integration.
              await changeSubscription({ newPlanId: planId, paymentMethodId: 'pm_mock_id' });
              Alert.alert('Success!', `You have subscribed to the ${selectedPlan.name}.`);
            } catch (e) {
              console.error("Failed to change subscription:", e);
              Alert.alert('Error', (e as Error).message || 'Could not change subscription.');
            } finally {
              setIsProcessing(false);
            }
          } 
        }
      ]
    );
  };

  const handleCancelCurrentSubscription = async () => {
    if (!currentUserSubscription || currentUserSubscription.status !== 'active') {
      Alert.alert("No Active Subscription", "You do not have an active subscription to cancel.");
      return;
    }
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel your current subscription? This action may be irreversible depending on the terms.',
      [
        { text: 'Keep Subscription', style: 'cancel'},
        { text: 'Cancel Subscription', style: 'destructive', onPress: async () => {
            setIsProcessing(true);
            try {
              await cancelSubscription({ 
                reason: 'User initiated cancellation from app',
                cancelAtPeriodEnd: true // Defaulting to cancel at period end
              });
              Alert.alert('Subscription Cancelled', 'Your subscription has been set to cancel at the end of the current period.');
            } catch (e) {
              console.error("Failed to cancel subscription:", e);
              Alert.alert('Error', (e as Error).message || 'Could not cancel subscription.');
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };
  
  if (isLoadingPlans && availablePlans.length === 0) {
    return (
      <SafeAreaView style={[styles.outerContainer, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
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
      {/* Custom header View removed */}
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
              {isProcessing ? <ActivityIndicator color={Colors.light.primaryContrastText} /> : <Text style={styles.selectButtonText}>Cancel Subscription</Text>}
            </TouchableOpacity>
          </View>
        )}

        {availablePlans.map((plan) => {
          const isCurrent = currentUserSubscription?.planId === plan.id && currentUserSubscription?.status === 'active';
          const planColor = plan.metadata?.color || '#757575'; // Default grey
          const planAccentColor = plan.metadata?.accentColor || '#f5f5f5';

          return (
            <View key={plan.id} style={[styles.planCard, {borderColor: planColor, backgroundColor: planAccentColor}]}>
              <View style={[styles.planHeader, {backgroundColor: planColor}]}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>
                  {plan.currency.toUpperCase()} {plan.price / 100} / {plan.interval} 
                  {/* Assuming price is in cents */}
                </Text>
              </View>
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
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
                {isProcessing && !isCurrent ? <ActivityIndicator color={Colors.light.primaryContrastText} /> :
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
