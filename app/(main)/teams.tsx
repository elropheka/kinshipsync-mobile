import React from 'react';
import CommunicationPage from '../../components/common/Layout/teams';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/AppThemeContext';
import { ColoredHeaderStatusBar } from '@/components/common/Navigation/ColoredHeaderStatusBar';

const TeamsScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = TeamsScreenStyles(currentColors.neutralBg);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ColoredHeaderStatusBar backgroundColor={currentColors.accent} contentStyle="light" />
      <Stack.Screen
        options={{
          title: 'Teams',
          headerShown: true,
        }}
      />
      <CommunicationPage />
    </SafeAreaView>
  );
};

const TeamsScreenStyles = (background: string) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: background,
    },
  });

export default TeamsScreen;
