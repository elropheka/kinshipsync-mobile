import React from 'react';
import CommunicationPage from '../../components/common/Layout/teams'; // Adjusted path
import { StyleSheet, StatusBar } from 'react-native'; // TouchableOpacity removed
import { Stack } from 'expo-router'; // useRouter removed
// Ionicons import removed as BackButton handles it
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/common/Navigation/BackButton'; // Import BackButton
import { Colors } from '../../constants/Colors';

const TeamsScreen: React.FC = () => {
  // const router = useRouter(); // Removed

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent} />
      <Stack.Screen
        options={{
          title: 'Teams',
          headerShown: true,
          headerLeft: () => <BackButton />, // Use BackButton component
          headerBackVisible: false, // We are using a custom back button
        }}
      />
      <CommunicationPage />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Or your app's background color
  },
});

export default TeamsScreen;
