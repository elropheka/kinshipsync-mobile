import React from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { BrandLoadingSpinner } from '@/components/ui/BrandLoadingSpinner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { createHomeStyles } from '@/styles/app/(main)/home.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useScrollHandler } from './_layout';
import { useAllEvents } from '@/hooks/useEvents';
import { useHomeDashboard } from '@/hooks/useHomeDashboard';
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
import { HomeGettingStarted } from '@/components/home/HomeGettingStarted';
import UpcomingEvents from '@/components/home/UpcomingEvents';

const DashboardScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createHomeStyles(currentColors);
  const { toggleSidebar } = useSidebar();
  const { user: authUser } = useAppAuth();
  const { events: allEvents, isLoading: isLoadingEvents, error: eventsError } = useAllEvents();
  const { featured, members, photos } = useHomeDashboard(allEvents);
  const { profile, notifications, isLoading: isLoadingUserContext } = useCurrentUser();
  const { handleScroll } = useScrollHandler();

  const welcomeName = profile?.displayName || authUser?.displayName || authUser?.email || 'Family';
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const isNewUser = !isLoadingEvents && allEvents.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.background} />
      <ResponsiveContainer>
        <ScreenHeader
          showLogo
          style={styles.screenHeader}
          onMenuPress={toggleSidebar}
          onNotificationPress={() => router.push('/notifications')}
          notificationCount={unreadCount}
        />

        <BrandText variant="h1" style={styles.dashboardTitle}>
          Welcome, {welcomeName}!
        </BrandText>

        <ScrollView
          style={styles.dashboardContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {isLoadingEvents && allEvents.length === 0 ? (
            <BrandLoadingSpinner size="small" style={styles.loadingSpinner} />
          ) : isNewUser ? (
            <HomeGettingStarted />
          ) : (
            <>
              <FeaturedEventCard event={featured} />

              <UpcomingEvents
                events={allEvents}
                onSeeAllPress={() => router.push('/(events)/all')}
                horizontal
              />

              <AttendingMembersRow members={members} />
              <PhotoGalleryStrip photos={photos} />
              <FeatureGrid />
            </>
          )}
          {eventsError ? <BrandText color="accent">Could not load events.</BrandText> : null}

          {isLoadingUserContext ? (
            <BrandLoadingSpinner size="small" style={styles.loadingSpinnerCompact} />
          ) : null}
        </ScrollView>
      </ResponsiveContainer>
    </SafeAreaView>
  );
};

export default DashboardScreen;
