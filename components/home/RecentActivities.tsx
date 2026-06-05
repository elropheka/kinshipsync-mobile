import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons as Icon, Ionicons as IconSecondary } from '@expo/vector-icons';
import { Notification as NotificationType } from '../../types/userTypes';
import { createHomeStyles } from '../../styles/app/(main)/home.styles';
import { useAppTheme } from '@/context/AppThemeContext'; 

const formatNotificationTime = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString(); 
};

const getActivityIconDetails = (type: NotificationType['type'], currentColors: typeof import('constants/Colors').Colors.light) => {
  let icon: JSX.Element;
  let bgColor: string;

  const highPriorityTypes = [
    'event_invite',
    'task_assigned',
    'schedule_conflict',
    'budget_milestone',
    'vendor_confirmation'
  ];
  
  const isHighPriority = highPriorityTypes.includes(type);

  switch (type) {
    case 'event_invite':
      icon = <IconSecondary name='mail-unread-outline' size={22} color={currentColors.primary} />;
      bgColor = currentColors.primaryLight;
      break;
    case 'event_update':
      icon = <IconSecondary name='refresh-circle-outline' size={24} color={currentColors.info} />;
      bgColor = currentColors.infoLight;
      break;
    case 'rsvp_update':
      icon = <Icon name='how-to-reg' size={22} color={currentColors.success} />;
      bgColor = currentColors.successLight;
      break;
    case 'new_message':
      icon = <IconSecondary name='chatbubble-ellipses-outline' size={22} color={currentColors.secondary} />;
      bgColor = currentColors.secondaryLight;
      break;
    case 'task_assigned':
      icon = <IconSecondary name='clipboard-outline' size={22} color={currentColors.warning} />;
      bgColor = currentColors.warningLight;
      break;
    case 'system_alert':
      icon = <Icon name='error-outline' size={22} color={currentColors.error} />;
      bgColor = currentColors.errorLight;
      break;
    case 'friend_request':
      icon = <IconSecondary name='person-add-outline' size={22} color={currentColors.tertiary} />;
      bgColor = currentColors.tertiaryLight;
      break;
    
    case 'team_member_added':
      icon = <IconSecondary name='people-outline' size={22} color={currentColors.primary} />;
      bgColor = currentColors.primaryLight;
      break;
    case 'family_tree_update':
      icon = <Icon name='account-tree' size={22} color={currentColors.tertiary} />;
      bgColor = currentColors.tertiaryLight;
      break;
    case 'team_task_update':
      icon = <IconSecondary name='checkmark-done-outline' size={22} color={currentColors.success} />;
      bgColor = currentColors.successLight;
      break;
    
    case 'vendor_booking':
    case 'vendor_confirmation':
    case 'vendor_quote':
      icon = <Icon name='store' size={22} color={currentColors.info} />;
      bgColor = currentColors.infoLight;
      break;
    case 'vendor_review':
      icon = <Icon name='rate-review' size={22} color={currentColors.warning} />;
      bgColor = currentColors.warningLight;
      break;
    
    case 'budget_item_added':
    case 'payment_made':
    case 'budget_milestone':
      icon = <IconSecondary name='cash-outline' size={22} color={currentColors.success} />;
      bgColor = currentColors.successLight;
      break;
    
    case 'rsvp_received':
    case 'guest_milestone':
    case 'dietary_preference':
      icon = <IconSecondary name='people-circle-outline' size={22} color={currentColors.primary} />;
      bgColor = currentColors.primaryLight;
      break;
    
    case 'schedule_added':
    case 'schedule_conflict':
    case 'schedule_reminder':
      icon = <IconSecondary name='calendar-outline' size={22} color={currentColors.warning} />;
      bgColor = currentColors.warningLight;
      break;
    
    case 'idea_submitted':
    case 'idea_popular':
    case 'idea_comment':
      icon = <IconSecondary name='bulb-outline' size={22} color={currentColors.tertiary} />;
      bgColor = currentColors.tertiaryLight;
      break;
    
    case 'website_published':
    case 'website_updated':
    case 'website_stats':
      icon = <IconSecondary name='globe-outline' size={22} color={currentColors.info} />;
      bgColor = currentColors.infoLight;
      break;
    
    case 'event_countdown':
    case 'planning_progress':
      icon = <IconSecondary name='trophy-outline' size={22} color={currentColors.warning} />;
      bgColor = currentColors.warningLight;
      break;
    
    case 'vendor_suggestion':
    case 'theme_recommendation':
    case 'task_reminder':
      icon = <IconSecondary name='sparkles-outline' size={22} color={currentColors.tertiary} />;
      bgColor = currentColors.tertiaryLight;
      break;
    
    case 'generic':
    default:
      icon = <IconSecondary name='notifications-outline' size={22} color={currentColors.textSecondary} />;
      bgColor = currentColors.backgroundLight;
      break;
  }

  return { 
    icon, 
    bgColor,
    isHighPriority
  };
};

interface RecentActivityItemProps {
  notification: NotificationType;
  onPress: () => void;
}

