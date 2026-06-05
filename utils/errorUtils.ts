import { AxiosError } from 'axios';
import { getAuthErrorMessage } from '@/utils/authErrorUtils';

const DEFAULT_MESSAGE = 'An unexpected error occurred. Please try again.';

export class ErrorMessageResolver {
  public static getErrorMessage(error: unknown, defaultMessage: string = DEFAULT_MESSAGE): string {
    if (!error) {
      return defaultMessage;
    }

    if (typeof error === 'string') {
      return error;
    }

    const axiosMessage = this.getAxiosErrorMessage(error);
    if (axiosMessage) {
      return axiosMessage;
    }

    if (this.isFirebaseAuthError(error)) {
      return getAuthErrorMessage(error, defaultMessage);
    }

    if (error instanceof Error) {
      return this.getErrorInstanceMessage(error, defaultMessage);
    }

    if (typeof error === 'object' && error !== null) {
      const record = error as Record<string, unknown>;
      if (typeof record.message === 'string' && record.message.length > 0) {
        return record.message;
      }
      if (typeof record.code === 'string' && record.code.startsWith('auth/')) {
        return getAuthErrorMessage(error, defaultMessage);
      }
    }

    return defaultMessage;
  }

  public static getApiErrorMessage(error: unknown, defaultMessage: string = DEFAULT_MESSAGE): string {
    return this.getAxiosErrorMessage(error) ?? this.getErrorMessage(error, defaultMessage);
  }

  private static getAxiosErrorMessage(error: unknown): string | null {
    if (!this.isAxiosError(error)) {
      return null;
    }

    const responseData = error.response?.data;
    if (responseData && typeof responseData === 'object' && responseData !== null) {
      const message = (responseData as { message?: unknown }).message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }

    if (error.response?.status === 401) {
      return 'Your session has expired. Please sign in again.';
    }

    if (error.response?.status === 403) {
      return "You don't have permission to access this resource.";
    }

    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }

    if (error.response?.status && error.response.status >= 500) {
      return 'A server error occurred. Please try again later.';
    }

    if (error.request && !error.response) {
      return 'Could not connect to the server. Please check your internet connection.';
    }

    return error.message || null;
  }

  private static getErrorInstanceMessage(error: Error, defaultMessage: string): string {
    const message = error.message;

    if (message.includes('auth/')) {
      return getAuthErrorMessage(error, defaultMessage);
    }

    if (message.includes('permission-denied')) {
      return 'You do not have permission to perform this action.';
    }

    if (message.includes('not-found')) {
      return 'The requested item was not found.';
    }

    if (message.includes('unavailable')) {
      return 'Service temporarily unavailable. Please try again later.';
    }

    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
      return 'Network error. Please check your connection and try again.';
    }

    if (message.length < 100 && !message.includes('Error:') && !message.includes('at ')) {
      return message;
    }

    return defaultMessage;
  }

  private static isFirebaseAuthError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as { code: unknown }).code === 'string' &&
      (error as { code: string }).code.startsWith('auth/')
    );
  }

  private static isAxiosError(error: unknown): error is AxiosError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'isAxiosError' in error &&
      (error as AxiosError).isAxiosError === true
    );
  }
}

export const getErrorMessage = ErrorMessageResolver.getErrorMessage.bind(ErrorMessageResolver);
export const getApiErrorMessage = ErrorMessageResolver.getApiErrorMessage.bind(ErrorMessageResolver);
