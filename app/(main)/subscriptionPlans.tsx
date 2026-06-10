import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createSubscriptionPlansStyles } from '@/styles/app/(main)/subscriptionPlans.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useAlert } from '@/context/AlertContext';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { BrandText } from '@/components/ui';
import * as subscriptionService from '@/services/subscriptionService';

type BillingInterval = 'month' | 'year';

const SubscriptionPlansScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createSubscriptionPlansStyles(currentColors);

  const {
    subscription: currentUserSubscription,
    availablePlans,
    startCheckout,
    cancelUserSubscription,
    isLoading,
    isLoadingSubscription,
    error,
  } = useSubscription();
  const { showSuccess, showError, showConfirm } = useAlert();

  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ valid: boolean; message: string; discountValue?: number; discountType?: string } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const displayPrice = (plan: typeof availablePlans[0]) => {
    if (billingInterval === 'year' && plan.yearlyPrice) {
      return plan.yearlyPrice;
    }
    return plan.price;
  };

  const displayLabel = (plan: typeof availablePlans[0]) => {
    if (billingInterval === 'year' && plan.yearlyPrice) {
      const perMonth = Math.round(plan.yearlyPrice / 12);
      return `$${(plan.yearlyPrice / 100).toFixed(2)}/yr ($${(perMonth / 100).toFixed(2)}/mo)`;
    }
    return `$${(plan.price / 100).toFixed(2)}/mo`;
  };

  const yearlySavings = (plan: typeof availablePlans[0]) => {
    if (!plan.yearlyPrice) return null;
    const monthlyTotal = plan.price * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    if (savings <= 0) return null;
    return `Save ${(savings / 100).toFixed(2)}`;
  };

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponStatus(null);

    const activePlan = availablePlans.find(p => p.isActive);
    if (!activePlan) return;

    const result = await subscriptionService.validateCoupon({
      code: couponCode,
      planId: activePlan.id,
      interval: billingInterval,
    });

    if (result.success && result.data) {
      setCouponStatus({
        valid: result.data.valid,
        message: result.data.message || '',
        discountValue: result.data.discountValue,
        discountType: result.data.discountType,
      });
    } else {
      setCouponStatus({ valid: false, message: result.message || 'Could not validate coupon' });
    }
    setIsValidatingCoupon(false);
  };

  const handleSelectPlan = async (planId: string) => {
    const selectedPlan = availablePlans.find((p) => p.id === planId);
    if (!selectedPlan) return;

    const price = displayPrice(selectedPlan);
    if (price === 0) {
      showConfirm(
        'info',
        'Confirm Free Plan',
        `Are you sure you want to switch to the ${selectedPlan.name} plan?`,
        async () => {
          setIsProcessing(true);
          try {
            const success = await startCheckout(planId, billingInterval, couponStatus?.valid ? couponCode : undefined);
            if (success) {
              showSuccess('Success!', `You have subscribed to the ${selectedPlan.name} plan.`);
            }
          } catch (e) {
            showError('Error', (e as Error).message || 'Could not change subscription.');
          } finally {
            setIsProcessing(false);
          }
        },
        { confirmText: 'Confirm', cancelText: 'Cancel' }
      );
      return;
    }

    showConfirm(
      'info',
      'Confirm Plan',
      `Are you sure you want to subscribe to the ${selectedPlan.name} plan for ${displayLabel(selectedPlan)}?${couponStatus?.valid ? `\n\nCoupon applied: ${couponStatus.message}` : ''}`,
      async () => {
        setIsProcessing(true);
        try {
          const success = await startCheckout(planId, billingInterval, couponStatus?.valid ? couponCode : undefined);
          if (success) {
            showSuccess('Success!', `You have subscribed to the ${selectedPlan.name} plan.`);
          } else {
            showError('Checkout Cancelled', 'The payment process was cancelled.');
          }
        } catch (e) {
          showError('Error', (e as Error).message || 'Could not complete checkout.');
        } finally {
          setIsProcessing(false);
        }
      },
      { confirmText: 'Subscribe', cancelText: 'Cancel' }
    );
  };

  const handleCancelSubscription = async () => {
    if (!currentUserSubscription || currentUserSubscription.status !== 'active') {
      showError('No Active Subscription', 'You do not have an active subscription to cancel.');
      return;
    }

    showConfirm(
      'info',
      'Confirm Cancellation',
      'Are you sure you want to cancel your current subscription? You will lose access at the end of the current billing period.',
      async () => {
        setIsProcessing(true);
        try {
          const success = await cancelUserSubscription();
          if (success) {
            showSuccess('Subscription Cancelled', 'Your subscription has been cancelled.');
          } else {
            showError('Error', 'Could not cancel subscription.');
          }
        } catch (e) {
          showError('Error', (e as Error).message || 'Could not cancel subscription.');
        } finally {
          setIsProcessing(false);
        }
      },
      { confirmText: 'Cancel Subscription', cancelText: 'Keep Subscription' }
    );
  };

  if (isLoading && availablePlans.length === 0) {
    return <LoadingScreen />;
  }

  if (error && availablePlans.length === 0) {
    return (
      <SafeAreaView style={[styles.outerContainer, styles.centered]}>
        <BrandText color="accent">Error: {error.message}</BrandText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.outerContainer} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Subscription Plans' }} />
      <ScrollView style={styles.container}>
        <BrandText variant="body" style={styles.introText}>
          Choose the plan that best fits your event planning needs.
        </BrandText>

        {currentUserSubscription && currentUserSubscription.status === 'active' && (
          <View style={styles.currentPlanInfoCard}>
            <Text style={styles.currentPlanInfoTitle}>
              Your Current Plan: {availablePlans.find(p => p.id === currentUserSubscription.planId)?.name || currentUserSubscription.planId}
            </Text>
            <Text style={styles.currentPlanInfoText}>Status: {currentUserSubscription.status}</Text>
            {currentUserSubscription.nextBillingDate && (
              <Text style={styles.currentPlanInfoText}>
                Next Billing: {new Date(currentUserSubscription.nextBillingDate).toLocaleDateString()}
              </Text>
            )}
            <TouchableOpacity
              style={[styles.selectButton, styles.cancelButton, (isProcessing || isLoadingSubscription) && styles.disabledButton]}
              onPress={handleCancelSubscription}
              disabled={isProcessing || isLoadingSubscription}
            >
              <BrandText variant="button" color="light" style={styles.selectButtonText}>
                {isProcessing ? 'Cancelling...' : 'Cancel Subscription'}
              </BrandText>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.toggleOption, billingInterval === 'month' && styles.toggleOptionActive]}
            onPress={() => setBillingInterval('month')}
          >
            <BrandText variant="button" color={billingInterval === 'month' ? 'light' : 'secondary'}>
              Monthly
            </BrandText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleOption, billingInterval === 'year' && styles.toggleOptionActive]}
            onPress={() => setBillingInterval('year')}
          >
            <BrandText variant="button" color={billingInterval === 'year' ? 'light' : 'secondary'}>
              Yearly
            </BrandText>
          </TouchableOpacity>
        </View>

        {availablePlans.map((plan) => {
          const isCurrent = currentUserSubscription?.planId === plan.id && currentUserSubscription?.status === 'active';
          const planColor = plan.metadata?.color || '#757575';
          const planAccentColor = plan.metadata?.accentColor || '#f5f5f5';
          const savings = billingInterval === 'year' ? yearlySavings(plan) : null;

          return (
            <View key={plan.id} style={[styles.planCard, { borderColor: planColor, backgroundColor: planAccentColor }]}>
              <View style={[styles.planHeader, { backgroundColor: planColor }]}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{displayLabel(plan)}</Text>
                {savings && (
                  <Text style={styles.savingsBadge}>{savings}</Text>
                )}
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
                  (isProcessing || isLoadingSubscription) && !isCurrent && styles.disabledButton,
                ]}
                onPress={() => handleSelectPlan(plan.id)}
                disabled={isCurrent || isProcessing || isLoadingSubscription}
              >
                <BrandText variant="button" color="light" style={styles.selectButtonText}>
                  {isCurrent ? 'Current Plan' : displayPrice(plan) === 0 ? 'Select Free' : 'Subscribe'}
                </BrandText>
              </TouchableOpacity>
            </View>
          );
        })}

        {availablePlans.length > 0 && (
          <View style={styles.couponSection}>
            <BrandText variant="body" style={styles.couponLabel}>Have a coupon code?</BrandText>
            <View style={styles.couponRow}>
              <TextInput
                style={styles.couponInput}
                placeholder="Enter code"
                placeholderTextColor={currentColors.textSecondary}
                value={couponCode}
                onChangeText={(text) => {
                  setCouponCode(text.toUpperCase());
                  setCouponStatus(null);
                }}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.couponApplyButton, (!couponCode.trim() || isValidatingCoupon) && styles.disabledButton]}
                onPress={handleValidateCoupon}
                disabled={!couponCode.trim() || isValidatingCoupon}
              >
                <BrandText variant="button" color="light" style={styles.couponApplyText}>
                  {isValidatingCoupon ? '...' : 'Apply'}
                </BrandText>
              </TouchableOpacity>
            </View>
            {couponStatus && (
              <BrandText
                variant="caption"
                color={couponStatus.valid ? 'success' : 'error'}
                style={styles.couponStatus}
              >
                {couponStatus.message}
              </BrandText>
            )}
          </View>
        )}

        {availablePlans.length === 0 && !isLoading && (
          <Text style={styles.introText}>No subscription plans available at the moment.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionPlansScreen;
