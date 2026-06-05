import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { getErrorMessage } from '@/utils/errorUtils';

interface ErrorStateProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export class ErrorState extends React.Component<ErrorStateProps> {
  public render(): React.ReactNode {
    return <ErrorStateContent {...this.props} />;
  }
}

const ErrorStateContent: React.FC<ErrorStateProps> = ({
  error,
  title = 'Something went wrong',
  onRetry,
  retryLabel = 'Try Again',
}) => {
  const { currentColors } = useAppTheme();
  const message = getErrorMessage(error);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: currentColors.backgroundPrimary,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: currentColors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      fontSize: 15,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: currentColors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryText: {
      color: currentColors.primaryContrastText,
      fontWeight: '600',
      fontSize: 15,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ErrorState;
