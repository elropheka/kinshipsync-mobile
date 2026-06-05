import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createGuestsStyles } from '../../../styles/app/(events)/guests.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '../../../hooks/useAppAuth';
import { useAlert } from '@/context/AlertContext';
import { listenToGuestsWithRsvp, getEventById, addGuestToEvent, removeGuestFromEvent } from '../../../services/eventService';
import { getUserProfileByEmail } from '../../../services/userService'; // Changed to getUserProfileByEmail
import { createDirectConversation, sendMessage } from '../../../services/chatService'; // Import sendMessage
import { Guest as GuestType, Event as EventType, CreateGuestPayload } from '../../../types/eventTypes';
import InviteGuestModal from '../../../components/events/InviteGuestModal';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';

const GUEST_STATUS_OPTIONS = ['All', 'Invited', 'Attending', 'Declined', 'Maybe'] as const;
type GuestStatusFilterType = typeof GUEST_STATUS_OPTIONS[number];

const SpecificEventGuestListScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createGuestsStyles(currentColors);


  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { user } = useAppAuth();
  const isAuthenticated = !!user;
  const { showError, showSuccess, showConfirm } = useAlert();

  const [fetchedGuests, setFetchedGuests] = useState<GuestType[]>([]);
  const [eventDetails, setEventDetails] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<GuestStatusFilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false); // State for modal

  useEffect(() => {
    if (!eventId) {
      setError(new Error("Event ID is missing. Cannot load guests."));
      setIsLoading(false);
      setFetchedGuests([]);
      setEventDetails(null);
      return;
    }
    if (!isAuthenticated) {
      setError(new Error("User not authenticated. Cannot load guests."));
      setIsLoading(false);
      setFetchedGuests([]);
      setEventDetails(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    getEventById(isAuthenticated, eventId)
      .then(details => setEventDetails(details))
      .catch(err => {
        console.error("Error fetching event details for guest list:", err);
      });

    const unsubscribe = listenToGuestsWithRsvp(
      isAuthenticated,
      eventId,
      (guestsFromDb) => {
        setFetchedGuests(guestsFromDb);
        setIsLoading(false);
        setError(null); 
      }
    );

    return () => unsubscribe();
  }, [eventId, isAuthenticated, user]);

  const displayedGuests = useMemo(() => {
    let guestsToDisplay = [...fetchedGuests];
    if (selectedStatusFilter !== 'All') {
      guestsToDisplay = guestsToDisplay.filter(guest => guest.status === selectedStatusFilter);
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      guestsToDisplay = guestsToDisplay.filter(
        guest =>
          guest.name.toLowerCase().includes(lowercasedQuery) ||
          (guest.email && guest.email.toLowerCase().includes(lowercasedQuery))
      );
    }
    return guestsToDisplay;
  }, [fetchedGuests, selectedStatusFilter, searchQuery]);

  const handleInviteGuestSubmit = async (guestData: CreateGuestPayload) => {
    if (!eventId || !isAuthenticated) {
      showError("Error", "Cannot invite guest. Event ID or authentication missing.");
      throw new Error("Event ID or auth missing"); // Throw error to be caught by modal
    }
    try {
      const invitedGuest = await addGuestToEvent(isAuthenticated, eventId, guestData);
      showSuccess("Success", `${invitedGuest.name} has been invited.`);
      setIsInviteModalVisible(false);

      if (guestData.email && user?.uid && eventId) {
        try {
          const invitedAppUser = await getUserProfileByEmail(guestData.email);
          if (invitedAppUser && invitedAppUser.userId !== user.uid) {
            console.log('Guest would be linked to user:', invitedAppUser.userId);

            const conversation = await createDirectConversation(isAuthenticated, user.uid, {
              recipientId: invitedAppUser.userId,
            });

            if (conversation) {
              const eventName = eventDetails?.name || 'an event';
              const invitationContent = `You've been invited to ${eventName}.`;
              await sendMessage(isAuthenticated, {
                conversationId: conversation.id,
                content: invitationContent,
                contentType: 'eventInvitation',
                eventId: eventId,
                guestId: invitedGuest.id,
                eventName: eventName,
                rsvpStatus: 'pending',
              }, user.uid);
              console.log(`Event invitation message sent to ${invitedAppUser.displayName || invitedAppUser.email}`);
            }
          } else if (invitedAppUser && invitedAppUser.userId === user.uid) {
            console.log("Invited guest is the current user, no DM sent.");
          } else {
            console.log(`Guest with email ${guestData.email} is not an existing app user. No DM invitation sent.`);
          }
        } catch (dmError: any) {
          console.error("Failed to send direct message or find user:", dmError.message);
        }
      }
    } catch (e: any) {
      showError("Error", `Failed to invite guest: ${e.message}`);
      throw e;
    }
  };

  const handleRemoveGuest = async (guestId: string, guestName: string) => {
    if (!eventId || !isAuthenticated) {
      showError("Error", "Cannot remove guest. Event ID or authentication missing.");
      return;
    }
    showConfirm(
      'warning',
      'Remove Guest',
      `Are you sure you want to remove ${guestName}?`,
      async () => {
        try {
          await removeGuestFromEvent(isAuthenticated, eventId, guestId);
          showSuccess("Success", `${guestName} has been removed.`);
        } catch (e: any) {
          showError("Error", `Failed to remove guest: ${e.message}`);
        }
      },
      {
        confirmText: 'Remove',
        cancelText: 'Cancel',
      }
    );
  };

  const renderGuestItem = ({ item }: { item: GuestType }) => (
    <View style={styles.guestItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.guestName}>{item.name}</Text>
        {item.email && <Text style={styles.guestEvent}>{item.email}</Text>}
      </View>
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusDot,
          { 
            backgroundColor: 
              item.status === 'accepted' ? currentColors.success :
              item.status === 'declined' ? currentColors.error :
              item.status === 'Invited' ? currentColors.info :
              item.status === 'pending' ? currentColors.warning :
              currentColors.textSecondary
          }
        ]} />
        <Text style={[
          styles.statusText,
          { 
            color: 
              item.status === 'accepted' ? currentColors.success :
              item.status === 'declined' ? currentColors.error :
              item.status === 'Invited' ? currentColors.info :
              item.status === 'pending' ? currentColors.warning :
              currentColors.textSecondary
          }
        ]}>
          {item.status}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveGuest(item.id, item.name)} style={{ marginLeft: 10, padding: 5 }}>
          <Ionicons name="trash-outline" size={22} color={currentColors.error} />
      </TouchableOpacity>
    </View>
  );

  if (isLoading && fetchedGuests.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['left', 'right', 'bottom']}>
        <ActivityIndicator size="large" color={currentColors.primary} />
        <Text style={{ marginTop: 10 }}>Loading guests for {eventDetails?.name || 'event'}...</Text>
      </SafeAreaView>
    );
  }

  if (error && !isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['left', 'right', 'bottom']}>
        <Text style={{ color: currentColors.error, textAlign: 'center', marginBottom: 10 }}>Error: {error.message}</Text>
        <TouchableOpacity onPress={() => {
            if (eventId && isAuthenticated) {
                setIsLoading(true); 
                setError(null);
            } else {
                showError("Cannot Retry", "Event ID or authentication is missing.");
            }
        }} style={{ marginTop: 10, padding: 10, backgroundColor: currentColors.tint, borderRadius: 5}}>
           <Text style={{color: currentColors.text}}>Tap to Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          title: eventDetails ? `Guests: ${eventDetails.name}` : (eventId ? `Guests (ID: ${eventId.substring(0,6)}...)` : 'Guest List'),
          ...HeaderButtonItems.headerRightActionsOptions(currentColors.accentContrastText, [
            {
              label: isSearchVisible ? 'Close search' : 'Search',
              sfSymbol: isSearchVisible ? 'xmark.circle' : 'magnifyingglass',
              ionicon: isSearchVisible ? 'close-circle-outline' : 'search',
              onPress: () => setIsSearchVisible(!isSearchVisible),
            },
            {
              label: 'Invite guest',
              sfSymbol: 'person.badge.plus',
              ionicon: 'person-add-outline',
              onPress: () => setIsInviteModalVisible(true),
            },
          ]),
        }}
      />
      
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={GUEST_STATUS_OPTIONS}
          keyExtractor={(item) => item}
          renderItem={({ item: filterName }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatusFilter === filterName && styles.selectedFilter,
              ]}
              onPress={() => setSelectedStatusFilter(filterName)}
            >
              <Text 
                style={[
                    styles.filterText, 
                    selectedStatusFilter === filterName && styles.activeFilterText
                ]}
              >
                {filterName}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 10 }}
        />
      </View>

      <View style={styles.guestCountContainer}>
        <Text style={styles.guestCount}>{displayedGuests.length} Guests</Text>
      </View>
      
      {isLoading && displayedGuests.length > 0 && <ActivityIndicator style={{marginVertical: 10}} size="small" color={currentColors.primary}/>}
      
      {displayedGuests.length === 0 && !isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
            <Text style={{fontSize: 16, color: currentColors.textSecondary, textAlign: 'center'}}>
                {searchQuery || selectedStatusFilter !== 'All' ? 'No guests match your criteria.' : `No guests found for ${eventDetails?.name || 'this event'}.`}
            </Text>
            {!(searchQuery || selectedStatusFilter !== 'All') && (
                 <TouchableOpacity onPress={() => setIsInviteModalVisible(true)} style={{marginTop: 15, paddingVertical:10, paddingHorizontal: 20, backgroundColor: currentColors.primary, borderRadius: 5}}>
                    <Text style={{color: currentColors.text, fontWeight: 'bold'}}>Invite First Guest</Text>
                 </TouchableOpacity>
            )}
        </View>
      ) : (
        <FlatList
          data={displayedGuests}
          renderItem={renderGuestItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.guestList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <InviteGuestModal 
        visible={isInviteModalVisible}
        onClose={() => setIsInviteModalVisible(false)}
        onSubmit={handleInviteGuestSubmit}
        currentEventName={eventDetails?.name}
      />
    </SafeAreaView>
  );
};

export default SpecificEventGuestListScreen;
