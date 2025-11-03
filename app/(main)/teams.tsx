import React from 'react';
import CommunicationPage from '../../components/common/Layout/teams';
import { StyleSheet, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/common/Navigation/BackButton';
import { Colors } from '../../constants/Colors';

const TeamsScreen: React.FC = () => {


  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.accent} />
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
