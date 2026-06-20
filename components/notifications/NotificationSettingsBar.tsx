import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { BrandLoadingSpinner } from '@/components/ui/BrandLoadingSpinner';
import { useAppTheme } from '@/context/AppThemeContext';
import { createNotificationSettingsBarStyles } from '../../styles/components/notifications/NotificationSettingsBar.styles';

interface NotificationSettingsBarProps {
  showOnlyUnread: boolean;
  setShowOnlyUnread: (value: boolean) => void;
  onMarkAllRead: () => void;
  hasUnread: boolean;
  isMarkingAllRead?: boolean;
}

const NotificationSettingsBar: React.FC<NotificationSettingsBarProps> = ({
  showOnlyUnread,
  setShowOnlyUnread,
  onMarkAllRead,
  hasUnread,
  isMarkingAllRead = false,
}) => {
  const { currentColors } = useAppTheme();
  const styles = createNotificationSettingsBarStyles(currentColors);

  return (
    <View style={styles.container}>
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
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[
            styles.markAllReadButton,
            (!hasUnread || isMarkingAllRead) && styles.markAllReadButtonDisabled,
          ]}
          onPress={onMarkAllRead}
          disabled={!hasUnread || isMarkingAllRead}
          accessibilityLabel="Mark all as read"
        >
          {isMarkingAllRead ? (
            <BrandLoadingSpinner size="small" />
          ) : (
            <Text
              style={[
                styles.markAllReadText,
                !hasUnread && styles.markAllReadTextDisabled,
              ]}
            >
              Mark all as read
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationSettingsBar;
