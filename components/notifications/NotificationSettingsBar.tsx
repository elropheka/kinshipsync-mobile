import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { createNotificationSettingsBarStyles } from '../../styles/components/notifications/NotificationSettingsBar.styles';

interface NotificationSettingsBarProps {
  showOnlyUnread: boolean;
  setShowOnlyUnread: (value: boolean) => void;
}

const NotificationSettingsBar: React.FC<NotificationSettingsBarProps> = ({
  showOnlyUnread,
  setShowOnlyUnread,
}) => {
  const { currentColors } = useAppTheme();
  const styles = createNotificationSettingsBarStyles(currentColors);

  return (
    <View style={styles.notificationSettings}>
      <Text style={styles.settingsText}>Show only unread</Text>
      <Switch
        trackColor={{ false: currentColors.icon, true: currentColors.tint }}
        thumbColor={currentColors.backgroundLight}
        ios_backgroundColor={currentColors.icon}
        onValueChange={setShowOnlyUnread}
        value={showOnlyUnread}
      />
    </View>
  );
};

export default NotificationSettingsBar;
