import React from 'react';
import { Stack } from 'expo-router';
import BackButton from '@/components/common/Navigation/BackButton';
import { Colors } from '@/constants/Colors';

const TeamsLayout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => <BackButton />,
        headerBackVisible: false,
         headerStyle: {
                  backgroundColor: Colors.light.backgroundPrimary,
                },
      }}
    >
      <Stack.Screen
        name="familyTree/[teamId]"
        options={{
          title: 'Family Tree',
        }}
      />
      <Stack.Screen
        name="dashboard/[teamId]"
        options={{
        }}
      />
      {/* Add other team-related screens here if needed in the future */}
    </Stack>
  );
};

export default TeamsLayout;
