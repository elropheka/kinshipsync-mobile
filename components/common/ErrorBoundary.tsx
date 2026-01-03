import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Wrapper component to use theme hook
const ErrorBoundaryContent: React.FC<{ 
  hasError: boolean; 
  error: Error | null; 
  onReset: () => void;
}> = ({ hasError, error, onReset }) => {
  const { currentColors } = useAppTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: currentColors.backgroundPrimary,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: currentColors.text,
    },
    message: {
      marginBottom: 20,
      color: currentColors.textSecondary,
    },
  });

  if (!hasError) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>
        {error?.message || 'Unknown error'}
      </Text>
      <Button 
        title="Try Again" 
        onPress={onReset}
        color={currentColors.primary}
      />
    </View>
  );
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryContent
          hasError={this.state.hasError}
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;