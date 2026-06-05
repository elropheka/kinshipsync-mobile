import React from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { BrandLoadingSpinner } from '@/components/ui/BrandLoadingSpinner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { createHomeStyles } from '@/styles/app/(main)/home.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useScrollHandler } from './_layout';
import { useAllEvents } from '@/hooks/useEvents';
import { useCurrentUser } from '@/hooks/useUser';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useSidebar } from '@/context/SidebarContext';
import { ResponsiveContainer } from '@/components/common/Layout/ResponsiveContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { BrandText } from '@/components/ui/BrandText';
import { FeaturedEventCard } from '@/components/home/FeaturedEventCard';
import { AttendingMembersRow } from '@/components/home/AttendingMembersRow';
import { PhotoGalleryStrip } from '@/components/home/PhotoGalleryStrip';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import UpcomingEvents from '@/components/home/UpcomingEvents';

const DashboardScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createHomeStyles(currentColors);
  const { toggleSidebar } = useSidebar();
  const { user: authUser } = useAppAuth();
  const { events: allEvents, isLoading: isLoadingEvents, error: eventsError } = useAllEvents();
  const { notifications, isLoading: isLoadingUserContext } = useCurrentUser();
  const { handleScroll } = useScrollHandler();

  const welcomeName = authUser?.displayName || authUser?.email || 'Family';
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.background} />
      <ResponsiveContainer>
        <ScreenHeader
          showLogo
          onMenuPress={toggleSidebar}
          onNotificationPress={() => router.push('/notifications')}
          notificationCount={unreadCount}
        />

        <BrandText variant="h2" style={styles.dashboardTitle}>
          Welcome, {welcomeName}!
        </BrandText>

        <ScrollView
          style={styles.dashboardContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <FeaturedEventCard />

          {isLoadingEvents && allEvents.length === 0 ? (
            <BrandLoadingSpinner size="small" style={{ marginVertical: 20 }} />
          ) : null}
          {eventsError ? <BrandText color="accent">Could not load events.</BrandText> : null}

          <UpcomingEvents
            events={allEvents}
            onSeeAllPress={() => router.push('/(events)/all')}
            horizontal
          />

          <AttendingMembersRow />
          <PhotoGalleryStrip />
          <FeatureGrid />

          {isLoadingUserContext ? (
            <BrandLoadingSpinner size="small" style={{ marginVertical: 12 }} />
          ) : null}
        </ScrollView>
      </ResponsiveContainer>
    </SafeAreaView>
  );
};

export default DashboardScreen;
