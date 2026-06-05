import { Stack } from 'expo-router';
import React from 'react';
import { useAppTheme } from '@/context/AppThemeContext';
import { HeaderTheme } from '@/components/common/Navigation/HeaderTheme';
import { ColoredHeaderStatusBar } from '@/components/common/Navigation/ColoredHeaderStatusBar';

function EventsStack() {
  const { currentColors } = useAppTheme();

  return (
    <>
      <ColoredHeaderStatusBar backgroundColor={currentColors.accent} contentStyle="light" />
      <Stack
        screenOptions={{
          headerShown: true,
          presentation: 'card',
          ...HeaderTheme.accentOptions(currentColors),
        }}
      >
        <Stack.Screen
          name="all/index"
          options={{
            title: 'My Events',
          }}
        />
        <Stack.Screen
          name="details/[id]"
          options={{
            title: 'Event Details',
          }}
        />
        <Stack.Screen
          name="guests"
          options={{
            title: 'Guest List',
          }}
        />
        <Stack.Screen
          name="budget/index"
          options={{
            title: 'Budget',
          }}
        />
        <Stack.Screen
          name="createNewTeam"
          options={{
            title: 'Create Team',
          }}
        />
        <Stack.Screen
          name="tasks"
          options={{
            title: 'Tasks',
          }}
        />
        <Stack.Screen
          name="seating"
          options={{
            title: 'Seating Plan',
          }}
        />
        <Stack.Screen
          name="schedule"
          options={{
            title: 'Event Schedule',
          }}
        />
        <Stack.Screen
          name="ideas"
          options={{
            title: 'Event Ideas',
          }}
        />
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
