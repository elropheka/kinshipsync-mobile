import { Stack } from 'expo-router';
// Removed: import { useAuth } from 'context/AuthContext';

export default function AuthLayout() {
  // Removed: const { isAuthenticated } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen 
        name="splashScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="landingScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="signIn"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="createAccount"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="ForgotPasswordScreen"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="PasswordResetEmailSentScreen"
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </Stack>
  );
}
