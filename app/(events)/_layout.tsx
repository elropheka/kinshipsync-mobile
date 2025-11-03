import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BackButton from '@/components/common/Navigation/BackButton'; // Import BackButton
import { Colors } from '@/constants/Colors'; // Import Colors for styling
import  fonts  from '@/constants/fonts';
// import { useAuth } from 'context/AuthContext';

// Inner component to handle auth and Stack setup
function EventsStack() {
  // const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   // It's generally better to handle this with route protection
  //   // or redirect, but for now, returning null mirrors original behavior.
  //   return null;
  // }

  return (
    <>
      <StatusBar 
        backgroundColor={Platform.OS === 'android' ? Colors.light.accent : undefined} 
        style={Platform.OS === 'ios' ? 'light' : 'auto'}
        translucent={Platform.OS === 'android' ? false : undefined} // On Android, false makes it a solid color bar
      />
      <Stack
        screenOptions={{
          headerShown: true, // Show header by default
        headerLeft: () => <BackButton />, // Use BackButton component
        headerTitleStyle: {
          fontFamily: 'Poppins', // Ensure this font is loaded
          color: 'white', // White title color
        },
        headerTintColor: 'white', // White color for all header icons
        headerStyle: {
          backgroundColor: Colors.dark.accent,
        },
        headerBackVisible: false, // We are using a custom back button
        presentation: 'card',
      }}
    >
      <Stack.Screen 
        name="all/index"
        options={{
          title: "My Events",
          // headerShown: false, // Removed, will inherit from screenOptions
        }}
      />
      <Stack.Screen 
        name="details/[id]"
        options={{
          title: "Event Details",
          // headerShown: false, // Removed, will inherit from screenOptions
        }}
      />
      <Stack.Screen 
        name="guests"
        options={{
          title: "Guest List",
          // headerShown: false, // Removed, will inherit from screenOptions
        }}
      />
      <Stack.Screen 
        name="budget/index"
        options={{
          title: "Budget",
          // headerShown: false, // Removed, will inherit from screenOptions
        }}
      />
      <Stack.Screen 
        name="chatArea"
        options={{
          title: "Chat", // Assuming this is a screen name, not a route group
          // headerShown: false, // Removed, will inherit from screenOptions
        }}
      />
      <Stack.Screen 
        name="createNewTeam"
        options={{
          title: "Create Team",
          // headerShown: false, // Removed, will inherit from screenOptions
        }}
      />
      <Stack.Screen 
        name="tasks"
        options={{
          title: "Tasks",
          // headerShown: false, // Removed, will inherit from screenOptions
        }}
      />
      <Stack.Screen 
        name="seating"
        options={{
          title: "Seating Plan",
          // headerShown: false, // Removed, will inherit from screenOptions
        }}
      />
      <Stack.Screen 
        name="schedule" // This should match a file like app/(events)/schedule.tsx or app/(events)/schedule/index.tsx
        options={{
          title: "Event Schedule",
          // headerShown: false,  // Removed, will inherit from screenOptions
        }}
      />
      <Stack.Screen 
        name="ideas" // This should match a file like app/(events)/ideas.tsx or app/(events)/ideas/index.tsx
        options={{
          title: "Event Ideas",
          // headerShown: false,  // Removed, will inherit from screenOptions
        }}
      />
      <Stack.Screen 
        name="createEvent"
        options={{
          title: "Create Event",
          headerShown: false, // Removed, will inherit from screenOptions
        }}
      />
      </Stack>
    </>
  );
}

// Default export is now simpler
export default function EventsLayout() {
  return <EventsStack />;
}
