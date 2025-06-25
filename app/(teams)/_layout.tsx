import React from 'react';
import { Stack } from 'expo-router'; // useRouter removed
// TouchableOpacity and Ionicons removed as they are now in BackButton
import BackButton from '@/components/common/Navigation/BackButton'; // Import BackButton
import { Colors } from '@/constants/Colors'; // Import Colors for styling

const TeamsLayout: React.FC = () => {
  // const router = useRouter(); // Removed as BackButton handles routing

  return (
    <Stack
      screenOptions={{ // Added screenOptions for consistency and to apply headerBackVisible
        headerShown: true,
        headerLeft: () => <BackButton />,
        headerBackVisible: false, // We are using a custom back button
         headerStyle: {
                  backgroundColor: Colors.light.backgroundPrimary,
                },
      }}
    >
      <Stack.Screen
        name="familyTree/[teamId]"
        options={{
          title: 'Family Tree',
          // headerShown and headerLeft are now in screenOptions
        }}
      />
      <Stack.Screen
        name="dashboard/[teamId]"
        options={{
          // Title will be set dynamically in the screen component
          // We can add a default title here if preferred: title: 'Team Dashboard'
          // headerShown and headerLeft are now in screenOptions
        }}
      />
      {/* Add other team-related screens here if needed in the future */}
    </Stack>
  );
};

export default TeamsLayout;
