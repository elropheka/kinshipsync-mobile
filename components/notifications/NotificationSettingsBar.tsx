import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { styles } from '../../styles/components/notifications/NotificationSettingsBar.styles';

interface NotificationSettingsBarProps {
  showOnlyUnread: boolean;
  setShowOnlyUnread: (value: boolean) => void;
}

const NotificationSettingsBar: React.FC<NotificationSettingsBarProps> = ({
  showOnlyUnread,
  setShowOnlyUnread,
}) => {
  const { currentColors } = useAppTheme();
  return (
    <View style={styles.notificationSettings}>
      <Text style={styles.settingsText}>Show only unread</Text>
      <Switch
        trackColor={{ false: currentColors.divider, true: currentColors.successLight }}
        thumbColor={currentColors.backgroundPaper}
        onValueChange={setShowOnlyUnread}
        value={showOnlyUnread}
      />
    </View>
  );
};

export default NotificationSettingsBar;
