import React from 'react';
import { Stack } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { HeaderTheme } from '@/components/common/Navigation/HeaderTheme';

const TeamsLayout: React.FC = () => {
  const { currentColors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        ...HeaderTheme.lightOptions(currentColors),
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
        options={{}}
      />
    </Stack>
  );
};

export default TeamsLayout;
