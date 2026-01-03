import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BackButton from '@/components/common/Navigation/BackButton';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/AppThemeContext';

function EventsStack() {
  const { currentColors } = useAppTheme();

  return (
    <>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? currentColors.backgroundSecondary : undefined}
        style="dark"
        translucent={Platform.OS === 'android' ? false : undefined}
      />
      <Stack
        screenOptions={{
          headerShown: true,
        headerLeft: () => <BackButton />,
        headerTitleStyle: {
          fontFamily: 'Poppins',
          color: 'white',
        },
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: currentColors.accent,
        },
        headerBackVisible: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen 
        name="all/index"
        options={{
          title: "My Events",
        }}
      />
      <Stack.Screen 
        name="details/[id]"
        options={{
          title: "Event Details",
        }}
      />
      <Stack.Screen 
        name="guests"
        options={{
          title: "Guest List",
        }}
      />
      <Stack.Screen 
        name="budget/index"
        options={{
          title: "Budget",
        }}
      />
      <Stack.Screen 
        name="chatArea"
        options={{
          title: "Chat",
        }}
      />
      <Stack.Screen 
        name="createNewTeam"
        options={{
          title: "Create Team",
        }}
      />
      <Stack.Screen 
        name="tasks"
        options={{
          title: "Tasks",
        }}
      />
      <Stack.Screen 
        name="seating"
        options={{
          title: "Seating Plan",
        }}
      />
      <Stack.Screen 
        name="schedule"
        options={{
          title: "Event Schedule",
        }}
      />
      <Stack.Screen 
        name="ideas"
        options={{
          title: "Event Ideas",
        }}
      />
      <Stack.Screen 
        name="createEvent"
        options={{
          title: "Create Event",
          headerShown: false,
        }}
      />
      </Stack>
    </>
  );
}

export default function EventsLayout() {
  return <EventsStack />;
}
