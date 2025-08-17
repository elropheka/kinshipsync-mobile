import React from 'react';
import { View, Text, Switch } from 'react-native';
import { styles } from '../../styles/components/notifications/NotificationSettingsBar.styles';

interface NotificationSettingsBarProps {
  showOnlyUnread: boolean;
  setShowOnlyUnread: (value: boolean) => void;
}

const NotificationSettingsBar: React.FC<NotificationSettingsBarProps> = ({
  showOnlyUnread,
  setShowOnlyUnread,
}) => {
  return (
    <View style={styles.notificationSettings}>
      <Text style={styles.settingsText}>Show only unread</Text>
      <Switch
        trackColor={{ false: "#e0e0e0", true: "#8df5d3" }}
        thumbColor={"#fff"}
        onValueChange={setShowOnlyUnread}
        value={showOnlyUnread}
      />
    </View>
  );
};

export default NotificationSettingsBar;