const RecentActivityItem: React.FC<RecentActivityItemProps & { currentColors: typeof import('constants/Colors').Colors.light; styles: ReturnType<typeof createHomeStyles> }> = ({ notification, onPress, currentColors, styles }) => {
  const { icon, bgColor, isHighPriority } = getActivityIconDetails(notification.type, currentColors);
  const displayMessage = notification.message || notification.title;

  const showActionButtons = ['task_assigned', 'rsvp_update', 'event_invite', 'vendor_quote'].includes(notification.type);

  return (
    <TouchableOpacity 
      style={[
        styles.activityItemCard, 
        { backgroundColor: currentColors.backgroundPaper },
        isHighPriority && styles.highPriorityActivityCard
      ]} 
      onPress={onPress}
    >
      <View style={[styles.activityIconCircle, { backgroundColor: bgColor }]}>
        {icon}
      </View>
      {isHighPriority && (
        <View style={styles.priorityIndicator}>
          <Icon name="priority-high" size={14} color="white" />
        </View>
      )}
      <View style={styles.activityTextContainer}>
        <Text style={styles.activityDescriptionText} numberOfLines={2} ellipsizeMode="tail">{displayMessage}</Text>
        <Text style={styles.activityTimeText}>{formatNotificationTime(notification.createdAt)}</Text>
        
        {showActionButtons && (
          <View style={styles.activityActions}>
            {notification.type === 'task_assigned' && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                }}
              >
                <Text style={styles.actionButtonText}>Mark Complete</Text>
              </TouchableOpacity>
            )}
            
            {notification.type === 'rsvp_update' && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                }}
              >
                <Text style={styles.actionButtonText}>View RSVPs</Text>
              </TouchableOpacity>
            )}
            
            {notification.type === 'event_invite' && (
              <View style={styles.actionButtonRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Text style={styles.actionButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.declineButton]}
                  onPress={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Text style={styles.actionButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {notification.type === 'vendor_quote' && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                }}
              >
                <Text style={styles.actionButtonText}>View Quote</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const groupSimilarNotifications = (notifications: NotificationType[]) => {
  const groups: { [key: string]: NotificationType[] } = {};
  
  notifications.forEach(notification => {
    let groupKey = notification.type;
    if (notification.referenceId) {
      groupKey += `-${notification.referenceId}`;
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(notification);
  });
  
  return Object.values(groups)
    .sort((a, b) => {
      return new Date(b[0].createdAt).getTime() - new Date(a[0].createdAt).getTime();
    });
};

const filterNotificationsByTime = (notifications: NotificationType[], filter: 'all' | 'today' | 'week' | 'month') => {
  if (filter === 'all') return notifications;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  
  return notifications.filter(notification => {
    const notificationDate = new Date(notification.createdAt);
    
    if (filter === 'today') {
      return notificationDate >= today;
    } else if (filter === 'week') {
      return notificationDate >= weekAgo;
    } else if (filter === 'month') {
      return notificationDate >= monthAgo;
    }
    
    return true;
  });
};

interface RecentActivitiesProps {
  notifications: NotificationType[];
  onActivityPress: (notificationId: string) => void;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ notifications, onActivityPress }) => {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createHomeStyles(currentColors), [currentColors]);
  
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const filteredNotifications = filterNotificationsByTime(notifications, timeFilter);
  const groupedNotifications = groupSimilarNotifications(filteredNotifications);
  
  return (
    <>
      <View style={[styles.sectionHeader, styles.recentActivityHeader]}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
      </View>
      
      <View style={styles.timeFilterContainer}>
        <TouchableOpacity
          style={[styles.timeFilterButton, timeFilter === 'all' && styles.timeFilterButtonActive]}
          onPress={() => setTimeFilter('all')}
        >
          <Text style={[styles.timeFilterText, timeFilter === 'all' && styles.timeFilterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeFilterButton, timeFilter === 'today' && styles.timeFilterButtonActive]}
          onPress={() => setTimeFilter('today')}
        >
          <Text style={[styles.timeFilterText, timeFilter === 'today' && styles.timeFilterTextActive]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeFilterButton, timeFilter === 'week' && styles.timeFilterButtonActive]}
          onPress={() => setTimeFilter('week')}
        >
          <Text style={[styles.timeFilterText, timeFilter === 'week' && styles.timeFilterTextActive]}>This Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeFilterButton, timeFilter === 'month' && styles.timeFilterButtonActive]}
          onPress={() => setTimeFilter('month')}
        >
          <Text style={[styles.timeFilterText, timeFilter === 'month' && styles.timeFilterTextActive]}>This Month</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        {groupedNotifications.length > 0 ? (
          groupedNotifications.map(group => {
            const primaryNotification = group[0];
            
            if (group.length === 1) {
              return (
                <RecentActivityItem
                  key={primaryNotification.id}
                  notification={primaryNotification}
                  onPress={() => onActivityPress(primaryNotification.id)}
                  currentColors={currentColors}
                  styles={styles}
                />
              );
            }
            
            const iconDetails = getActivityIconDetails(primaryNotification.type, currentColors);
            return (
              <View 
                key={primaryNotification.id}
                style={[styles.activityItemCard, { backgroundColor: currentColors.backgroundPaper }]} 
              >
                <View style={[styles.activityIconCircle, { backgroundColor: iconDetails.bgColor }]}>
                  {iconDetails.icon}
                </View>
                <View style={styles.activityTextContainer}>
                  <Text style={styles.activityDescriptionText} numberOfLines={2} ellipsizeMode="tail">
                    {group.length} {primaryNotification.type.replace('_', ' ')} activities
                  </Text>
                  <Text style={styles.activityTimeText}>{formatNotificationTime(primaryNotification.createdAt)}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noItemsText}>No recent activities.</Text>
        )}
      </View>
    </>
  );
};

export default RecentActivities;
