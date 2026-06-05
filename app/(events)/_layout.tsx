import { Stack } from 'expo-router';
import React from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useAppTheme } from '@/context/AppThemeContext';
import { HeaderTheme } from '@/components/common/Navigation/HeaderTheme';
import { ColoredHeaderStatusBar } from '@/components/common/Navigation/ColoredHeaderStatusBar';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';

function eventPushedScreenOptions(
  title: string,
  tintColor: string,
  fallbackRoute: string = '/(main)/home',
): NativeStackNavigationOptions {
  return {
    title,
    ...HeaderButtonItems.headerLeftBackOptions(tintColor, 'onAccent', fallbackRoute),
  };
}

function EventsStack() {
  const { currentColors } = useAppTheme();
  const tintColor = currentColors.accentContrastText;

  return (
    <>
      <ColoredHeaderStatusBar backgroundColor={currentColors.accent} contentStyle="light" />
      <Stack
        screenOptions={{
          headerShown: true,
          presentation: 'card',
          ...HeaderTheme.accentSurfaceOptions(currentColors),
        }}
      >
        <Stack.Screen
          name="all/index"
          options={eventPushedScreenOptions('My Events', tintColor, '/(main)/home')}
        />
        <Stack.Screen
          name="details/[id]"
          options={eventPushedScreenOptions('Event Details', tintColor, '/(events)/all')}
        />
        <Stack.Screen
          name="guests"
          options={eventPushedScreenOptions('Guest List', tintColor)}
        />
        <Stack.Screen
          name="guests/[eventId]"
          options={eventPushedScreenOptions('Guest List', tintColor)}
        />
        <Stack.Screen name="rsvps" options={eventPushedScreenOptions('RSVPs', tintColor)} />
        <Stack.Screen name="themes" options={eventPushedScreenOptions('Event Theme', tintColor)} />
        <Stack.Screen name="website" options={eventPushedScreenOptions('Event Website', tintColor)} />
        <Stack.Screen name="messages" options={eventPushedScreenOptions('Event Messages', tintColor)} />
        <Stack.Screen
          name="budget/index"
          options={eventPushedScreenOptions('Budget', tintColor)}
        />
        <Stack.Screen
          name="createNewTeam"
          options={eventPushedScreenOptions('Create Team', tintColor)}
        />
        <Stack.Screen name="tasks" options={eventPushedScreenOptions('Tasks', tintColor)} />
        <Stack.Screen name="seating" options={eventPushedScreenOptions('Seating Plan', tintColor)} />
        <Stack.Screen
          name="schedule"
          options={eventPushedScreenOptions('Event Schedule', tintColor)}
        />
        <Stack.Screen name="ideas" options={eventPushedScreenOptions('Event Ideas', tintColor)} />
        <Stack.Screen
          name="createEvent"
          options={{
            title: 'Create Event',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="editEvent"
          options={{
            title: 'Edit Event',
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
