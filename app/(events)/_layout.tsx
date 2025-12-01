import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BackButton from '@/components/common/Navigation/BackButton';
import { Colors } from '@/constants/Colors';
import  fonts  from '@/constants/fonts';

function EventsStack() {

  return (
    <>
      <StatusBar 
        backgroundColor={Platform.OS === 'android' ? Colors.light.accent : undefined} 
        style={Platform.OS === 'ios' ? 'light' : 'auto'}
        translucent={Platform.OS === 'android' ? false : undefined} // On Android, false makes it a solid color bar
        hidden={Platform.OS === 'android'}
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
          backgroundColor: Colors.dark.accent,
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
