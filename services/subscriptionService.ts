import {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  CouponValidationRequest,
  CouponValidationResponse,
  CancelSubscriptionRequest,
  CancelSubscriptionResponse,
} from '../types/userTypes';
import messagingApiClient from './messagingService';

export const createCheckoutSession = async (
  params: CheckoutSessionRequest & { userId: string; successUrl: string; cancelUrl: string }
): Promise<{ success: boolean; data?: CheckoutSessionResponse; message?: string; error?: string }> => {
  try {
    const response = await messagingApiClient.post('/checkout', params);
    return response.data;
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create checkout session',
      message: error.response?.data?.message || error.message,
    };
  }
};

export const cancelSubscription = async (
  params: CancelSubscriptionRequest
): Promise<{ success: boolean; data?: CancelSubscriptionResponse; message?: string; error?: string }> => {
  try {
    const response = await messagingApiClient.post('/subscription/cancel', params);
    return response.data;
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to cancel subscription',
      message: error.response?.data?.message || error.message,
    };
  }
};

export const validateCoupon = async (
  params: CouponValidationRequest
): Promise<{ success: boolean; data?: CouponValidationResponse; message?: string; error?: string }> => {
  try {
    const response = await messagingApiClient.post('/coupon/validate', params);
    return response.data;
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to validate coupon',
      message: error.response?.data?.message || error.message,
    };
  }
};
