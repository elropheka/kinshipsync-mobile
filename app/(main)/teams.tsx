import React from 'react';
import CommunicationPage from '../../components/common/Layout/teams';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/common/Navigation/BackButton';
import { Colors } from '../../constants/Colors';
import { useAppTheme } from '@/context/AppThemeContext';

const TeamsScreen: React.FC = () => {
  const { currentColors } = useAppTheme();


  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <Stack.Screen
        options={{
          title: 'Teams',
          headerShown: true,
          headerLeft: () => <BackButton />,
          headerBackVisible: false,
        }}
      />
      <CommunicationPage />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default TeamsScreen;
