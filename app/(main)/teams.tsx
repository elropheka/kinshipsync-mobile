import React from 'react';
import CommunicationPage from '../../components/common/Layout/teams';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/AppThemeContext';
import { ColoredHeaderStatusBar } from '@/components/common/Navigation/ColoredHeaderStatusBar';

const TeamsScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = TeamsScreenStyles(currentColors.neutralBg);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <ColoredHeaderStatusBar backgroundColor={currentColors.accent} contentStyle="light" />
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
